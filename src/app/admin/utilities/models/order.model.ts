export interface OrderForm {
  client: string;
  items: OrderItem[];
}

export interface OrderItem {
  quantity: number;
  product: string;
  price: number;
  total: number;
  taxes: number;
}

export interface Customers {
  note: string;
  object: Customer[];
}

export interface Customer {
  customerId: number;
  name: string;
  dpi: string;
  passport?: string | null;
  nit?: string | null;
  address: string;
}

export interface Products {
  note: string;
  object: Product[];
}

export interface Product {
  productsId: number;
  code: string;
  name: string;
  delivery_time: number;
  description: string;
  price: number;
  status: boolean;
  companyOrBrandName: string;
  expirationDate: Date | string;
  entryDate: Date | string;
  stock: number;
}
