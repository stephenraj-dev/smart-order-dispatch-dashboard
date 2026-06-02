// services/orderService.ts

import axios from "axios";

const API_URL = "http://localhost:5000";

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