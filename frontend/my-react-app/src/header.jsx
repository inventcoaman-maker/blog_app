import { useState, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "./utils/imageUrl";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [image, setImage] = useState("");
  const [clicked, setClicked] = useState(false);

  const toggleChange = () => {
    document.body.classList.toggle("dark-mode");
    setClicked((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
    toast.success("Logged out successfully ");
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/singleUser/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      setImage(data.image || "");
    };

    fetchUser();
    window.addEventListener("profileUpdated", fetchUser);
    return () => {
      window.removeEventListener("profileUpdated", fetchUser);
    };
  }, []);
  // const toggleChange = () => {
  //   setDarkMode((prev) => !prev);
  // };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link className="logo-link" to="/">
            Django girls <span>Post</span>
          </Link>
        </div>

        <div className="auth">
          {token ? (
            <>
              <Link className="login" to="/profile">
                profile
              </Link>
              <Link className="login" to="/changePassword">
                change password
              </Link>
              <Link onClick={logout} className="signup" to="/login">
                logout
              </Link>
              <Link to="/add_post">
                <button className="add-post">+ Add Post</button>
              </Link>
              {image ? (
                <img
                  src={resolveImageUrl(image)}
                  alt="profile"
                  className="profile-avatar"
                />
              ) : (
                <img
                  src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt="profile"
                  className="profile-avatar"
                />
              )}
            </>
          ) : (
            <>
              <Link className="login" to="/login">
                Login
              </Link>{" "}
              <Link className="signup" to="/signup">
                Signup
              </Link>
              {/* <FontAwesomeIcon icon={faToggleOn} /> */}
            </>
          )}
        </div>
        <div class="toggle-container">
          <input
            type="checkbox"
            id="toggle"
            onClick={toggleChange}
            value={clicked}
          />
          <label for="toggle" class="toggle-btn"></label>
        </div>
        {/* {clicked ? alert : alert("Dark mode is off")} */}
      </div>
    </header>
  );
}

export default Header;
