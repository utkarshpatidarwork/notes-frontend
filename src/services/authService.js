//authService.js
import api from "./api";

export const loginUser =
  async (email, password) => {

    const { data } =
      await api.post(
        "/api/users/login",
        {
          email,
          password
        }
      );

    return data;
  };

export const registerUser =
  async (
    name,
    email,
    password
  ) => {

    const { data } =
      await api.post(
        "/api/users/register",
        {
          name,
          email,
          password
        }
      );

    return data;
  };