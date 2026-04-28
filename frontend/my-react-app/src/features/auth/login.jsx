import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { generateOtp, verifyOtp } from "../../api/api";
import { UserContext } from "../context/authContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Login() {
  // const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { user, fetchUser } = useContext(UserContext);

  const navigate = useNavigate();
  // "http://127.0.0.1:8000/api/login/";
  const [inputValue, setInputValue] = useState({
    email: "",
    // password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const handleChange = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value,
    });
  };
  // const handleOtpChange = (e) => {
  //   setOtp({
  //     [e.target.name]: e.target.value,
  //   });
  // };
  // console.log(inputValue);
  console.log(otp);
  // console.log(localStorage.getItem("email", otp.otp));

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await generateOtp(inputValue.email);

      console.log(response.data);
      localStorage.setItem("email", inputValue.email);
      setShowOtpInput((prev) => !prev);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  const VerifyOtp = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");
    if (!email) {
      return toast.error("Email not found. Please try again.");
    }
    try {
      await verifyOtp({ email, otp });
      await fetchUser();
      navigate("/");
      toast.success("Login successful 🎉");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };
  // const handleSuccess = async (res) => {
  //   console.log("Google Response:", res);

  //   const token = res.credential;

  //   const response = await axios.post(
  //     "http://127.0.0.1:8000/api/google-login/",
  //     { token },
  //   );

  //   console.log(response.data);

  //   localStorage.setItem("access", response.data.access);
  //   localStorage.setItem("refresh", response.data.refresh);
  //   navigate("/");
  //   toast.success("Login successful 🎉");
  // };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <h2>login</h2>
          {/* <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          /> */}
          {showOtpInput ? (
            <form onSubmit={VerifyOtp}>
              <div className="input-group">
                <input
                  type="password"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  name="otp"
                  required
                />
                <label>otp</label>
                <button type="submit">submit </button>
              </div>
            </form>
          ) : (
            <form onSubmit={sendOtp}>
              <div className="input-group">
                <input
                  type="email"
                  onChange={handleChange}
                  value={inputValue.email}
                  name="email"
                  required
                />
                <label>Email</label>

                <button type="submit">send otp</button>
              </div>
            </form>
          )}

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
