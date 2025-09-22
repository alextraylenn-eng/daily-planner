import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dumpCreateSchema } from "@/lib/validation";
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

  const dumpItems = await prisma.dumpItem.findMany({
    where: { date: day },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(dumpItems);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = dumpCreateSchema.parse(json);
    const normalized = normalizeDay(data.date);

    const item = await prisma.dumpItem.create({
      data: {
        title: data.title,
        notes: data.notes ?? undefined,
        date: normalized
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create dump item" }, { status: 400 });
  }
}
