export type { Task, Note, DumpItem } from "@prisma/client";
export { Bucket, Status, Energy, Context } from "@prisma/client";

export interface PlannerFilters {
  search: string;
  context: Context | "ALL";
  energy: Energy | "ALL";
  tag: string | null;
  showDone: boolean;
}
