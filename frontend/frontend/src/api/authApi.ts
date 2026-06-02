import axios from "axios";

export const login = async () => {

  const response = await axios.post(
    "http://localhost:5000/auth/login"
  );

  return response.data;
};