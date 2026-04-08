import NavbarCss from "../css/navbar/NavbarCss.module.css";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./ui/Logo";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={NavbarCss.mainLayout}>
      {/* Left */}
      <Link to="/" className={NavbarCss.leftSection}>
        <Logo size={28} />
        <span className={NavbarCss.logoText}>
          ReactHub
        </span>
      </Link>

      {/* Center */}
      <div className={NavbarCss.centerSection}>
        <Link to="/components">Components</Link>
        <Link to="/request">Request</Link>
        <Link to="/feedback">Feedback</Link>
      </div>

      {/* Right */}
      <div className={NavbarCss.rightSection}>
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className={NavbarCss.themeBtn}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Auth UI */}
        {user ? (
          <div className={NavbarCss.profileSection}>
            <User size={18} />
            <span>{user.name}</span>

            <button onClick={logout} className={NavbarCss.logoutBtn}>
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className={NavbarCss.loginText}>
              Login
            </Link>

            <Link to="/signup" className={NavbarCss.signUpBtn}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;