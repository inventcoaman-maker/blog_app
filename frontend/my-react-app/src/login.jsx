import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";
function Login() {
  // const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // "http://127.0.0.1:8000/api/login/";
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };
  console.log(inputValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValue),
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      // console.log("login data", res);
      localStorage.setItem("access", data.access_token);
      localStorage.setItem("refresh", data.refresh_token);
      // setSuccess("You are successfully logged in");
      navigate("/");
      toast.success("Login successful 🎉");
    } else {
      setError(data.error);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <h2>login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                onChange={handleChange}
                value={inputValue.email}
                name="email"
                required
              />
              <label>Email</label>
            </div>
            <div className="input-group">
              <input
                type="password"
                onChange={handleChange}
                value={inputValue.password}
                name="password"
                required
              />
              <label>Password</label>
            </div>
            <button type="submit">LOGIN</button>
          </form>
          {error ? <div className="error-message">{error}</div> : ""}
          <div className="login-text">
            create a new account <Link to="/signup">signup</Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
