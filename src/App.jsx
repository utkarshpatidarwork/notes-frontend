//App.jsx
import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";

import RegisterPage from "./pages/RegisterPage";

import SettingsPage from "./pages/SettingsPage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";

import AdminDashboard from "./pages/AdminDashboard";

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

      <Route
        path="/forgot-password"
        element={
          <ForgotPasswordPage />
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          <ResetPasswordPage />
        }
      />

      {/* Protected Dashboard */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            adminOnly
          >

            <AdminDashboard />

          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>

            <DashboardPage />

          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>

            <SettingsPage />

          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;