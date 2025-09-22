"use client";

import { useEffect, useState } from "react";
import { SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn, truncate } from "@/lib/utils";

interface RememberCardProps {
  value: string;
  onSave: (value: string) => Promise<void> | void;
  isSaving?: boolean;
}

const MAX_LENGTH = 280;

export function RememberCard({ value, onSave, isSaving }: RememberCardProps) {
  const [draft, setDraft] = useState(value);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) {
      setDraft(value);
    }
  }, [value, touched]);

  const handleBlur = () => {
    const trimmed = draft.trim();
    if (trimmed === value.trim()) return;
    onSave(truncate(trimmed, MAX_LENGTH));
    setTouched(false);
  };

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Remember</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {draft.length}/{MAX_LENGTH}
        </span>
      </div>
      <Textarea
        className={cn("min-h-[160px] resize-none rounded-2xl border-none bg-muted/50 p-4 text-base shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40", isSaving && "opacity-80")}
        value={draft}
        maxLength={MAX_LENGTH}
        onChange={(event) => {
          setDraft(event.target.value);
          setTouched(true);
        }}
        onBlur={handleBlur}
        placeholder="Capture the single most important reminder for today..."
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Autosaves on blur · linked to today</span>
        {isSaving ? <span className="animate-pulse">Saving…</span> : <Button variant="ghost" size="sm" onClick={handleBlur}>Save now</Button>}
      </div>
    </Card>
  );
}
