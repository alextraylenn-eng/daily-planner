"use client";

import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSwitcherProps {
  value: Date;
  onChange: (next: Date) => void;
}

export function DateSwitcher({ value, onChange }: DateSwitcherProps) {
  const formatted = useMemo(() => format(value, "EEEE, MMM d"), [value]);

  const go = (step: number) => {
    onChange(addDays(value, step));
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => go(-1)}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Previous day</span>
        </Button>
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Selected day</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="mt-1 flex items-center gap-2 rounded-full px-4">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-base font-semibold">{formatted}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="center">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => date && onChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => go(1)}
        >
          <ChevronRightIcon className="h-4 w-4" />
          <span className="sr-only">Next day</span>
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-full px-3 py-1", value.toDateString() === new Date().toDateString() && "border-primary text-primary")}
          onClick={() => onChange(new Date())}
        >
          Today
        </Button>
      </div>
    </div>
  );
}
