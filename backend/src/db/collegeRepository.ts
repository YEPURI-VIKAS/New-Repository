import { SEED_COLLEGES, type College } from "./seedColleges";

export type CollegeQuery = {
  q?: string;
  location?: string;
  feesMin?: number;
  feesMax?: number;
  course?: string;
  sort?: "rating_desc" | "fees_asc";
  page?: number;
  limit?: number;
};

export type CollegeListResult = {
  items: College[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function matchesCollege(college: College, query: CollegeQuery) {
  if (query.q) {
    const q = normalize(query.q);
    const hay = normalize(college.name);
    if (!hay.includes(q)) return false;
  }

  if (query.location) {
    const loc = normalize(query.location);
    const hay = normalize(college.location);
    if (!hay.includes(loc)) return false;
  }

  if (typeof query.feesMin === "number" && Number.isFinite(query.feesMin)) {
    if (college.fees < query.feesMin) return false;
  }

  if (typeof query.feesMax === "number" && Number.isFinite(query.feesMax)) {
    if (college.fees > query.feesMax) return false;
  }

  if (query.course) {
    const course = normalize(query.course);
    const any = college.courses.some((c) => normalize(c).includes(course));
    if (!any) return false;
  }

  return true;
}

export function getAllColleges(query: CollegeQuery): CollegeListResult {
  const page = Math.max(1, Math.floor(query.page ?? 1));
  const limit = Math.max(1, Math.min(100, Math.floor(query.limit ?? 12)));

  const filtered = SEED_COLLEGES.filter((c) => matchesCollege(c, query));

  const sort = query.sort ?? "rating_desc";
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "fees_asc") return a.fees - b.fees;
    return b.rating - a.rating;
  });

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = sorted.slice(start, start + limit);

  return { items, page, limit, total, totalPages };
}

export function getCollegeById(id: string): College | null {
  const found = SEED_COLLEGES.find((c) => c.id === id);
  return found ?? null;
}

