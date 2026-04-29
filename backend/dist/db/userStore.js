"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.getSavedCollegeIds = getSavedCollegeIds;
exports.setSavedCollegeIds = setSavedCollegeIds;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const DATA_DIR = node_path_1.default.join(process.cwd(), "data");
const DB_PATH = node_path_1.default.join(DATA_DIR, "db.json");
async function ensureDbFile() {
    try {
        await promises_1.default.mkdir(DATA_DIR, { recursive: true });
        await promises_1.default.access(DB_PATH);
    }
    catch {
        const initial = { users: [], savedByUserId: {} };
        await promises_1.default.mkdir(DATA_DIR, { recursive: true });
        await promises_1.default.writeFile(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
    }
}
async function readDb() {
    await ensureDbFile();
    const raw = await promises_1.default.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
}
async function writeDb(next) {
    await ensureDbFile();
    const tmpPath = `${DB_PATH}.tmp`;
    await promises_1.default.writeFile(tmpPath, JSON.stringify(next, null, 2), "utf-8");
    await promises_1.default.rename(tmpPath, DB_PATH);
}
function safeEmail(email) {
    return email.trim().toLowerCase();
}
async function findUserByEmail(email) {
    const db = await readDb();
    const e = safeEmail(email);
    return db.users.find((u) => u.email === e) ?? null;
}
async function findUserById(id) {
    const db = await readDb();
    return db.users.find((u) => u.id === id) ?? null;
}
async function createUser(params) {
    const db = await readDb();
    const email = safeEmail(params.email);
    if (db.users.some((u) => u.email === email)) {
        throw new Error("EMAIL_TAKEN");
    }
    const user = {
        id: (0, node_crypto_1.randomUUID)(),
        email,
        passwordHash: params.passwordHash,
        createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    await writeDb(db);
    return user;
}
async function getSavedCollegeIds(userId) {
    const db = await readDb();
    return db.savedByUserId[userId] ?? [];
}
async function setSavedCollegeIds(userId, ids) {
    const db = await readDb();
    db.savedByUserId[userId] = ids;
    await writeDb(db);
}
//# sourceMappingURL=userStore.js.map