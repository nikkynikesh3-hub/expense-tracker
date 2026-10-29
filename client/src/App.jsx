import { Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./Components/RegisterPage";
import LoginPage from "./Components/LoginPage";
import Home from "./Components/Home";
import ReportsPage from "./Components/ReportsPage";

// Only logged-in users (with a token) can open the dashboard
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
