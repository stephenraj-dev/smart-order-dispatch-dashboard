import axios from "axios";

export const getAnalytics = async () => {

  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/orders/analytics",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};