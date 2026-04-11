import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../components/ui/Logo";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  resetRegisterForm,
  setTerms,
  submitAttempt,
  updateField,
  validateRegistrationForm,
} from "../store/registerSlice";
import { registerUser, saveAuthUser } from "../lib/auth";
import { useAuth } from "../Context/AuthContext";
import styles from "../css/pages/Register.module.css";


function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login } = useAuth();
  const { formData, errors } = useAppSelector((state) => state.register);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    dispatch(submitAttempt());
    const validation = validateRegistrationForm(formData);
    const hasErrors = !!validation.password || !!validation.confirmPassword;
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { user, token } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      login(user);
      if (token) {
        saveAuthUser(user, token, false);
      }
      dispatch(resetRegisterForm());
      navigate("/");
    }
    catch (submitError) {
      setServerError(submitError instanceof Error ? submitError.message : "Registration failed.");
    }
    finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.pageWrapper}>
      {/* Left Side - Image/Branding */}
      <div className={styles.brandingSide}>
        <div className={styles.brandingContent}>
          <h2 className={styles.brandingTitle}>
            Join the ReactHub community
          </h2>
          <p className={styles.brandingText}>
            Get access to premium components, contribute your own, and connect with thousands of developers.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
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
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Sign up to start exploring and sharing components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    // placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => dispatch(updateField({ field: "name", value: e.target.value }))}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    // placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => dispatch(updateField({ field: "email", value: e.target.value }))}
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
                      onChange={(e) => dispatch(updateField({ field: "password", value: e.target.value }))}
                      aria-invalid={!!errors.password}
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
                  {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className={styles.passwordWrapper}>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      // placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => dispatch(updateField({ field: "confirmPassword", value: e.target.value }))}
                      aria-invalid={!!errors.confirmPassword}
                      className={styles.passwordInput}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (<p className={styles.errorText}>{errors.confirmPassword}</p>)}
                </div>

                <div className={styles.termsRow}>
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(checked: boolean | "indeterminate") => dispatch(setTerms(checked === true))}
                  />
                  <Label htmlFor="terms" className={styles.termsLabel}>
                    I agree to the
                    <Button variant="link" className={styles.termsLink}>
                      Terms of Service
                    </Button>
                    and
                    <Button variant="link" className={styles.termsLink}>
                      Privacy Policy
                    </Button>
                  </Label>
                </div>

                <Button type="submit" className={styles.submitButton} disabled={!formData.terms || isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                {serverError && <p className={styles.errorText}>{serverError}</p>}
              </form>

              <div className={styles.loginSection}>
                Already have an account?{" "}
                <Link to="/login" className={styles.loginLink}>
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
