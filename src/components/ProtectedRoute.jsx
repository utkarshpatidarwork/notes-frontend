//ProtectedRoute.jsx
import {
  Navigate
} from "react-router-dom";

function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const token =
    localStorage.getItem(
      "token"
    );

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

  if (!token) {

    return (
      <Navigate to="/" />
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