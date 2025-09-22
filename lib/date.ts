import { format, parseISO, startOfDay, addMinutes } from "date-fns";

export const DAY_FORMAT = "yyyy-MM-dd";

export function toDayString(date: Date) {
  return format(date, DAY_FORMAT);
}

export function fromDayString(input: string) {
  return startOfDay(parseISO(input));
}

export function withTime(date: Date, time: { hours: number; minutes: number }) {
  const base = startOfDay(date);
  return addMinutes(base, time.hours * 60 + time.minutes);
}

export function startOfTodayLocal() {
  return startOfDay(new Date());
}
