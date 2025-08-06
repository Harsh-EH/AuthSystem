import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email().required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate(); // ✅ initialize
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", data);
      setMessage("Registration successful! Redirecting to login...");
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 1500); // ✅ Redirect after 1.5 seconds
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Username</label>
          <input {...register("username")} className="form-control" />
          <p className="text-danger">{errors.username?.message}</p>
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input {...register("email")} className="form-control" />
          <p className="text-danger">{errors.email?.message}</p>
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input {...register("password")} type="password" className="form-control" />
          <p className="text-danger">{errors.password?.message}</p>
        </div>
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
