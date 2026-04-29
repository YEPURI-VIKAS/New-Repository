type UserRecord = {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: string;
};
export declare function findUserByEmail(email: string): Promise<UserRecord | null>;
export declare function findUserById(id: string): Promise<UserRecord | null>;
export declare function createUser(params: {
    email: string;
    passwordHash: string;
}): Promise<UserRecord>;
export declare function getSavedCollegeIds(userId: string): Promise<string[]>;
export declare function setSavedCollegeIds(userId: string, ids: string[]): Promise<void>;
export {};
//# sourceMappingURL=userStore.d.ts.map