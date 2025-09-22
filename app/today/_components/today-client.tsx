"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { addMinutes } from "date-fns";

import { usePlannerStore } from "@/store/planner-store";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  getDumpItems,
  createDumpItem,
  deleteDumpItem
} from "@/lib/api-client";
import { parseQuickAdd } from "@/lib/time-parser";
import { fromDayString } from "@/lib/date";
import { Bucket, DumpItem, Note, PlannerFilters, Status, Task } from "@/types";
import { DateSwitcher } from "./date-switcher";
import { SearchFiltersBar } from "./search-filters-bar";
import { RememberCard } from "./remember-card";
import { ScheduledColumn } from "./scheduled-column";
import { TaskColumn } from "./task-column";
import { NotesPanel } from "./notes-panel";
import { DumpPanel } from "./dump-panel";
import { PromotePayload } from "./promote-dialog";

interface TodayClientProps {
  initialDate: string;
}

type ColumnId = "scheduled" | "on" | "priority" | "should";

const columnOrder: ColumnId[] = ["scheduled", "on", "priority", "should"];

export function TodayClient({ initialDate }: TodayClientProps) {
  const queryClient = useQueryClient();
  const {
    selectedDate,
    setDate,
    filters,
    setSearch,
    setContext,
    setEnergy,
    setTag,
    toggleShowDone,
    resetFilters
  } = usePlannerStore();

  useEffect(() => {
    setDate(fromDayString(initialDate));
  }, [initialDate, setDate]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tasksKey = ["tasks", selectedDate];
  const notesKey = ["notes", selectedDate];
  const dumpKey = ["dump", selectedDate];

  const { data: tasks = [] } = useQuery({
    queryKey: tasksKey,
    queryFn: () => getTasks(selectedDate)
  });

  const { data: notes = [] } = useQuery({
    queryKey: notesKey,
    queryFn: () => getNotes(selectedDate)
  });

  const { data: dumpItems = [] } = useQuery({
    queryKey: dumpKey,
    queryFn: () => getDumpItems(selectedDate)
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) => [...old, task]);
      toast.success("Task created");
    },
    onError: () => toast.error("Unable to create task")
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateTask(id, data as any),
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) => old.map((item) => (item.id === task.id ? task : item)));
    },
    onError: () => toast.error("Unable to update task")
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old = []) => old.filter((task) => task.id !== id));
      toast.success("Task removed");
    },
    onError: () => toast.error("Unable to delete task")
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      queryClient.setQueryData<Note[]>(notesKey, (old = []) => [...old, note]);
      toast.success("Note added");
    },
    onError: () => toast.error("Unable to create note")
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateNote(id, data as any),
    onSuccess: (note) => {
      queryClient.setQueryData<Note[]>(notesKey, (old = []) => old.map((item) => (item.id === note.id ? note : item)));
    },
    onError: () => toast.error("Unable to update note")
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Note[]>(notesKey, (old = []) => old.filter((note) => note.id !== id));
      toast.success("Note removed");
    }
  });

  const createDumpMutation = useMutation({
    mutationFn: createDumpItem,
    onSuccess: (item) => {
      queryClient.setQueryData<DumpItem[]>(dumpKey, (old = []) => [...old, item]);
    },
    onError: () => toast.error("Unable to add dump item")
  });

  const deleteDumpMutation = useMutation({
    mutationFn: deleteDumpItem,
    onSuccess: (_, id) => {
      queryClient.setQueryData<DumpItem[]>(dumpKey, (old = []) => old.filter((item) => item.id !== id));
    }
  });

  const rememberNote = useMemo(() => notes.find((note) => note.title.toLowerCase() === "remember"), [notes]);
  const otherNotes = useMemo(() => notes.filter((note) => note.id !== rememberNote?.id), [notes, rememberNote?.id]);

  const availableTags = useMemo(
    () => Array.from(new Set(tasks.flatMap((task) => task.tags ?? []))),
    [tasks]
  );

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  const scheduledTasks = useMemo(
    () => filteredTasks.filter((task) => Boolean(task.start)).sort((a, b) => taskTime(a) - taskTime(b)),
    [filteredTasks]
  );

  const onTasks = useMemo(
    () => filteredTasks.filter((task) => task.status === Status.ON && !task.start),
    [filteredTasks]
  );

  const priorityTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.bucket === Bucket.PRIORITY && task.status !== Status.DONE && !task.start
      ),
    [filteredTasks]
  );

  const shouldTasks = useMemo(
    () =>
      filteredTasks.filter(
        (task) => task.bucket === Bucket.SHOULD_COULD && task.status !== Status.DONE && !task.start
      ),
    [filteredTasks]
  );

  const parseStartInput = (time: string): Date | undefined => {
    if (!time) return undefined;
    const match = time.trim().match(/^(\d{1,2})(?::(\d{2}))?(?:\s?(am|pm|a|p))?$/i);
    if (!match) return undefined;
    let hours = Number(match[1]);
    const minutes = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3]?.toLowerCase();
    if (meridiem) {
      const isPM = meridiem.startsWith("p");
      if (isPM && hours < 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
    }
    if (hours > 23 || minutes > 59) return undefined;
    const base = fromDayString(selectedDate);
    base.setHours(hours, minutes, 0, 0);
    return base;
  };

  const handleQuickAddScheduled = async (value: string) => {
    const day = fromDayString(selectedDate);
    const parsed = parseQuickAdd(value, day);
    if (!parsed.title) {
      toast.error("Please add a title for the task");
      return;
    }
    await createTaskMutation.mutateAsync({
      title: parsed.title,
      bucket: parsed.bucket ?? Bucket.PRIORITY,
      status: Status.NOT_STARTED,
      start: parsed.start ?? undefined,
      durationMin: parsed.durationMin,
      context: parsed.context ?? undefined,
      tags: parsed.tags,
      date: day
    });
  };

  const handleAddPriorityTask = async (title: string, bucket: Bucket) => {
    const day = fromDayString(selectedDate);
    await createTaskMutation.mutateAsync({
      title,
      bucket,
      status: Status.NOT_STARTED,
      date: day,
      tags: []
    });
  };

  const handleToggleDone = async (task: Task, done: boolean) => {
    const nextStatus = done ? Status.DONE : Status.NOT_STARTED;
    await updateTaskMutation.mutateAsync({
      id: task.id,
      data: {
        status: nextStatus
      }
    });
  };

  const handleDeleteTask = async (task: Task) => {
    await deleteTaskMutation.mutateAsync(task.id);
  };

  const handleRememberSave = async (text: string) => {
    const day = fromDayString(selectedDate);
    if (rememberNote) {
      await updateNoteMutation.mutateAsync({
        id: rememberNote.id,
        data: { body: text, date: day }
      });
    } else {
      await createNoteMutation.mutateAsync({
        title: "Remember",
        body: text,
        date: day
      });
    }
  };

  const handleAddNote = async ({ title, body, taskId }: { title: string; body?: string; taskId?: string | null }) => {
    const day = fromDayString(selectedDate);
    await createNoteMutation.mutateAsync({
      title,
      body,
      taskId: taskId ?? undefined,
      date: day
    });
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  const handleAddDump = async (value: string) => {
    const day = fromDayString(selectedDate);
    await createDumpMutation.mutateAsync({
      title: value,
      date: day
    });
  };

  const handleDeleteDump = async (id: string) => {
    await deleteDumpMutation.mutateAsync(id);
  };

  const handlePromoteDump = async (item: DumpItem, payload: PromotePayload) => {
    const day = fromDayString(selectedDate);
    const start = payload.startTime ? parseStartInput(payload.startTime) : undefined;
    await createTaskMutation.mutateAsync({
      title: payload.title,
      description: payload.description,
      bucket: payload.bucket,
      status: payload.status,
      start: start,
      durationMin: payload.durationMin,
      energy: payload.energy ?? undefined,
      context: payload.context ?? undefined,
      tags: payload.tags,
      date: day
    });
    if (payload.deleteOriginal) {
      await deleteDumpMutation.mutateAsync(item.id);
    }
  };

  const findColumnForTask = (task: Task): ColumnId => {
    if (task.start) return "scheduled";
    if (task.status === Status.ON) return "on";
    if (task.bucket === Bucket.PRIORITY) return "priority";
    return "should";
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const activeId = event.active.id as string;
    const overId = event.over?.id as string | undefined;
    if (!overId) return;

    const task = tasks.find((item) => item.id === activeId);
    if (!task) return;

    const activeContainer =
      (event.active.data.current?.sortable?.containerId as ColumnId | undefined) ?? findColumnForTask(task);

    let overContainer = event.over?.data.current?.sortable?.containerId as ColumnId | undefined;
    if (!overContainer) {
      if (columnOrder.includes(overId as ColumnId)) {
        overContainer = overId as ColumnId;
      } else {
        const overTask = tasks.find((item) => item.id === overId);
        if (overTask) {
          overContainer = findColumnForTask(overTask);
        }
      }
    }

    if (!overContainer) return;

    if (overContainer === activeContainer) {
      if (activeContainer === "scheduled" && scheduledTasks.length > 1) {
        const ids = scheduledTasks.map((item) => item.id);
        const oldIndex = ids.indexOf(activeId);
        let newIndex = ids.indexOf(overId);
        if (newIndex === -1) {
          newIndex = ids.length - 1;
        }
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(scheduledTasks, oldIndex, newIndex);
          const targetTime = reordered[newIndex]?.start
            ? new Date(reordered[newIndex].start as Date)
            : getNextScheduledTime(scheduledTasks, selectedDate);
          await updateTaskMutation.mutateAsync({
            id: activeId,
            data: { start: targetTime }
          });
        }
      }
      return;
    }

    const updates: Record<string, unknown> = {};
    if (overContainer === "scheduled") {
      const nextStart = getNextScheduledTime(scheduledTasks, selectedDate);
      updates.start = nextStart;
      updates.status = Status.NOT_STARTED;
    } else {
      updates.start = null;
      if (overContainer === "on") {
        updates.status = Status.ON;
      }
      if (overContainer === "priority") {
        updates.bucket = Bucket.PRIORITY;
        if (task.status === Status.DONE) {
          updates.status = Status.NOT_STARTED;
        }
      }
      if (overContainer === "should") {
        updates.bucket = Bucket.SHOULD_COULD;
        if (task.status === Status.DONE) {
          updates.status = Status.NOT_STARTED;
        }
      }
      if (overContainer !== "on" && task.status === Status.ON) {
        updates.status = Status.NOT_STARTED;
      }
    }

    await updateTaskMutation.mutateAsync({ id: activeId, data: updates });
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <RememberCard
          value={rememberNote?.body ?? ""}
          onSave={handleRememberSave}
          isSaving={updateNoteMutation.isPending || createNoteMutation.isPending}
        />
        <div className="flex flex-col gap-4">
          <DateSwitcher value={fromDayString(selectedDate)} onChange={(date) => setDate(date)} />
          <SearchFiltersBar
            filters={filters}
            availableTags={availableTags}
            onSearch={setSearch}
            onContext={setContext}
            onEnergy={setEnergy}
            onTag={setTag}
            onToggleDone={toggleShowDone}
            onReset={resetFilters}
          />
        </div>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 xl:grid-cols-4">
          <SortableContext id="scheduled" items={scheduledTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <ScheduledColumn
              tasks={scheduledTasks}
              onQuickAdd={handleQuickAddScheduled}
              onToggleDone={handleToggleDone}
              onDelete={handleDeleteTask}
            />
          </SortableContext>
          <SortableContext id="on" items={onTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="on"
              title="On / In Progress"
              description="Stay focused on active work."
              tasks={onTasks}
              onToggleDone={handleToggleDone}
              onDelete={handleDeleteTask}
            />
          </SortableContext>
          <SortableContext id="priority" items={priorityTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="priority"
              title="Priority To-Do"
              description="High-impact tasks waiting to start."
              tasks={priorityTasks}
              onAdd={(value) => handleAddPriorityTask(value, Bucket.PRIORITY)}
              onToggleDone={handleToggleDone}
              onDelete={handleDeleteTask}
              showInput
              placeholder="Add a priority task"
            />
          </SortableContext>
          <SortableContext id="should" items={shouldTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <TaskColumn
              id="should"
              title="Should / Could Do"
              description="Nice-to-haves and future ideas."
              tasks={shouldTasks}
              onAdd={(value) => handleAddPriorityTask(value, Bucket.SHOULD_COULD)}
              onToggleDone={handleToggleDone}
              onDelete={handleDeleteTask}
              showInput
              placeholder="Add a should/could task"
            />
          </SortableContext>
        </div>
      </DndContext>
      <div className="grid gap-4 xl:grid-cols-2">
        <NotesPanel notes={otherNotes} tasks={tasks} onAdd={handleAddNote} onDelete={handleDeleteNote} />
        <DumpPanel items={dumpItems} onAdd={handleAddDump} onDelete={handleDeleteDump} onPromote={handlePromoteDump} />
      </div>
    </div>
  );
}

function applyFilters(tasks: Task[], filters: PlannerFilters) {
  return tasks.filter((task) => {
    if (!filters.showDone && task.status === Status.DONE) {
      return false;
    }
    if (filters.context !== "ALL" && task.context !== filters.context) {
      return false;
    }
    if (filters.energy !== "ALL" && task.energy !== filters.energy) {
      return false;
    }
    if (filters.tag && !(task.tags ?? []).includes(filters.tag)) {
      return false;
    }
    if (filters.search.trim()) {
      const value = filters.search.trim().toLowerCase();
      const haystack = [task.title, task.description ?? "", ...(task.tags ?? []), task.context ?? ""].join(" ").toLowerCase();
      if (!haystack.includes(value)) {
        return false;
      }
    }
    return true;
  });
}

function getNextScheduledTime(tasks: Task[], dayString: string) {
  const base = fromDayString(dayString);
  base.setHours(9, 0, 0, 0);
  const existing = tasks
    .map((task) => (task.start ? new Date(task.start as Date) : null))
    .filter((value): value is Date => Boolean(value));
  if (existing.length === 0) return base;
  const latest = existing.sort((a, b) => b.getTime() - a.getTime())[0];
  return addMinutes(latest, 30);
}

function taskTime(task: Task) {
  return task.start ? new Date(task.start as Date).getTime() : Number.MAX_SAFE_INTEGER;
}
