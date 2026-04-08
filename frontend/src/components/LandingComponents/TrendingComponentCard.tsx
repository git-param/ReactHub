import styles from "../../css/Landing/TrendingComponentCard.module.css";

type Props = {
  title: string;
  description: string;
  category: string;
  likes: number;
  comments?: number;
};

function TrendingComponentCard({ title, description, category, likes }: Props) {
  return (
    <div className={styles.card} style={{ borderColor: "var(--border-primary)" }}>
      {/* Category Badge */}
      <span className={styles.categoryBadge}>
        {category}
      </span>

      {/* Title */}
      <h3 className={styles.cardTitle}>{title}</h3>

      {/* Description */}
      <p className={styles.cardDescription}>
        {description}
      </p>

      {/* Bottom Row */}
      <div className={styles.cardFooter}>
        <div className={styles.statsRow}>
          <span>♡ {likes}</span>
        </div>

        <button className={styles.viewButton}>
          View
        </button>
      </div>
    </div>
  );
}

export default TrendingComponentCard;