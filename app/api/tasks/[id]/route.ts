import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/validation";

function normalizeDay(date?: Date | null) {
  if (!date) return undefined;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const data = taskUpdateSchema.parse(json);

    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        ...data,
        date: normalizeDay(data.date) ?? undefined
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update task" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.task.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete task" }, { status: 400 });
  }
}
