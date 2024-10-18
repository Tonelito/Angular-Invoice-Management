interface OrderForm {
  client: string;
  items: OrderItem[];
}

interface OrderItem {
  quantity: number;
  product: string;
  price: number;
  total: number;
  taxes: number;
}
