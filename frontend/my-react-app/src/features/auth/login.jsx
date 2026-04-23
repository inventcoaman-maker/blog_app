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
    //LOGIN WITH EMAIL AND PASSWORD (OLD LOGIN LOGIC)
    // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login/`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(inputValue),
    // });
    // const data = await res.json();
    // console.log(data);

    // if (res.ok) {
    //   // console.log("login data", res);
    //   localStorage.setItem("access", data.access_token);
    //   localStorage.setItem("refresh", data.refresh_token);
    //   window.dispatchEvent(new Event("authChange"));
    //   // setSuccess("You are successfully logged in");
    //   navigate("/");
    //   toast.success("Login successful 🎉");
    // } else {
    //   setError(data.error);
    // }

    //NEW LOGIN LOGIC WITH OTP

    const url = `${import.meta.env.VITE_API_URL}/api/genrateOtp/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputValue),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      console.log(inputValue);
      localStorage.setItem("email", inputValue.email);
      setShowOtpInput((prev) => !prev);
    } else {
      toast.error(data.error);
    }
  };

  const VerifyOtp = async (e) => {
    e.preventDefault();
    const url = `${import.meta.env.VITE_API_URL}/api/verifyOtp/`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        otp: otp,
      }),
      // console.log(body)
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      navigate("/");
      toast.success("Login successful 🎉");
    } else {
      toast.error(data.error);
      console.log(localStorage.getItem("email"), otp);
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
                <div
                  class="form-otp"
                  data-coreui-toggle="otp"
                  data-coreui-linear="true"
                >
                  <input class="form-otp-control" maxLength={1} />
                  <input class="form-otp-control" maxLength={1} />
                  <input class="form-otp-control" maxLength={1} />
                  <input class="form-otp-control" maxLength={1} />
                  <input class="form-otp-control" maxLength={1} />
                  <input class="form-otp-control" maxLength={1} />
                </div>
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
