import { z } from "zod";
import { Bucket, Context, Energy, Status } from "@prisma/client";

const isoDate = z.coerce.date({ invalid_type_error: "Invalid date" });

const tagsSchema = z.array(z.string()).optional();

export const taskCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().optional().nullable(),
    bucket: z.nativeEnum(Bucket).optional(),
    status: z.nativeEnum(Status).optional(),
    start: z.coerce.date().optional().nullable(),
    durationMin: z.coerce.number().int().positive().max(720).optional(),
    energy: z.nativeEnum(Energy).optional().nullable(),
    context: z.nativeEnum(Context).optional().nullable(),
    tags: tagsSchema,
    date: isoDate
  })
  .refine((data) => data.start == null || !Number.isNaN(data.start.getTime()), {
    message: "Invalid start date",
    path: ["start"]
  });

export const taskUpdateSchema = taskCreateSchema.partial().extend({
  tags: tagsSchema,
  date: isoDate.optional()
});

export const noteCreateSchema = z.object({
  title: z.string().min(1).max(140),
  body: z.string().optional().nullable(),
  date: isoDate,
  taskId: z.string().optional().nullable()
});

export const noteUpdateSchema = noteCreateSchema.partial();

export const dumpCreateSchema = z.object({
  title: z.string().min(1).max(140),
  notes: z.string().optional().nullable(),
  date: isoDate
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type NoteCreateInput = z.infer<typeof noteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
export type DumpCreateInput = z.infer<typeof dumpCreateSchema>;
