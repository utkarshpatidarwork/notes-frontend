import {
  Routes,
  Route
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Routes>

      {/* Login */}

      <Route
        path="/"
        element={<LoginPage />}
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