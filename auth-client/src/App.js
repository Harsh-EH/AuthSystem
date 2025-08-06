
// App.js
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import SuccessAndUpdatePage from "./components/SuccessAndUpdatePage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ✅ Protected Route */}
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <SuccessAndUpdatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
