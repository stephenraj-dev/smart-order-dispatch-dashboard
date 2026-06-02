import axios from "axios";

const api = axios.create({
  baseURL: "https://order-dispatch-dashboard.onrender.com",
});

export default api;