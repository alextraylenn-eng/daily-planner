"use client";

import { useMemo } from "react";
import { FilterIcon, SlashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Context, Energy, PlannerFilters } from "@/types";

interface SearchFiltersBarProps {
  filters: PlannerFilters;
  availableTags: string[];
  onSearch: (value: string) => void;
  onContext: (value: Context | "ALL") => void;
  onEnergy: (value: Energy | "ALL") => void;
  onTag: (value: string | null) => void;
  onToggleDone: () => void;
  onReset: () => void;
}

const contextOptions: (Context | "ALL")[] = ["ALL", ...Object.values(Context)];
const energyOptions: (Energy | "ALL")[] = ["ALL", ...Object.values(Energy)];

export function SearchFiltersBar({
  filters,
  availableTags,
  onSearch,
  onContext,
  onEnergy,
  onTag,
  onToggleDone,
  onReset
}: SearchFiltersBarProps) {
  const tagOptions = useMemo(() => Array.from(new Set(availableTags)), [availableTags]);

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <FilterIcon className="h-4 w-4" />
        Search & Filters
      </div>
      <Input
        value={filters.search}
        placeholder="Search tasks (#tag, title, context)"
        onChange={(event) => onSearch(event.target.value)}
      />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Select value={filters.context} onValueChange={(value) => onContext(value as Context | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Context" />
          </SelectTrigger>
          <SelectContent>
            {contextOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "ALL" ? "All contexts" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.energy} onValueChange={(value) => onEnergy(value as Energy | "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Energy" />
          </SelectTrigger>
          <SelectContent>
            {energyOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option === "ALL" ? "All energy" : option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Select
        value={filters.tag ?? ""}
        onValueChange={(value) => onTag(value === "" ? null : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="All tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All tags</SelectItem>
          {tagOptions.map((tag) => (
            <SelectItem key={tag} value={tag}>
              #{tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-done"
            checked={filters.showDone}
            onCheckedChange={() => onToggleDone()}
          />
          <Label htmlFor="show-done" className="text-sm text-muted-foreground">
            Show completed tasks
          </Label>
        </div>
        <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 rounded-full">
          <SlashIcon className="h-4 w-4" />
          <span className="sr-only">Reset filters</span>
        </Button>
      </div>
    </div>
  );
}
