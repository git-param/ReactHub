import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/components/ComponentCard.module.css';

interface ComponentCardProps {
    id: string;
    title: string;
    category: string;
    demoSlot: React.ReactNode;
    likes?: number;
}

const ComponentCard: React.FC<ComponentCardProps> = React.memo(
    ({ id, title, category, demoSlot }) => {
        const [liked, setLiked] = useState(false);
        const navigate = useNavigate();

        const handleLike = (e: React.MouseEvent) => {
            e.stopPropagation();
            setLiked((prev) => !prev);
        };

        const handleClick = () => {
            navigate(`/components/${id}`);
        };

        return (
            <div
                onClick={handleClick}
                className={styles.card}
                style={{
                    backgroundColor: '#110d1f',
                    border: '1px solid #1e1535',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#7c3aed';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#1e1535';
                }}
            >
                {/* Header row: Title + Category */}
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{title}</h3>
                    <span className={styles.cardCategory} style={{ color: '#a78bfa' }}>
                        {category}
                    </span>
                </div>

                {/* Demo area */}
                <div className={styles.demoWrapper}>
                    <div
                        className={`${styles.demoSlot} card-demo-slot`}
                        style={{ backgroundColor: '#060010' }}
                    >
                        {demoSlot}
                    </div>

                    {/* Heart button — appears on hover */}
                    <button
                        onClick={handleLike}
                        className={styles.likeButton}
                        style={{
                            backgroundColor: liked ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            border: `1px solid ${liked ? 'rgba(236, 72, 153, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
                        }}
                        aria-label="Like"
                    >
                        <svg
                            className={`${styles.heartIcon} ${liked ? styles.heartIconLiked : styles.heartIconDefault}`}
                            viewBox="0 0 24 24"
                            fill={liked ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
);

ComponentCard.displayName = 'ComponentCard';

export default ComponentCard;
export type { ComponentCardProps };
