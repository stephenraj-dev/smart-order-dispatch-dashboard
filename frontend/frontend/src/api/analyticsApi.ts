import axios from "axios";

export const getAnalytics = async () => {

  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    "https://order-dispatch-dashboard.onrender.com/orders/analytics",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};