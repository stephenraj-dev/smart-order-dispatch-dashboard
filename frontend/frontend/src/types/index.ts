export interface Order {
  id: number;
  customerName: string;
  pickupZone: string;
  dropZone?: string;
  priority: "urgent" | "normal";
  status: "created" | "assigned" | "picked_up" | "delivered" | "failed";
  riderId?: number;
  riderName?: string;
  timeline?: { status: string; timestamp: string }[];
}

export interface Rider {
  id: number;
  name: string;
  zone: string;
  status: "available" | "busy" | "offline";
  activeOrders: number;
}