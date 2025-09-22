"use client";

import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

import "react-day-picker/dist/style.css";

type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-2xl border border-border bg-popover p-3 text-sm shadow-lg", className)}
      classNames={{
        months: "flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100 inline-flex items-center justify-center rounded-full border border-transparent transition",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        ),
        nav_button_previous: "absolute left-1.5",
        nav_button_next: "absolute right-1.5",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "h-8 w-8 text-xs font-medium text-muted-foreground",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center text-sm p-0 relative",
        day: cn(
          "h-8 w-8 rounded-full p-0 font-normal transition-all hover:bg-primary/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "aria-selected:opacity-100"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        day_today: "text-primary font-semibold",
        day_outside: "text-muted-foreground/60",
        day_disabled: "text-muted-foreground/40 opacity-50",
        day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-primary",
        day_hidden: "invisible"
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
