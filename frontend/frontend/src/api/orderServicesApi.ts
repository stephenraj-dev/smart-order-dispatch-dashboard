// services/orderService.ts

import axios from "axios";

const API_URL = "https://order-dispatch-dashboard.onrender.com";

export const updateOrderStatus = async (
  orderId: number,
  status: "picked_up" | "delivered" | "failed"
) => {
  const response = await axios.patch(
    `${API_URL}/orders/${orderId}/status`,
    { status }
  );

  return response.data;
};