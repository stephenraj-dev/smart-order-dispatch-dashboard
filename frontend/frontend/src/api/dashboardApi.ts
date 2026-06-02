import axios from "axios";

export const getDashboardSummary =
  async () => {

    const response =
      await axios.get(
        "https://order-dispatch-dashboard.onrender.com/orders/dashboard-summary"
      );

    return response.data;
  };