import { Order } from "../types/order";

export const orders: Order[] = [
  {
    id: 1001,
    customerName: "Stephen",
    pickupZone: "Anna Nagar",
    dropZone: "T Nagar",
    priority: "urgent",
    status: "assigned",
    riderId: 1,
    createdAt: new Date(),
    timeline: [
      {
        status: "created",
        riderName: "Ravi",
        timestamp: new Date()
      },
      {
        status: "assigned",
        riderName: "Ravi",
        timestamp: new Date()
      }
    ]
  }
];