export interface Order {
  id: number;
  customerName: string;
  pickupZone: string;
  dropZone: string;
  priority: "normal" | "urgent";

  status:
    | "assigned"
    | "picked_up"
    | "delivered"
    | "failed";

  riderId: number;

  createdAt: Date;

  pickedAt?: Date;

  deliveredAt?: Date;

  timeline: {
    status: string;
    timestamp: Date;
  }[];
}