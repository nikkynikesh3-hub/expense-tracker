import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import api from "../../api";

import "./index.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onEnterForm = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      console.log(res);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false); // button works again
    }
  };

  return (
    <main className="login-main-bg">
      <div className="login-card-container">
        <div className="lgn-banner-container">
          <h1 className="login-heading">
            Expense<span className="lgn-span">Tracker</span>
          </h1>
          <img
            src="https://img.ge/i/TWJbo11.png"
            alt="expense tracker img"
            className="login-expense-image"
          />
        </div>
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <h1 className="login-form-header">Welcome Back</h1>
          <p className="login-form-description">
            Sign in to continue tracking your expenses
          </p>
          <div className="login-inp-main-card">
            <label htmlFor="loginEmail" className="login-inp-label">
              Email Address
            </label>
            <div className="login-inp-value-card">
              <MdOutlineEmail className="login-inp-icon" />
              <input
                type="email"
                id="loginEmail"
                placeholder="Enter Email"
                name="email"
                value={form.email}
                onChange={onEnterForm}
                className="login-input-el"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="login-inp-main-card">
            <label htmlFor="loginPassword" className="login-inp-label">
              Password
            </label>
            <div className="login-inp-value-card">
              <RiLockPasswordLine className="login-inp-icon" />
              <input
                type="password"
                id="loginPassword"
                placeholder="Type Password"
                name="password"
                value={form.password}
                onChange={onEnterForm}
                className="login-input-el"
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">
            {loading ? "Loging..." : "Login"}
          </button>
          <p className="login-reg-text">
            Don't have an account?{" "}
            <Link to="/register" className="login-reg-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
