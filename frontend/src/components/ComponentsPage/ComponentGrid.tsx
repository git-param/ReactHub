import type { Component } from '../../types/component';
import {ComponentCard} from './ComponentCard';
import styles from '../../css/ComponentsPage/ComponentGrid.module.css';

interface ComponentGridProps {
    components: Component[];
    isLoading?: boolean;
}

export const ComponentGrid: React.FC<ComponentGridProps> = ({ components, isLoading }) => {
    if (isLoading) {
        return (
            <div className={styles.grid}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard}>
                        <div className={styles.skeletonImage}/>
                        <div className={styles.skeletonContent}>
                            <div className={styles.skeletonTitle} />
                            <div className={styles.skeletonLine} />
                            <div className={styles.skeletonLineShort} />
                        </div>
                    </div>            
                ))}
            </div>    
        );
    }

    //Empty state - show when no components found
    if (components.length === 0) {
        return(
            <div className={styles.emptyState}>
                <div className={styles.emptyIconWrapper}>
                    <svg
                        className={styles.emptyIcon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>    
                </div>
                <h3 className={styles.emptyTitle}>No components found</h3>
                <p className={styles.emptyDescription}>
                    Try adjusting your filters or search query to find what you're looking for.
                </p>
            </div>
        );
    }

    //Normal State - Display component cards in grid
    return (
        <div className={styles.grid}>
            {components.map((component) => (
                <ComponentCard key={component.id} component={component} />
            ))}
        </div>
    );
}