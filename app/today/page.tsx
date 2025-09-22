import { startOfTodayLocal, toDayString } from "@/lib/date";
import { TodayClient } from "./_components/today-client";

export default function TodayPage() {
  const today = startOfTodayLocal();
  return <TodayClient initialDate={toDayString(today)} />;
}
