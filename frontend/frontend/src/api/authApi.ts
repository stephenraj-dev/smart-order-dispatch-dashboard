import axios from "axios";

export const login = async () => {

  const response = await axios.post(
    "https://order-dispatch-dashboard.onrender.com/auth/login"
  );

  return response.data;
};