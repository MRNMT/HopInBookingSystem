export default interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash: string;
    oAuthProvider: string;
    oAuthId: string;
    profileImageUrl: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}