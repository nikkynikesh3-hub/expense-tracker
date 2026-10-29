import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import "./index.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update one field of the form as the user types
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const MIN_PASSWORD_LENGTH = 6;

  const validateForm = () => {
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      return "Please fill in all fields";
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (form.password !== form.confPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading

    const problem = validateForm();
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.username,
        email: form.email,
        password: form.password,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        options,
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        // 400 and 500 replies do not throw an error in fetch, so we check ourselves
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      // Only happens when the server cannot be reached at all
      setError(`Cannot reach the server. Try again errorMsg:${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-main-bg">
      <div className="reg-banner-box">
        <h1 className="reg-heading">
          Expense<span className="reg-span">Tracker</span>
        </h1>
        <img
          src="https://img.ge/i/TWJbo11.png"
          alt="expense tracker img"
          className="expense-image"
        />
      </div>
      <form className="reg-form-container" onSubmit={handleSubmit}>
        <h1 className="form-headline">Create Your Account</h1>
        <p className="form-para">Start your expense tracking journey today</p>
        <div className="input-main-card">
          <label htmlFor="username" className="reg-inp-label">
            Full Name
          </label>
          <div className="input-value-card">
            <FaRegUser className="reg-inp-icon" />
            <input
              type="text"
              id="username"
              placeholder="Enter Name"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input-el"
              autoComplete="name"
            />
          </div>
        </div>
        <div className="input-main-card">
          <label htmlFor="emailAddress" className="reg-inp-label">
            Email Address
          </label>
          <div className="input-value-card">
            <MdOutlineEmail className="reg-inp-icon" />
            <input
              type="email"
              id="emailAddress"
              placeholder="Enter Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input-el"
              autoComplete="email"
            />
          </div>
        </div>
        <div className="input-main-card">
          <label htmlFor="regPassword" className="reg-inp-label">
            Password
          </label>
          <div className="input-value-card">
            <RiLockPasswordLine className="reg-inp-icon" />
            <input
              type="password"
              id="regPassword"
              placeholder="At least 6 characters"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-el"
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="input-main-card">
          <label htmlFor="confPassword" className="reg-inp-label">
            Confirm Password
          </label>
          <div className="input-value-card">
            <RiLockPasswordLine className="reg-inp-icon" />
            <input
              type="password"
              id="confPassword"
              placeholder="Type Password Again"
              name="confPassword"
              value={form.confPassword}
              onChange={handleChange}
              className="input-el"
              autoComplete="new-password"
            />
          </div>
        </div>
        {error && <p className="reg-error">{error}</p>}
        <button type="submit" className="reg-button">
          {loading ? "Registering" : "Register"}
        </button>
        <p className="reg-login-text">
          Already have an account?{" "}
          <Link to="/login" className="reg-login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
