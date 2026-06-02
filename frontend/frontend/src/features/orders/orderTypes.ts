export interface Order {
  id: number;
  customerName: string;
  pickupZone: string;
  dropZone: string;
  priority: string;
  status: string;
  timeline?: {
    status: string;
    timestamp: string;
  }[];
}

export interface CreateOrderPayload {
  customerName: string;
  pickupZone: string;
  dropZone: string;
  priority: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}