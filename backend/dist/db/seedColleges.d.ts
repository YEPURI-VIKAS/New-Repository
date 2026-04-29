export type College = {
    id: string;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placement: number;
    courses: string[];
    image: string;
    description: string;
};
/**
 * Mock dataset (20 colleges). This is used when Postgres isn’t connected yet.
 * IDs are stable slugs so routes `/college/[id]` work consistently.
 */
export declare const SEED_COLLEGES: College[];
//# sourceMappingURL=seedColleges.d.ts.map