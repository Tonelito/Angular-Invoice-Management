interface common {
    name: string;
    dpi: string;
    passport: string;
    nit: string;
    status: boolean;
}

export interface ClientResponse {
    note: string;
    object: Client[];
    totalElements: number;
}

export interface Client extends common {
    clientId: number;
}

export interface Clients extends Client {
    note: string;
    object: {
        object: Client[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    }
}