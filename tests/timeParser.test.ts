import { describe, expect, it } from "vitest";
import { parseQuickAdd } from "@/lib/time-parser";

const today = new Date("2024-05-01T00:00:00");

describe("parseQuickAdd", () => {
  it("parses time, tags, context and bucket", () => {
    const result = parseQuickAdd("2:30 p review lecture 45m #BIOL112 @UNI !P", today);
    expect(result.title).toBe("review lecture");
    expect(result.durationMin).toBe(45);
    expect(result.tags).toEqual(["BIOL112"]);
    expect(result.context).toBe("UNI");
    expect(result.bucket).toBe("PRIORITY");
    expect(result.start).toBeInstanceOf(Date);
    expect(result.start?.getHours()).toBe(14);
    expect(result.start?.getMinutes()).toBe(30);
  });

  it("defaults to provided bucket when missing", () => {
    const result = parseQuickAdd("10:30 planning", today);
    expect(result.title).toBe("planning");
    expect(result.bucket).toBeUndefined();
    expect(result.start?.getHours()).toBe(10);
    expect(result.start?.getMinutes()).toBe(30);
  });

  it("ignores empty input", () => {
    const result = parseQuickAdd("", today);
    expect(result.title).toBe("");
    expect(result.tags).toEqual([]);
  });
});
