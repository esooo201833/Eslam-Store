export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'paypal' | 'stripe';
  paymentId?: string;
  createdAt: Date;
  customerEmail: string;
  customerName: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
