import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AdminData } from "@/lib/admin-types";

const STORAGE_KEY = "uzair-portfolio:admin-data";
const emptyData = (): AdminData => ({ submissions: [], notes: [], reminders: [] });

function redisConfiguration() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCommand(command: string[]) {
  const configuration = redisConfiguration();
  if (!configuration) throw new Error("Redis is not configured");
  const response = await fetch(configuration.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Storage request failed (${response.status})`);
  const payload = await response.json() as { result?: unknown; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function readLocal(): Promise<AdminData> {
  const directory = join(process.cwd(), ".data");
  const file = join(directory, "admin-store.json");
  try {
    return JSON.parse(await readFile(file, "utf8")) as AdminData;
  } catch {
    await mkdir(directory, { recursive: true });
    const data = emptyData();
    await writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function writeLocal(data: AdminData) {
  const directory = join(process.cwd(), ".data");
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "admin-store.json"), JSON.stringify(data, null, 2), "utf8");
}

export async function getAdminData(): Promise<AdminData> {
  if (redisConfiguration()) {
    const value = await redisCommand(["GET", STORAGE_KEY]);
    if (!value) return emptyData();
    return typeof value === "string" ? JSON.parse(value) as AdminData : value as AdminData;
  }
  if (process.env.VERCEL) {
    throw new Error("Persistent storage is not configured for this deployment.");
  }
  return readLocal();
}

export async function saveAdminData(data: AdminData) {
  if (redisConfiguration()) {
    await redisCommand(["SET", STORAGE_KEY, JSON.stringify(data)]);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error("Persistent storage is not configured for this deployment.");
  }
  await writeLocal(data);
}

export async function mutateAdminData(mutator: (data: AdminData) => AdminData | void) {
  const current = await getAdminData();
  const next = mutator(current) ?? current;
  await saveAdminData(next);
  return next;
}
