import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: UIMessage[];
};

const STORAGE_KEY = "lumen-chat-threads";

const canUseStorage = () => typeof window !== "undefined";

export function createThreadId() {
  if (canUseStorage() && "randomUUID" in crypto) return crypto.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

export function loadThreads(): ChatThread[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t) => t && typeof t.id === "string")
      .map((t) => ({ ...t, messages: Array.isArray(t.messages) ? t.messages : [] }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function persistThreads(threads: ChatThread[]) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* ignore quota errors */
  }
}

export function upsertThread(threads: ChatThread[], thread: ChatThread): ChatThread[] {
  const exists = threads.some((t) => t.id === thread.id);
  const next = exists ? threads.map((t) => (t.id === thread.id ? thread : t)) : [thread, ...threads];
  return next.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function emptyThread(id: string): ChatThread {
  const now = Date.now();
  return { id, title: "New conversation", createdAt: now, updatedAt: now, messages: [] };
}

export function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

export function deriveTitle(messages: UIMessage[]): string | null {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return null;
  const text = messageText(firstUser);
  if (!text) return null;
  return text.length > 48 ? `${text.slice(0, 48).trimEnd()}…` : text;
}
