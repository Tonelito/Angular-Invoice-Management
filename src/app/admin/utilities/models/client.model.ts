interface Common {
    name: string;
    dpi: string;
    passport: string;
    nit: string;
    address: string;
    status: boolean;
}

export interface ClientResponse {
    note: string;
    object: Client;
}

export interface Client extends Common {
    customerId: number;
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

export interface ClientName {
    name: string;
    object: Client[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}
