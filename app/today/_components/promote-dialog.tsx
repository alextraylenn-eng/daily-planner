"use client";

import { useEffect, useState } from "react";
import { DumpItem, Bucket, Status, Energy, Context } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface PromotePayload {
  title: string;
  description?: string;
  bucket: Bucket;
  status: Status;
  startTime?: string;
  durationMin?: number;
  energy?: Energy | null;
  context?: Context | null;
  tags: string[];
  deleteOriginal: boolean;
}

interface PromoteDialogProps {
  trigger: React.ReactNode;
  item: DumpItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: PromotePayload) => Promise<void> | void;
}

const bucketOptions = Object.values(Bucket);
const statusOptions = Object.values(Status);
const energyOptions: (Energy | "NONE")[] = ["NONE", ...Object.values(Energy)];
const contextOptions: (Context | "NONE")[] = ["NONE", ...Object.values(Context)];

export function PromoteDialog({ trigger, item, open, onOpenChange, onSubmit }: PromoteDialogProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState("");
  const [bucket, setBucket] = useState<Bucket>(Bucket.PRIORITY);
  const [status, setStatus] = useState<Status>(Status.NOT_STARTED);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [context, setContext] = useState<Context | null>(null);
  const [tags, setTags] = useState<string>("");
  const [deleteOriginal, setDeleteOriginal] = useState(true);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.notes ?? "");
    }
  }, [item]);

  const handleSubmit = async () => {
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      bucket,
      status,
      startTime: startTime.trim() || undefined,
      durationMin: duration ? Number(duration) : undefined,
      energy,
      context,
      tags: tags
        .split(/[,\s]+/)
        .map((tag) => tag.replace(/^#/, "").trim())
        .filter(Boolean),
      deleteOriginal
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Promote to Task</DialogTitle>
          <DialogDescription>
            Turn this brain dump idea into a scheduled or priority task.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="promote-title">Title</Label>
            <Input id="promote-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="promote-notes">Notes</Label>
            <Textarea
              id="promote-notes"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Bucket</Label>
              <Select value={bucket} onValueChange={(value) => setBucket(value as Bucket)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bucketOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="promote-start">Start time (HH:mm)</Label>
              <Input
                id="promote-start"
                placeholder="14:30"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="promote-duration">Duration (minutes)</Label>
              <Input
                id="promote-duration"
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Energy</Label>
              <Select value={energy ?? "NONE"} onValueChange={(value) => setEnergy(value === "NONE" ? null : (value as Energy))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select energy" />
                </SelectTrigger>
                <SelectContent>
                  {energyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "NONE" ? "None" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Context</Label>
              <Select value={context ?? "NONE"} onValueChange={(value) => setContext(value === "NONE" ? null : (value as Context))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select context" />
                </SelectTrigger>
                <SelectContent>
                  {contextOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "NONE" ? "None" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="promote-tags">Tags (comma or space separated)</Label>
            <Input
              id="promote-tags"
              placeholder="#deepwork writing"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="promote-delete"
              checked={deleteOriginal}
              onCheckedChange={(checked) => setDeleteOriginal(Boolean(checked))}
            />
            <Label htmlFor="promote-delete" className="text-sm text-muted-foreground">
              Remove dump item after creating the task
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-full"
          >
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
