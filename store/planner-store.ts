import { create } from "zustand";
import { Context, Energy, PlannerFilters } from "@/types";
import { toDayString } from "@/lib/date";

export interface PlannerState {
  selectedDate: string;
  filters: PlannerFilters;
  setDate: (date: Date) => void;
  setSearch: (value: string) => void;
  setContext: (value: Context | "ALL") => void;
  setEnergy: (value: Energy | "ALL") => void;
  setTag: (value: string | null) => void;
  toggleShowDone: () => void;
  resetFilters: () => void;
}

const initialFilters: PlannerFilters = {
  search: "",
  context: "ALL",
  energy: "ALL",
  tag: null,
  showDone: true
};

export const usePlannerStore = create<PlannerState>((set) => ({
  selectedDate: toDayString(new Date()),
  filters: initialFilters,
  setDate: (date) =>
    set({
      selectedDate: toDayString(date)
    }),
  setSearch: (value) =>
    set((state) => ({
      filters: { ...state.filters, search: value }
    })),
  setContext: (value) =>
    set((state) => ({
      filters: { ...state.filters, context: value }
    })),
  setEnergy: (value) =>
    set((state) => ({
      filters: { ...state.filters, energy: value }
    })),
  setTag: (value) =>
    set((state) => ({
      filters: { ...state.filters, tag: value }
    })),
  toggleShowDone: () =>
    set((state) => ({
      filters: { ...state.filters, showDone: !state.filters.showDone }
    })),
  resetFilters: () => set({ filters: initialFilters })
}));
