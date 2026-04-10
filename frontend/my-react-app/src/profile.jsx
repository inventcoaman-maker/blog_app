import { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    
  });
  // const token = localStorage.getItem("access");

  // const token = localStorage.getItem("access")
  useEffect(() => {
    const token = localStorage.getItem("access");
    fetch(`${import.meta.env.VITE_API_URL}/api/singleUser/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      alert(userData.phone);
      navigate("/");
    } else {
      setError("Failed to update profile");
    }
  };
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="profile-image">
            <img
              onChange={handleChange}
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="profile"
            />
            
          </div>
          <div className="form-group"></div>
          <div className="form-group">
            <label>First Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={userData.first_name}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={userData.last_name}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              disabled
              type="email"
              placeholder="Enter email"
              value={userData.email}
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              inputmode="numeric"
              pattern="[0-9]*"
              onChange={handleChange}
              name="phone"
              maxLength="10"
              minLength="10"
              value={userData.phone || ""}
              placeholder="Enter 10 digit phone number"
            />
          </div>
          {error ? <div className="error-message">{error}</div> : ""}
          <button className="profile-btn">Update Profile</button>
        </form>
      </div>
    </div>
  );
}
