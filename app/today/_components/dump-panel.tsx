"use client";

import { useState } from "react";
import { LightbulbIcon, Trash2Icon, ArrowUpRightIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DumpItem } from "@/types";
import { PromoteDialog, PromotePayload } from "./promote-dialog";

interface DumpPanelProps {
  items: DumpItem[];
  onAdd: (title: string) => Promise<void> | void;
  onDelete: (id: string) => void;
  onPromote: (item: DumpItem, payload: PromotePayload) => Promise<void> | void;
}

export function DumpPanel({ items, onAdd, onDelete, onPromote }: DumpPanelProps) {
  const [title, setTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<DumpItem | null>(null);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await onAdd(title.trim());
    setTitle("");
  };

  const openDialog = (item: DumpItem) => {
    setSelected(item);
    setDialogOpen(true);
  };

  const handlePromote = async (payload: PromotePayload) => {
    if (!selected) return;
    await onPromote(selected, payload);
    setDialogOpen(false);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-primary" />
          <CardTitle>Dump Box</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">Brain-dump ideas to promote into tasks later.</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-muted/20 p-3">
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Capture a quick thought"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={handleAdd}
            disabled={!title.trim()}
          >
            <ArrowUpRightIcon className="h-4 w-4" />
            <span className="sr-only">Add idea</span>
          </Button>
        </div>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Empty brain — jot down whatever is on your mind.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <p className="text-base font-semibold">{item.title}</p>
                  {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => openDialog(item)}
                  >
                    Promote
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <PromoteDialog
        trigger={<span />}
        item={selected}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
          setDialogOpen(open);
        }}
        onSubmit={handlePromote}
      />
    </Card>
  );
}
