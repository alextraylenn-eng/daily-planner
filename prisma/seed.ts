import { PrismaClient, Bucket, Status, Energy, Context } from "@prisma/client";

const prisma = new PrismaClient();

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function at(date: Date, hours: number, minutes: number) {
  const base = startOfDay(date);
  base.setHours(hours, minutes, 0, 0);
  return base;
}

async function main() {
  const today = startOfDay(new Date());

  await prisma.dumpItem.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      {
        title: "Tutorial - BIOL112",
        bucket: Bucket.PRIORITY,
        status: Status.NOT_STARTED,
        start: at(today, 10, 0),
        durationMin: 60,
        context: Context.UNI,
        tags: ["BIOL112"],
        date: today
      },
      {
        title: "Ballet practice",
        bucket: Bucket.PRIORITY,
        status: Status.NOT_STARTED,
        start: at(today, 13, 0),
        durationMin: 90,
        context: Context.ANYWHERE,
        tags: ["movement"],
        date: today
      },
      {
        title: "Call with lab partner",
        bucket: Bucket.PRIORITY,
        status: Status.ON,
        start: at(today, 16, 30),
        durationMin: 30,
        context: Context.PHONE,
        tags: ["BIOL112"],
        date: today
      }
    ]
  });

  const priorityTasks = [
    {
      title: "Draft methods section",
      bucket: Bucket.PRIORITY,
      status: Status.NOT_STARTED,
      energy: Energy.HIGH,
      context: Context.COMPUTER,
      tags: ["BIOL112"],
      date: today
    },
    {
      title: "Review lecture notes",
      bucket: Bucket.PRIORITY,
      status: Status.NOT_STARTED,
      energy: Energy.MEDIUM,
      context: Context.COMPUTER,
      tags: ["study"],
      date: today
    },
    {
      title: "Prep questions for tutor",
      bucket: Bucket.PRIORITY,
      status: Status.NOT_STARTED,
      energy: Energy.LOW,
      context: Context.ANYWHERE,
      tags: ["prep"],
      date: today
    }
  ];

  for (const task of priorityTasks) {
    await prisma.task.create({ data: task });
  }

  const shouldCould = [
    {
      title: "Water plants",
      bucket: Bucket.SHOULD_COULD,
      status: Status.NOT_STARTED,
      context: Context.HOME,
      energy: Energy.LOW,
      date: today
    },
    {
      title: "Organise photo library",
      bucket: Bucket.SHOULD_COULD,
      status: Status.NOT_STARTED,
      context: Context.COMPUTER,
      energy: Energy.LOW,
      date: today
    },
    {
      title: "Book dentist",
      bucket: Bucket.SHOULD_COULD,
      status: Status.NOT_STARTED,
      context: Context.PHONE,
      energy: Energy.LOW,
      date: today
    }
  ];

  for (const task of shouldCould) {
    await prisma.task.create({ data: task });
  }

  await prisma.note.create({
    data: {
      title: "Remember",
      body: "Keep breaks short and hydrate.",
      date: today
    }
  });

  await prisma.note.createMany({
    data: [
      {
        title: "Lab reminder",
        body: "Collect the agar plates from the fridge before 9am.",
        date: today
      },
      {
        title: "Ballet combo",
        body: "Focus on spotting during turns.",
        date: today
      }
    ]
  });

  await prisma.dumpItem.createMany({
    data: [
      {
        title: "Ideas for study playlist",
        notes: "Find something upbeat but not distracting",
        date: today
      },
      {
        title: "Plan weekend hike",
        notes: "Check the weather and invite Maya",
        date: today
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
