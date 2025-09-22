"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface TaskDraggableProps {
  id: string;
  className?: string;
}

export function TaskDraggable({ id, className, children }: PropsWithChildren<TaskDraggableProps>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "z-30", className)}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
