import styles from "../../css/Landing/FeaturesFooter.module.css";
import { Eye, Heart, Zap } from "lucide-react";

function FeaturesSection() {
  return (
    <section className={styles.featuresWrapper}>
        <div className={styles.featuresGrid}>
            
            <div className={styles.featureCard}>
            <div className={styles.iconBox}>
                <Eye size={20} />
            </div>
            <h3 className={styles.featureTitle}>
                Live Previews
            </h3>
            <p className={styles.featureDescription}>
                See every component rendered in real time before you copy the code.
            </p>
            </div>

            <div className={styles.featureCard}>
            <div className={styles.iconBox}>
                <Heart size={20} />
            </div>
            <h3 className={styles.featureTitle}>
                Community Votes
            </h3>
            <p className={styles.featureDescription}>
                Like, comment, and surface the best components from the community.
            </p>
            </div>

            <div className={styles.featureCard}>
            <div className={styles.iconBox}>
                <Zap size={20} />
            </div>
            <h3 className={styles.featureTitle}>
                Copy & Go
            </h3>
            <p className={styles.featureDescription}>
                One-click code snippets ready to drop into any React project.
            </p>
            </div>

        </div>
    </section>
  );
}

export default FeaturesSection;