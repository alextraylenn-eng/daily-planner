"use client";

import { format } from "date-fns";
import { ClockIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatMinutes, cn } from "@/lib/utils";
import { Energy, Status, Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggleDone: (task: Task, done: boolean) => void;
  onDelete: (task: Task) => void;
  highlight?: boolean;
  className?: string;
}

const energyCopy: Record<Energy, string> = {
  LOW: "Low energy",
  MEDIUM: "Medium",
  HIGH: "High energy"
};

export function TaskCard({ task, onToggleDone, onDelete, highlight, className }: TaskCardProps) {
  const isDone = task.status === Status.DONE;
  const timeLabel = task.start ? format(new Date(task.start), "HH:mm") : null;
  const duration = formatMinutes(task.durationMin);

  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft",
        isDone && "opacity-60",
        highlight && "ring-1 ring-primary/40",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) => onToggleDone(task, Boolean(checked))}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className={cn("text-base font-semibold", isDone && "line-through")}>{task.title}</p>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              {timeLabel && (
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {timeLabel}
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 transition group-hover:opacity-100"
                    onClick={() => onDelete(task)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete task</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {duration && <Badge variant="muted">{duration}</Badge>}
            {task.energy && <Badge variant="outline">{energyCopy[task.energy]}</Badge>}
            {task.context && <Badge variant="outline">@{task.context}</Badge>}
            {task.tags?.map((tag) => (
              <Badge key={tag} variant="muted">
                #{tag}
              </Badge>
            ))}
            {task.status === Status.ON && <Badge variant="default">In progress</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}
