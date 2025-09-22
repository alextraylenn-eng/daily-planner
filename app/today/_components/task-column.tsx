"use client";

import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { TaskCard } from "./task-card";
import { TaskDraggable } from "./task-draggable";

interface TaskColumnProps {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  onAdd?: (value: string) => Promise<void> | void;
  onToggleDone: (task: Task, done: boolean) => void;
  onDelete: (task: Task) => void;
  showInput?: boolean;
  placeholder?: string;
}

export function TaskColumn({
  id,
  title,
  description,
  tasks,
  onAdd,
  onToggleDone,
  onDelete,
  showInput = false,
  placeholder
}: TaskColumnProps) {
  const [input, setInput] = useState("");

  const handleAdd = async () => {
    if (!input.trim() || !onAdd) return;
    await onAdd(input.trim());
    setInput("");
  };

  return (
    <Card className="flex h-full flex-col" data-column={id}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {showInput && (
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAdd();
                }
              }}
              placeholder={placeholder ?? "Add a task"}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handleAdd}
              disabled={!input.trim()}
            >
              <PlusCircleIcon className="h-4 w-4" />
              <span className="sr-only">Add task</span>
            </Button>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3">
          {tasks.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Nothing here yet.
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
