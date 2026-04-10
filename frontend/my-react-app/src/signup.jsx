import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./signup.css";
function Signup() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  console.log(inputValue);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  console.log(inputValue);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValue),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(data.message);
      navigate("/");
    } else {
      setError(data.error);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                onChange={handleChange}
                value={inputValue.first_name}
                name="first_name"
                type="text"
                placeholder=" "
                required
              />
              <label>First Name</label>
            </div>
            <div className="input-group">
              <input
                onChange={handleChange}
                value={inputValue.last_name}
                type="text"
                name="last_name"
                placeholder=" "
                required
              />
              <label>Last Name</label>
            </div>
            <div className="input-group">
              <input
                onChange={handleChange}
                value={inputValue.email}
                type="email"
                name="email"
                placeholder=" "
                required
              />
              <label>Email</label>
            </div>
            <div className="input-group">
              <input
                onChange={handleChange}
                type="password"
                placeholder=" "
                name="password"
                required
                value={inputValue.password}
              />
              <label>Password</label>
            </div>
            <div className="input-group">
              <input
                onChange={handleChange}
                value={inputValue.confirm_password}
                type="password"
                placeholder=" "
                name="confirm_password"
                required
              />
              <label>Confirm Password</label>
            </div>
            <button type="submit">Sign Up</button>
          </form>
          {error ? <div className="error-message">{error}</div> : ""}
          <div className="login-text">
            Already a user? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Signup;
