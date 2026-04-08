import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Check } from "lucide-react";
import { useComponentStore } from "../store/componentStore";
import { useAuth } from "../Context/AuthContext";
import styles from "../css/pages/Request.module.css";
import { getCategoryOptions } from "../utils/categories";

export function RequestComponentPage() {
  const { components, submitRequest, mutationLoading, mutationError } = useComponentStore();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const categoryOptions = getCategoryOptions(components);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitRequest({
        category: formData.category,
        component_name: formData.name,
        description: formData.description,
        username: user?.name ?? "Anonymous",
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", description: "", category: "" });
      }, 10000);
    } catch {
      // Error is surfaced from store mutationError state.
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Request a Component</h1>
          <p className={styles.subtitle}>
            Can't find what you're looking for? Request a new component and our community will help build it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component Request Form</CardTitle>
            <CardDescription>
              Provide details about the component you'd like to see added to the library
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>
                  <Check className={styles.successCheckIcon} />
                </div>
                <h3 className={styles.successTitle}>Request Submitted!</h3>
                <p className={styles.successDescription}>
                  Thank you for your request. We'll review it and get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <Label htmlFor="name">Component Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Animated Sidebar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formGroup}>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the component you need, including key features and use cases..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                  />
                  <p className={styles.formHint}>
                    Be as detailed as possible to help developers understand your needs
                  </p>
                </div>

                <div className={styles.buttonRow}>
                  <Button type="submit" className={styles.submitButton} disabled={mutationLoading.submitRequest}>
                    {mutationLoading.submitRequest ? "Submitting..." : "Submit Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={mutationLoading.submitRequest}
                    onClick={() => setFormData({ name: "", description: "", category: "" })}
                  >
                    Clear
                  </Button>
                </div>

                {mutationError.submitRequest && (
                  <p className={styles.errorText}>{mutationError.submitRequest}</p>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className={styles.tipsCard}>
          <CardHeader>
            <CardTitle className={styles.tipsCardTitle}>Tips for a good request</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={styles.tipsList}>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <span>Be specific about the functionality you need</span>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <span>Mention any similar components you've seen for reference</span>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <span>Describe the use case and context where you'll use it</span>
              </li>
              <li className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <span>Include any accessibility or performance requirements</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepIconViolet}>
              💡
            </div>
            <h3 className={styles.stepTitle}>Share Idea</h3>
            <p className={styles.stepDescription}>Describe the UI component and functionality.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIconFuchsia}>
              🛠️
            </div>
            <h3 className={styles.stepTitle}>We Build</h3>
            <p className={styles.stepDescription}>
              Our expert team develops the component with high quality.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIconEmerald}>
              🚀
            </div>
            <h3 className={styles.stepTitle}>Get Notified</h3>
            <p className={styles.stepDescription}>Once approved and built, we'll notify you via email.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RequestComponentPage
