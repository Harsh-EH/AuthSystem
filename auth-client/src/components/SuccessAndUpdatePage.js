import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  usernameOrEmail: yup.string().required("Username or Email is required"),
  oldPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
});

const SuccessAndUpdatePage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        withCredentials: true, // Required for cookie deletion
      });
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Handle Password Update
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/update-password", data, {
        withCredentials: true,
      });
      setMessage("Password updated successfully!");
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed.");
      setMessage("");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Login Success</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      <p>You are now logged in!</p>

      <h4 className="mt-4">Update Password</h4>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Username or Email</label>
          <input {...register("usernameOrEmail")} className="form-control" />
          <p className="text-danger">{errors.usernameOrEmail?.message}</p>
        </div>

        <div className="mb-3">
          <label>Current Password</label>
          <input {...register("oldPassword")} type="password" className="form-control" />
          <p className="text-danger">{errors.oldPassword?.message}</p>
        </div>

        <div className="mb-3">
          <label>New Password</label>
          <input {...register("newPassword")} type="password" className="form-control" />
          <p className="text-danger">{errors.newPassword?.message}</p>
        </div>

        <button className="btn btn-dark">Update Password</button>
      </form>
    </div>
  );
};

export default SuccessAndUpdatePage;
