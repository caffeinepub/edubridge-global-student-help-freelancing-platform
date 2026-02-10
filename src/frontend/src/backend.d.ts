import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    city: string;
    address: string;
}
export interface Rating {
    requestId: bigint;
    studentUserId: Principal;
    createdAt: Time;
    score: bigint;
    comment: string;
    helperUserId: Principal;
}
export type Time = bigint;
export interface RequestWithTextTasks {
    id: bigint;
    status: RequestStatus;
    tasks: Array<string>;
    title: string;
    owner: Principal;
    createdAt: Time;
    description: string;
    assignedHelper?: Principal;
    locationInfo?: Location;
}
export interface Message {
    id: bigint;
    requestId: bigint;
    content: string;
    isRead: boolean;
    sender: Principal;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
    role: UserRole;
    biography?: string;
    organization?: string;
    skills?: string;
}
export enum RequestStatus {
    pending = "pending",
    completed = "completed",
    accepted = "accepted"
}
export enum UserRole {
    helper = "helper",
    admin = "admin",
    business = "business",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptRequest(requestId: bigint): Promise<void>;
    addRating(requestId: bigint, helperUser: Principal, score: bigint, comment: string): Promise<void>;
    addTask(requestId: bigint, task: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    completeRequest(requestId: bigint): Promise<void>;
    createRequest(title: string, description: string, location: Location | null): Promise<bigint>;
    deleteRequest(requestId: bigint): Promise<void>;
    deleteUser(user: Principal): Promise<void>;
    filterRequestsByCity(city: string): Promise<Array<RequestWithTextTasks>>;
    getAllRatings(): Promise<Array<Rating>>;
    getAllRequests(): Promise<Array<RequestWithTextTasks>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getAnalytics(): Promise<{
        totalRatings: bigint;
        completedRequests: bigint;
        averageRating: number;
        pendingRequests: bigint;
        totalUsers: bigint;
        acceptedRequests: bigint;
        totalRequests: bigint;
    }>;
    getAvailableRequests(): Promise<Array<RequestWithTextTasks>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getMessages(requestId: bigint): Promise<Array<Message>>;
    getMyAssignedRequests(): Promise<Array<RequestWithTextTasks>>;
    getMyRatingsAsHelper(): Promise<Array<Rating>>;
    getMyRequests(): Promise<Array<RequestWithTextTasks>>;
    getPendingRequestsForUser(user: Principal): Promise<Array<RequestWithTextTasks>>;
    getRatingsByUser(user: Principal): Promise<Array<Rating>>;
    getRequestsByStatus(status: RequestStatus): Promise<Array<RequestWithTextTasks>>;
    getUnreadMessageCount(requestId: bigint): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markMessageAsRead(messageId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(requestId: bigint, content: string): Promise<bigint>;
}
