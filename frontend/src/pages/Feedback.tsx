import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Check, AlertCircle, Star } from "lucide-react";
import styles from "../css/pages/Feedback.module.css";
import starStyles from "../css/Feedback/Feedback.module.css";
import { getAuthToken } from "../lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const FEEDBACK_SUBMITTED_KEY = "feedback_submitted";

export function FeedbackPage() {
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return sessionStorage.getItem(FEEDBACK_SUBMITTED_KEY) === "true";
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [poppedStar, setPoppedStar] = useState(0);
  const [formData, setFormData] = useState({
    message: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/feedback/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: formData.message.trim(),
          rating: rating,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed (${response.status} ${response.statusText}).`);
      }

      setSubmitted(true);
      sessionStorage.setItem(FEEDBACK_SUBMITTED_KEY, "true");
    } catch (error) {
      if (error instanceof TypeError) {
        setSubmitError(`Cannot reach API server at ${API_BASE_URL}. Make sure backend is running.`);
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Unable to submit feedback.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getRatingColor = (currentRating: number) => {
    const colors: Record<number, string> = {
      1: "#ef4444",
      2: "#f97316",
      3: "#facc15",
      4: "#84cc16",
      5: "#22c55e",
    };
    return colors[currentRating] ?? "#9ca3af";
  };

  const displayedRating = hoverRating || rating;
  const activeColor = getRatingColor(displayedRating);

  const handleStarClick = (value: number) => {
    setRating(value);
    setPoppedStar(value);
    if (errors.rating) {
      setErrors({ ...errors, rating: "" });
    }
    setTimeout(() => setPoppedStar(0), 260);
  };

  const resetFeedbackForm = () => {
    setSubmitted(false);
    sessionStorage.removeItem(FEEDBACK_SUBMITTED_KEY);
    setFormData({ message: "" });
    setRating(0);
    setHoverRating(0);
    setSubmitError("");
    setErrors({});
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Send Us Feedback</h1>
          <p className={styles.subtitle}>
            We'd love to hear your thoughts, suggestions, or any issues you've encountered.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>
              Your feedback helps us improve the platform for everyone
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                  <Check className={styles.successCheckIcon} />
                </div>
                <h3 className={styles.successTitle}>Thank You!</h3>
                <p className={styles.successDescription}>
                  Your feedback has been submitted successfully. We appreciate your input!
                </p>
                <Button
                  type="button"
                  className={styles.submitAnotherButton}
                  onClick={resetFeedbackForm}
                >
                  Submit Another Feedback
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <Label>Rating</Label>
                  <div
                    className={starStyles.starRow}
                    onMouseLeave={() => setHoverRating(0)}
                    role="radiogroup"
                    aria-label="Rate from 1 to 5 stars"
                  >
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isActive = value <= displayedRating;
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`${starStyles.starButton} ${poppedStar === value ? starStyles.pop : ""}`}
                          onMouseEnter={() => setHoverRating(value)}
                          onFocus={() => setHoverRating(value)}
                          onBlur={() => setHoverRating(0)}
                          onClick={() => handleStarClick(value)}
                          role="radio"
                          aria-checked={rating === value}
                          aria-label={`${value} star${value > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={starStyles.starIcon}
                            fill={isActive ? activeColor : "transparent"}
                            color={isActive ? activeColor : "#9ca3af"}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <p className={styles.ratingInfo}>
                    {rating > 0 ? `Selected: ${rating}/5` : "Click a star to rate"}
                  </p>
                  {errors.rating && (
                    <div className={styles.errorField}>
                      <AlertCircle className={styles.errorIcon} />
                      <span>{errors.rating}</span>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={6}
                    className={errors.message ? styles.textareaError : ""}
                  />
                  {errors.message && (
                    <div className={styles.errorField}>
                      <AlertCircle className={styles.errorIcon} />
                      <span>{errors.message}</span>
                    </div>
                  )}
                  <p className={styles.formHint}>
                    Minimum 10 characters
                  </p>
                </div>

                <div className={styles.buttonRow}>
                  <Button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetFeedbackForm();
                    }}
                  >
                    Clear
                  </Button>
                </div>
                {submitError && (
                  <div className={styles.errorField}>
                    <AlertCircle className={styles.errorIcon} />
                    <span>{submitError}</span>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FeedbackPage
