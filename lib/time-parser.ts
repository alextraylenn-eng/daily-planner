import { addMinutes, startOfDay } from "date-fns";
import { Bucket, Context } from "@prisma/client";

export interface QuickAddParseResult {
  title: string;
  start?: Date;
  durationMin?: number;
  bucket?: Bucket;
  context?: Context;
  tags: string[];
}

const CONTEXT_LOOKUP = new Set(Object.values(Context));

const BUCKET_ALIASES: Record<string, Bucket> = {
  "!P": Bucket.PRIORITY,
  "!PRIORITY": Bucket.PRIORITY,
  "!SC": Bucket.SHOULD_COULD,
  "!SHOULD_COULD": Bucket.SHOULD_COULD
};

export function parseQuickAdd(input: string, day: Date): QuickAddParseResult {
  const result: QuickAddParseResult = {
    title: "",
    tags: []
  };
  if (!input.trim()) {
    return result;
  }

  const tokens = input.trim().split(/\s+/);
  const consumed = new Set<number>();

  let hours: number | null = null;
  let minutes: number | null = null;
  let meridiem: "AM" | "PM" | null = null;

  tokens.forEach((token, index) => {
    const upper = token.toUpperCase();

    if (upper in BUCKET_ALIASES) {
      result.bucket = BUCKET_ALIASES[upper];
      consumed.add(index);
      return;
    }

    if (token.startsWith("#") && token.length > 1) {
      result.tags.push(token.slice(1));
      consumed.add(index);
      return;
    }

    if (token.startsWith("@") && token.length > 1) {
      const ctx = token.slice(1).toUpperCase();
      if (CONTEXT_LOOKUP.has(ctx as Context)) {
        result.context = ctx as Context;
        consumed.add(index);
        return;
      }
    }

    const durationMatch = token.match(/^(\d+)(?:m|min)?$/i);
    if (durationMatch && /m|min/i.test(token)) {
      result.durationMin = Number(durationMatch[1]);
      consumed.add(index);
      return;
    }

    const timeMatch = token.match(/^(\d{1,2})(?::(\d{2}))?(am|pm|a|p)?$/i);
    if (timeMatch) {
      hours = Number(timeMatch[1]);
      minutes = timeMatch[2] ? Number(timeMatch[2]) : 0;
      const meridiemRaw = timeMatch[3]?.toUpperCase();
      if (meridiemRaw) {
        meridiem = meridiemRaw.startsWith("P") ? "PM" : "AM";
      }
      consumed.add(index);
      return;
    }

    if (!meridiem && (upper === "A" || upper === "AM" || upper === "P" || upper === "PM")) {
      meridiem = upper.startsWith("P") ? "PM" : "AM";
      consumed.add(index);
      return;
    }
  });

  if (hours !== null && minutes !== null) {
    let h = hours;
    if (meridiem === "AM" && h === 12) {
      h = 0;
    } else if (meridiem === "PM" && h < 12) {
      h += 12;
    }
    const base = startOfDay(day);
    result.start = addMinutes(base, h * 60 + minutes);
  }

  const titleTokens = tokens.filter((_, index) => !consumed.has(index));
  result.title = titleTokens.join(" ").trim();

  return result;
}
