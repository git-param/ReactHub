import { Link } from "react-router-dom";
import Logo from "./ui/Logo";
import styles from '../css/components/Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <Logo size={28} />
          <span className={styles.logoText}>
            ReactHub
          </span>
        </Link>

        {/* Links */}
        <div className={styles.copyright}>
          © 2026 ReactHub community
        </div>

        {/* Right Text */}
        <div className={styles.builtBy}>
          Built for developers, by developers.
        </div>
      </div>
    </footer>
  );
}

export default Footer;