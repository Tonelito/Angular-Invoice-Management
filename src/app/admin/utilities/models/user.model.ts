interface Common {
    email: string;
    fullName: string;
    status: boolean;
}

export interface UserResponse {
    note: string;
    object: Section[];
    totalElements: number;
}

export interface Section {
    email: string;
    fullName: string;
}

export interface User extends Common {
    userId: number;
}

export interface Users extends User {
    note: string;
    object: User[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}
