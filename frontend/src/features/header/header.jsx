import { useState, useEffect, useContext } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../../utils/imageUrl";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars, faMoon, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "@mui/material/Skeleton";
import { UserContext } from "../context/authContext.jsx";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [darkMode, setDarkMode] = useState(false);
  const [userToken, setUserToken] = useState(localStorage.getItem("access"));
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  console.log(user?.image);

  // console.log(image);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);
  // const token = localStorage.getItem("access");

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/api/singleUser/`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         toast.error("API failed");
  //       }

  //       const data = await res.json();
  //       setImage(data.data.image || null);
  //     } catch (error) {
  //       toast.error("Failed to load profile");
  //       console.error(error);
  //     }
  //   };

  //   if (token) {
  //     fetchUser();
  //   }
  // }, [token]);

  // const fetchUser = async () => {
  //   const token = localStorage.getItem("access");
  //   if (!token) return;

  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`${API_URL}/api/singleUser/`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setImage(response.data?.image || "");
  //   } catch (error) {
  //     toast.error("Failed to load profile");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, []);
  console.log("IMAGE FINAL URL:", resolveImageUrl(user?.image));

  const toggleChange = () => {
    setDarkMode((previous) => {
      const nextMode = !previous;
      document.body.classList.toggle("dark-mode", nextMode);
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      setOpenMenu(false);
      return nextMode;
    });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.dispatchEvent(new Event("authChange"));
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  const handleMenu = () => {
    console.log("Menu clicked, current state:", openMenu);
    setOpenMenu((prev) => {
      const newState = !prev;
      console.log("Setting menu to:", newState);
      return newState;
    });
  };

  // Close menu when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (openMenu && !event.target.closest(".menu-wrapper")) {
  //       setOpenMenu(false);
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [openMenu]);

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

              <div className="avatar-wrapper">
                {loading && (
                  <Skeleton
                    variant="circular"
                    height={120}
                    width={120}
                    className="avatar-skeleton"
                  />
                )}

                <img
                  src={
                    user?.image
                      ? resolveImageUrl(user?.image)
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="profile-avatar"
                  style={{ opacity: 1 }}
                />
              </div>

              <div className="menu-wrapper">
                <div
                  className="menu-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenu();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenu();
                    }}
                  />
                </div>

                {openMenu && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item toggle-item">
                      <div className="left">
                        <FontAwesomeIcon icon={faMoon} />
                        <span>Dark Mode</span>
                      </div>

                      <div className="toggle-container">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={toggleChange}
                        />
                        <label className="toggle-btn"></label>
                      </div>
                    </div>

                    <Link
                      to="/history"
                      className="dropdown-item"
                      onClick={() => setOpenMenu(false)}
                    >
                      <div className="left">
                        <FontAwesomeIcon icon={faHistory} />
                        <span>History</span>
                      </div>
                    </Link>

                    <Link
                      to="/allPost"
                      className="dropdown-item"
                      onClick={() => setOpenMenu(false)}
                    >
                      <div className="left">
                        <FontAwesomeIcon icon={faBookmark} />
                        <span>Saved Posts</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link className="login" to="/login">
                Login
              </Link>
              <Link className="signup" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
