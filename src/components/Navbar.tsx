import NavbarCss from '../css/navbar/NavbarCss.module.css';
import { useTheme } from "../Context/ThemeContext";
import { Moon, Sun, Code2 } from "lucide-react";

function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={NavbarCss.mainLayout}>

            {/* Left */}
            <div className={NavbarCss.leftSection}>
                <Code2 color="#8b5cf6" size={22} />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    ReactBits
                </span>
            </div>

            {/* Center */}
            <div className={NavbarCss.centerSection}>
                <span>Components</span>
                <span>Request</span>
                <span>Feedback</span>
            </div>

            {/* Right */}
            <div className={NavbarCss.rightSection}>
                <button onClick={toggleTheme} className={NavbarCss.themeBtn}>
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <span className={NavbarCss.loginText}>Login</span>


                <button className={NavbarCss.signUpBtn}>
                    Sign Up
                </button>
            </div>

        </div>
    );
}

export default Navbar;