import {
  Navigate
} from "react-router-dom";

function ProtectedRoute({
  children
}) {

  const token =
    localStorage.getItem("token");

  // No Token
  if (!token) {
    return <Navigate to="/" />;
  }

  // Logged In
  return children;
}

export default ProtectedRoute;