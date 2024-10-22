interface Common {
    code: number;
    name: string;
    description: string;
    delivery_time: number;
    price: number;
    status: boolean;
    companyOrBrandName: string;
    expirationDate: Date;
    entryDate: Date;
    stock: number;
}

export interface ProductResponse {
    note: string;
    object: Product;
}

export interface Product extends Common {
    productsId: number;
}

export interface Products extends Product {
    note: string;
    object: Product[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;

}