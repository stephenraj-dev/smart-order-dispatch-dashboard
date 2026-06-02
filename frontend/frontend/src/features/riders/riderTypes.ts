export interface Rider {
  id: number;
  name: string;
  status: "available" | "busy" | "offline";
  activeOrders: number;
}

export interface RiderState {
  riders: Rider[];
  loading: boolean;
  error: string | null;
}