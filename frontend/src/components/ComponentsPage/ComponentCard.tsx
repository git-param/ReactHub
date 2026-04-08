import { Heart } from 'lucide-react';
import type { Component } from '../../types/component';
import { Link } from 'react-router-dom';
import React from 'react';
import styles from '../../css/ComponentsPage/ComponentCard.module.css';
import { getAuthUser } from '../../lib/auth';

interface ComponentCardProps {
  component: Component;
}

export function ComponentCard({ component }: ComponentCardProps) {
  const [isLiked, setIsLiked] = React.useState(() => {
    const user = getAuthUser();
    if (!user) return false;
    const likedIds: string[] = JSON.parse(localStorage.getItem(`liked_components_${user.id}`) || '[]');
    return likedIds.includes(String(component.id));
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const user = getAuthUser();
    if (!user) {
      alert('Login required');
      return;
    }
    const storageKey = `liked_components_${user.id}`;
    const likedIds: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const compId = String(component.id);

    if (isLiked) {
      const updated = likedIds.filter((id) => id !== compId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setIsLiked(false);
    } else {
      likedIds.push(compId);
      localStorage.setItem(storageKey, JSON.stringify(likedIds));
      setIsLiked(true);
    }
  };

  return (
    <Link to={`/components/${component.id}`} className={`${styles.cardLink} group`}>
      <div className={styles.cardWrapper}>

        {/* Preview Image */}
        <div className={styles.previewContainer}>
          <img
            src={component.previewImage}
            alt={component.name}
            className={styles.previewImage}
          />
          {/* Category Badge */}
          <div className={styles.badgePosition}>
            <span className={styles.categoryBadge}>
              {component.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentArea}>
          {/* Title */}
          <div className={styles.titleRow}>
            <h3 className={styles.cardTitle}>
              {/* {component.name} */}
              {component.name ?? component.title} {/* Fallback to title if name is missing */}
            </h3>
          </div>

          {/* Description */}
          <p className={styles.cardDescription}>
            {component.description}
          </p>

          <div className={styles.footerRow}>
            <div className={styles.authorInfo}>
              <img
                src={component.author?.avatar}
                alt={component.author?.name}
                className={styles.authorAvatar}
              />
              <span className={styles.authorName}>{component.author?.name}</span>
            </div>

            {/* Right: Heart Icon */}
            <button
              onClick={handleLike}
              className={`${styles.likeButton} ${isLiked
                ? styles.likeActive
                : styles.likeInactive
                }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`${styles.heartIcon} ${isLiked ? styles.heartFilled : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}