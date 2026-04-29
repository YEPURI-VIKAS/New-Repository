import { type College } from "./seedColleges";
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
export declare function getAllColleges(query: CollegeQuery): CollegeListResult;
export declare function getCollegeById(id: string): College | null;
//# sourceMappingURL=collegeRepository.d.ts.map