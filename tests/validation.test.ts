import { describe, expect, it } from "vitest";
import {
  taskCreateSchema,
  taskUpdateSchema,
  noteCreateSchema,
  dumpCreateSchema
} from "@/lib/validation";
import { Bucket, Status } from "@/types";

const today = new Date("2024-05-02T00:00:00Z");

describe("validation schemas", () => {
  it("validates task creation", () => {
    const result = taskCreateSchema.safeParse({
      title: "Write report",
      bucket: Bucket.PRIORITY,
      status: Status.NOT_STARTED,
      date: today,
      tags: ["focus"]
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid start date", () => {
    const result = taskUpdateSchema.safeParse({ start: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("requires note title", () => {
    const result = noteCreateSchema.safeParse({ title: "", date: today });
    expect(result.success).toBe(false);
  });

  it("validates dump item creation", () => {
    const result = dumpCreateSchema.safeParse({ title: "Idea", date: today });
    expect(result.success).toBe(true);
  });
});
