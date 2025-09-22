import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { noteUpdateSchema } from "@/lib/validation";

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
    const data = noteUpdateSchema.parse(json);

    const note = await prisma.note.update({
      where: { id: params.id },
      data: {
        ...data,
        date: normalizeDay(data.date) ?? undefined
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update note" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.note.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete note" }, { status: 400 });
  }
}
