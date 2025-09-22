import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { noteCreateSchema } from "@/lib/validation";
import { fromDayString, startOfTodayLocal } from "@/lib/date";

function normalizeDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const day = dateParam ? fromDayString(dateParam) : startOfTodayLocal();

  const notes = await prisma.note.findMany({
    where: {
      date: day
    },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = noteCreateSchema.parse(json);
    const normalized = normalizeDay(data.date);

    const note = await prisma.note.create({
      data: {
        title: data.title,
        body: data.body ?? undefined,
        date: normalized,
        taskId: data.taskId ?? undefined
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create note" }, { status: 400 });
  }
}
