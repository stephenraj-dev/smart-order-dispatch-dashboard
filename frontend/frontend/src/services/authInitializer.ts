import { login } from "../api/authApi";

export const initializeAuth =
  async () => {

    const existingToken =
      localStorage.getItem("token");

    if (existingToken) {
      return;
    }

    const response =
      await login();

    localStorage.setItem(
      "token",
      response.token
    );
  };