import axios from "axios";

export const getDashboardSummary =
  async () => {

    const response =
      await axios.get(
        "http://localhost:5000/orders/dashboard-summary"
      );

    return response.data;
  };