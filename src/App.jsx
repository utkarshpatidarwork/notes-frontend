//App.jsx
import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";

import RegisterPage from "./pages/RegisterPage";

function App() {

  return (
    <Routes>

      {/* Login */}

      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* Protected Dashboard */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>

            <DashboardPage />

          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;