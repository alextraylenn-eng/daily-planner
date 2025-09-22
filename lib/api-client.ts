import { Task, Note, DumpItem } from "@/types";
import type { DumpCreateInput, NoteCreateInput, TaskCreateInput, TaskUpdateInput } from "@/lib/validation";

async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }

  return res.json();
}

export function getTasks(date: string) {
  return jsonFetch<Task[]>(`/api/tasks?date=${encodeURIComponent(date)}`);
}

export function createTask(payload: TaskCreateInput) {
  return jsonFetch<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTask(id: string, payload: TaskUpdateInput) {
  return jsonFetch<Task>(`/api/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id: string) {
  return jsonFetch<{ success: boolean }>(`/api/tasks/${id}`, {
    method: "DELETE"
  });
}

export function getNotes(date: string) {
  return jsonFetch<Note[]>(`/api/notes?date=${encodeURIComponent(date)}`);
}

export function createNote(payload: NoteCreateInput) {
  return jsonFetch<Note>("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateNote(id: string, payload: Partial<NoteCreateInput>) {
  return jsonFetch<Note>(`/api/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function deleteNote(id: string) {
  return jsonFetch<{ success: boolean }>(`/api/notes/${id}`, {
    method: "DELETE"
  });
}

export function getDumpItems(date: string) {
  return jsonFetch<DumpItem[]>(`/api/dump?date=${encodeURIComponent(date)}`);
}

export function createDumpItem(payload: DumpCreateInput) {
  return jsonFetch<DumpItem>("/api/dump", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteDumpItem(id: string) {
  return jsonFetch<{ success: boolean }>(`/api/dump/${id}`, {
    method: "DELETE"
  });
}
