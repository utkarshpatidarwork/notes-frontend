//api.js
import axios from "axios";

import socket from "../socket";

const API =
  import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API
});

// Add Token Automatically
api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

// Auto Logout On 401
api.interceptors.response.use(

  (response) =>
    response,

  (error) => {

    if (
      (error.response?.status === 401 ||

        (
          error.response?.status === 403 &&
          error.response?.data?.message ===
            "Account has been disabled"
        )

      ) &&
      localStorage.getItem("token")
    ) {

      socket.disconnect();

      socket.auth = {};

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "selectedWorkspace"
      );

      window.location.replace("/");
    }

    return Promise.reject(
      error
    );
  }
);

export default api;