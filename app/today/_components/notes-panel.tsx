"use client";

import { useState } from "react";
import { StickyNoteIcon, Trash2Icon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Note, Task } from "@/types";

interface NotesPanelProps {
  notes: Note[];
  tasks: Task[];
  onAdd: (note: { title: string; body?: string; taskId?: string | null }) => Promise<void> | void;
  onDelete: (id: string) => void;
}

export function NotesPanel({ notes, tasks, onAdd, onDelete }: NotesPanelProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await onAdd({ title: title.trim(), body: body.trim() || undefined, taskId });
    setTitle("");
    setBody("");
    setTaskId(null);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <StickyNoteIcon className="h-5 w-5 text-primary" />
          <CardTitle>Notes</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Capture supporting details and optionally link to a task.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="space-y-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Note title" />
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Details"
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-2">
            <Select value={taskId ?? ""} onValueChange={(value) => setTaskId(value === "" ? null : value)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Link to task" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No link</SelectItem>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={!title.trim()} className="rounded-full">
              Add note
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No notes for this day yet.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-semibold">{note.title}</p>
                    {note.taskId && (
                      <p className="text-xs text-muted-foreground">Linked to task</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onDelete(note.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
                {note.body && <p className="mt-2 text-sm text-muted-foreground">{note.body}</p>}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
