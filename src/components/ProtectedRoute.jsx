//ProtectedRoute.jsx
import {
  Navigate
} from "react-router-dom";

import socket from "../socket";

function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  if (!token) {

    return (
      <Navigate to="/" />
    );
  }

  socket.auth = {
    token,
  };

  if (!socket.connected) {
    socket.connect();
  }

  let user = null;

    try {

      user = JSON.parse(
        localStorage.getItem(
          "user"
        )
      );

    } catch {

      localStorage.removeItem(
        "user"
      );
    }

  if (
    adminOnly &&
    user?.role !== "admin"
  ) {

    return (
      <Navigate
        to="/dashboard"
      />
    );
  }

  return children;
}

export default ProtectedRoute;