import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
});

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", data);
      setMessage("Reset link sent! Redirecting to login...");
      setError("");

      // Redirect to login page after delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Email</label>
          <input {...register("email")} className="form-control" />
          <p className="text-danger">{errors.email?.message}</p>
        </div>
        <button className="btn btn-warning">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
