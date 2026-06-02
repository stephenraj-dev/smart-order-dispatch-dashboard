export interface Rider {
  id: number;
  name: string;
  zone: string;
  status: "available" | "busy" | "offline";
  activeOrders: number;
}