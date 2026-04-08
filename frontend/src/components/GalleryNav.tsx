import React from 'react';
import styles from '../css/components/GalleryNav.module.css';

type Category =
    | 'Discover'
    | 'Animation'
    | 'Branding'
    | 'Illustration'
    | 'Mobile'
    | 'Print'
    | 'Product Design'
    | 'Typography'
    | 'Web Design';

const CATEGORIES: Category[] = [
    'Discover',
    'Animation',
    'Branding',
    'Illustration',
    'Mobile',
    'Print',
    'Product Design',
    'Typography',
    'Web Design',
];

interface GalleryNavProps {
    activeCategory: Category;
    onCategoryChange: (category: Category) => void;
}

const GalleryNav: React.FC<GalleryNavProps> = ({
    activeCategory,
    onCategoryChange,
}) => {
    return (
        <div className={styles.navWrapper}>
            <div className={styles.navContainer}>
                <div className={styles.navRow}>
                    {/* Left: Following dropdown */}
                    <div className={styles.sideSection}>
                        <button className={styles.dropdownButton}>
                            Following
                            <svg
                                className={styles.chevronIcon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Center: Category tabs */}
                    <div className={styles.tabsScroll}>
                        <div className={styles.tabsList}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => onCategoryChange(cat)}
                                    className={`${styles.categoryTab} ${activeCategory === cat
                                            ? styles.categoryTabActive
                                            : styles.categoryTabInactive
                                        }`}
                                >
                                    {cat}
                                    {/* Active underline */}
                                    {activeCategory === cat && (
                                        <span className={styles.activeIndicator} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Filters button */}
                    <div className={styles.sideSection}>
                        <button className={styles.dropdownButton}>
                            <svg
                                className={styles.filterIcon}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryNav;
export type { Category };
