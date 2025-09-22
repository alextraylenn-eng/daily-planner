import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { taskCreateSchema } from "@/lib/validation";
import { startOfTodayLocal, fromDayString } from "@/lib/date";

function normalizeDay(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date");
  const day = dateParam ? fromDayString(dateParam) : startOfTodayLocal();

  const tasks = await prisma.task.findMany({
    where: {
      date: day
    },
    orderBy: [
      { start: "asc" },
      { createdAt: "asc" }
    ]
  });

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = taskCreateSchema.parse(json);
    const normalizedDate = normalizeDay(data.date);

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? undefined,
        bucket: data.bucket,
        status: data.status,
        start: data.start ?? undefined,
        durationMin: data.durationMin,
        energy: data.energy ?? undefined,
        context: data.context ?? undefined,
        tags: data.tags ?? [],
        date: normalizedDate
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create task" }, { status: 400 });
  }
}
