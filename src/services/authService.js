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

export const updateProfile =
  async (
    name,
    email
  ) => {

    const { data } =
      await api.put(
        "/api/users/profile",
        {
          name,
          email
        }
      );

    return data;
  };

export const changePassword =
  async (
    currentPassword,
    newPassword
  ) => {

    const { data } =
      await api.put(
        "/api/users/change-password",
        {
          currentPassword,
          newPassword
        }
      );

    return data;
  };