"use client";

import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { TaskCard } from "./task-card";
import { TaskDraggable } from "./task-draggable";

interface ScheduledColumnProps {
  tasks: Task[];
  onQuickAdd: (value: string) => Promise<void> | void;
  onToggleDone: (task: Task, done: boolean) => void;
  onDelete: (task: Task) => void;
  isSubmitting?: boolean;
}

export function ScheduledColumn({
  tasks,
  onQuickAdd,
  onToggleDone,
  onDelete,
  isSubmitting
}: ScheduledColumnProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await onQuickAdd(input.trim());
    setInput("");
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scheduled (with time)</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="gap-2 rounded-full"
            onClick={handleSubmit}
            disabled={!input.trim() || isSubmitting}
          >
            <PlusCircleIcon className="h-4 w-4" />
            Add
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Drag to reorder time blocks.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="e.g. 10:30 write lab summary 30m #BIOL112 @UNI"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {tasks.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Nothing scheduled yet. Use the quick add to slot time blocks.
            </div>
          ) : (
            tasks.map((task) => (
              <TaskDraggable id={task.id} key={task.id}>
                <TaskCard task={task} onToggleDone={onToggleDone} onDelete={onDelete} />
              </TaskDraggable>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
