import React from 'react';
import styles from '../css/components/CategoryBadge.module.css';

interface CategoryBadgeProps {
    badge: 'PRO' | 'PRO+';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = React.memo(({ badge }) => {
    const badgeVariant =
        badge === 'PRO'
            ? styles.badgePro
            : styles.badgeProPlus;

    return (
        <span
            className={`${styles.badge} ${badgeVariant}`}
        >
            {badge}
        </span>
    );
});

CategoryBadge.displayName = 'CategoryBadge';

export default CategoryBadge;
