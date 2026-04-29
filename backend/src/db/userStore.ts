import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type DbState = {
  users: UserRecord[];
  savedByUserId: Record<string, string[]>; // userId -> collegeIds
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

async function ensureDbFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    const initial: DbState = { users: [], savedByUserId: {} };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
  }
}

async function readDb(): Promise<DbState> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as DbState;
}

async function writeDb(next: DbState): Promise<void> {
  await ensureDbFile();
  const tmpPath = `${DB_PATH}.tmp`;
  await fs.writeFile(tmpPath, JSON.stringify(next, null, 2), "utf-8");
  await fs.rename(tmpPath, DB_PATH);
}

function safeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const db = await readDb();
  const e = safeEmail(email);
  return db.users.find((u) => u.email === e) ?? null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const db = await readDb();
  return db.users.find((u) => u.id === id) ?? null;
}

export async function createUser(params: { email: string; passwordHash: string }): Promise<UserRecord> {
  const db = await readDb();
  const email = safeEmail(params.email);

  if (db.users.some((u) => u.email === email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const user: UserRecord = {
    id: randomUUID(),
    email,
    passwordHash: params.passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function getSavedCollegeIds(userId: string): Promise<string[]> {
  const db = await readDb();
  return db.savedByUserId[userId] ?? [];
}

export async function setSavedCollegeIds(userId: string, ids: string[]): Promise<void> {
  const db = await readDb();
  db.savedByUserId[userId] = ids;
  await writeDb(db);
}

