import { useState, useEffect, useContext } from "react";
import "./profile.css";
import axios from "axios";
import { data, Router, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { resolveImageUrl } from "../../utils/imageUrl";
import { toast } from "react-toastify";
import { UserContext } from "../context/authContext.jsx";
import { updateProfile } from "../../api/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Profile() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { user, fetchUser } = useContext(UserContext);

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [image, setImage] = useState(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem("access");
  //     try {
  //       const response = await axios.get(`${API_URL}/api/singleUser/`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setUserData({
  //         first_name: response.data.first_name || "",
  //         last_name: response.data.last_name || "",
  //         email: response.data.email || "",
  //         phone: response.data.phone || "",
  //         image: response.data.image || "",
  //       });
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image || "",
      });
    }
  }, [user]);

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
    try {
      const response = await axios.put(`${API_URL}/api/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData((prev) => ({
        ...prev,
        image: response.data.data?.image || prev.image,
      }));
      const data = response.data;
      console.log(data);

      navigate("/");
      fetchUser();

      toast.success(data.message);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong";

      toast.error(errorMsg);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Edit Profile</h2>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <p>Current image: {userData.image.split("/").pop()}</p>
            <label htmlFor="image">Profile Image</label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              name="first_name"
              type="text"
              placeholder="Enter first name"
              value={userData.first_name}
              onChange={handleChange}
            />
          </div>

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

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={userData.email} disabled />
          </div>

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
          {error && toast.error(error)}

          {/* {error && <div className="error-message">{toast.error(error)}</div>} */}

          <button type="submit" className="profile-btn">
            Update Profile
          </button>
        </form>

        <div className="home_div">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="profilee-btn"
          >
            <FontAwesomeIcon icon={faHouse} className="home-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}
