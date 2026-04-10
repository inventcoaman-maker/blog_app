import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
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
            </>
          ) : (
            <>
              <Link className="login" to="/login">
                Login
              </Link>{" "}
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
