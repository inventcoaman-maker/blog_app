import { useEffect, useState } from "react";
import "./changePassword.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function ChangePassword() {
  const [currentPass, setCurrentPass] = useState({
    old_password: "",
    new_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("access");
  //   fetch(`${import.meta.env.VITE_API_URL}/api/singleUser/`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }).then((res) => res.json());
  // }, []);

  const handleChange = (e) => {
    setCurrentPass((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/changePassword/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentPass),
      },
    );
    if (res.ok) {
      navigate("/");
      toast.success("Password changed successfully 🎉");
    } else {
      toast.error("Failed to change password");
    }
  };
  return (
    <>
      <div className="password-container">
        <div className="password-card">
          <form action="" onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            <div className="form-group">
              <label>Current Password</label>
              <input
                name="old_password"
                onChange={handleChange}
                type="password"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="new_password"
                onChange={handleChange}
                pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$"
                title="Password must be 8+ characters, include uppercase and special symbol"
                placeholder="Enter new password"
              />
            </div>
            {/* {error && toast.error(error)} */}
            <button className="password-btn">Change Password</button>
            <div className="home_div">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="profilee-btn"
              >
                <FontAwesomeIcon icon={faHouse} className="home-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
