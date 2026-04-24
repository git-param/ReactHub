import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/ui/Logo";
import { loginUser, saveAuthUser } from "../lib/auth";
import { useAuth } from "../Context/AuthContext";
import styles from "../css/pages/Login.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? "/";

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { user, token } = await loginUser(formData.email, formData.password);

      login(user);
      saveAuthUser(user, token, formData.remember);
      
      // Admin users always land on admin dashboard after login.
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      // Redirect back to the page the user originally tried to access.
      navigate(from, { replace: true });

    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Left Side - Form */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>

          <div className={styles.logoSection}>
            <Link to="/" className={styles.logoLink}>
              <Logo size={32} />
              <span className={styles.logoText}>
                ReactHub
              </span>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.formGroup}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="password">Password</Label>
                  <div className={styles.passwordWrapper}>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      // placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={styles.passwordInput}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                    </Button>
                  </div>
                </div>

                <div className={styles.rememberRow}>
                  <div className={styles.rememberCheckbox}>
                    <Checkbox
                      id="remember"
                      checked={formData.remember}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        setFormData({
                          ...formData,
                          remember: checked === true,
                        })
                      }
                    />
                    <Label htmlFor="remember" className={styles.rememberLabel}>
                      Remember me
                    </Label>
                  </div>
                </div>

                <Button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                {error && (
                  <p className={styles.errorText}>{error}</p>
                )}

              </form>

              <div className={styles.signupSection}>
                Don't have an account?{" "}
                <Link to="/signup" className={styles.signupLink}>
                  Sign up
                </Link>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>

      {/* Right Side */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingContent}>
          <h2 className={styles.brandingTitle}>
            Build faster with ReactHub
          </h2>
          <p className={styles.brandingText}>
            Access hundreds of production-ready React components.
            Save time and ship better products.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;