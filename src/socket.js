//socket.js
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL,
  {
    transports: ["websocket"],
    autoConnect: false,

    auth: {
      token:
        localStorage.getItem("token")
    }
  }
);

socket.on(
  "connect_error",
  err => {

    if (
      err.message === "Authentication failed" ||
      err.message === "Authentication required" ||
      err.message === "User not found" ||
      err.message === "Account disabled"
    ) {

      socket.disconnect();

      socket.auth = {};

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedWorkspace");

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }

    }

  }
);

export default socket;