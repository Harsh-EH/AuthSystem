import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  usernameOrEmail: yup.string().required("Username or Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Clear session (cookie) if user opens or navigates back to this page
  useEffect(() => {
    axios
      .post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Token cleared on navigating to login page");
      })
      .catch((err) => {
        console.warn("Error clearing token:", err.response?.data || err.message);
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data, {
        withCredentials: true,
      });
      setMessage("Login successful! Redirecting...");
      setError("");

      setTimeout(() => {
        navigate("/success");
      }, 1500);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleForgotPasswordRedirect = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Username or Email</label>
          <input {...register("usernameOrEmail")} className="form-control" />
          <p className="text-danger">{errors.usernameOrEmail?.message}</p>
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input {...register("password")} type="password" className="form-control" />
          <p className="text-danger">{errors.password?.message}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" type="submit">Login</button>
          <div>
            <button className="btn btn-link" type="button" onClick={handleRegisterRedirect}>
              Register
            </button>
            <button className="btn btn-link" type="button" onClick={handleForgotPasswordRedirect}>
              Forgot Password?
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
