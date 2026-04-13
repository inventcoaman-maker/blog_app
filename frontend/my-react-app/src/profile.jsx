import { useState, useEffect } from "react";
import "./profile.css";
import { Router, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "./utils/imageUrl";

export default function Profile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [image, setImage] = useState(null);

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
      .then((data) =>
        setUserData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          image: data.image || "",
        }),
      );
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
    const formData = new FormData();
    formData.append("first_name", userData.first_name);
    formData.append("last_name", userData.last_name);
    formData.append("phone", userData.phone);
    if (image) formData.append("image", image);
    const token = localStorage.getItem("access");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setUserData((prev) => ({
        ...prev,
        image: data.data?.image || prev.image,
      }));
      window.dispatchEvent(new Event("profileUpdated"));
      navigate("/");
    } else {
      setError(data.message || "Failed to update profile");
    }
  };
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="profile-image">
          <img
            src={
              userData.image
                ? resolveImageUrl(userData.image)
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* IMAGE INPUT */}
          <div className="form-group">
            <label htmlFor="image">Profile Image</label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* FIRST NAME */}
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter first name"
              value={userData.first_name}
              onChange={handleChange}
            />
          </div>

          {/* LAST NAME */}
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Enter last name"
              value={userData.last_name}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={userData.email} disabled />
          </div>

          {/* PHONE */}
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone || ""}
              placeholder="Enter 10 digit phone number"
              onChange={handleChange}
              maxLength={10}
              inputMode="numeric"
            />
          </div>

          {/* ERROR */}
          {error && <div className="error-message">{error}</div>}

          {/* SUBMIT */}
          <button type="submit" className="profile-btn">
            Update Profile
          </button>
        </form>

        {/* HOME BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="profilee-btn"
        >
          <FontAwesomeIcon icon={faHouse} className="home-icon" />
        </button>
      </div>
    </div>
  );
}
