import { useState, useEffect } from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../../utils/imageUrl";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBars, faMoon, faBookmark } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const [image, setImage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [userToken, setUserToken] = useState(localStorage.getItem("access"));
  const [openMenu, closeMenu] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    )?.matches;
    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);

    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/singleUser/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setImage(data.image || "");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
    window.addEventListener("profileUpdated", fetchUser);
    window.addEventListener("authChange", fetchUser);
    const handleStorageChange = () => {
      setUserToken(localStorage.getItem("access"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("profileUpdated", fetchUser);
      window.removeEventListener("authChange", fetchUser);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userToken]);
  useEffect(() => {
    image;
  }, [userToken]);

  const toggleChange = () => {
    setDarkMode((previous) => {
      const nextMode = !previous;
      document.body.classList.toggle("dark-mode", nextMode);
      localStorage.setItem("theme", nextMode ? "dark" : "light");
      closeMenu(false);
      return nextMode;
    });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleMenu = () => {
    closeMenu((prev) => {
      console.log(!prev);

      return !prev;
    });
  };

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

              <img
                src={
                  image
                    ? resolveImageUrl(image)
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="profile-avatar"
              />

              <div className="menu-wrapper">
                <div
                  className="menu-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenu();
                  }}
                >
                  <FontAwesomeIcon icon={faBars} />
                </div>

                {openMenu && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item">
                      <span>
                        <FontAwesomeIcon
                          icon={faMoon}
                          style={{ marginRight: "8px" }}
                        />
                        Dark Mode
                      </span>
                      <div className="toggle-container">
                        <input
                          type="checkbox"
                          id="toggle"
                          checked={darkMode}
                          onChange={toggleChange}
                        />
                        <label htmlFor="toggle" className="toggle-btn"></label>
                      </div>
                    </div>

                    <Link
                      to="/allPost"
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeMenu(false);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faBookmark}
                        style={{ marginRight: "8px" }}
                      />
                      Saved Posts
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
