import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Component } from '../../types/component';
import styles from '../../css/ComponentsPage/Sidebar.module.css';
import { getCategoryOptions, normalizeCategory } from '../../utils/categories';

interface SidebarProps {
    components: Component[];
    // Callback to update active category in parent component
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export function Sidebar({ components, activeCategory, onCategoryChange }: SidebarProps) {
    // Track which categories are expanded
//  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
//  Initial value is buttons, therefore the buttons category will be expaned when the page loads.
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Group components by category
    const categorizedComponent = components.reduce((acc, component) => {
        const category = normalizeCategory(component.category);

        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(component);
        return acc;
    }, {} as Record<string, Component[]>);

    const categories = getCategoryOptions(components).filter((category) => categorizedComponent[category]?.length);

    // Toggle category expand/collapse
    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className={styles.sidebar}>

            {/* Categories Section */}
            <div>
                <h2 className={styles.sectionTitle}>
                    Categories
                </h2>

                <div className={styles.categoryList}>

                    {/* All Categories Button */}
                    <button
                        onClick={() => onCategoryChange('All')}
                        className={`${styles.categoryButton} ${
                            activeCategory === 'All'
                                ? styles.categoryButtonActive
                                : styles.categoryButtonInactive
                        }`}
                    >
                        <span className={styles.categoryLabel}>
                            All Categories 
                        </span>
                    </button>

                    {categories.map((category) => {
                        const isExpanded = expandedCategories.includes(category);
                        const categoryComponents = categorizedComponent[category];

                        return (
                            <div key={category}>
                                {/* Category Header - Clickable */}
                                <button
                                    onClick={() => {
                                        toggleCategory(category);
                                        onCategoryChange(category);
                                    }}
                                    className={`${styles.categoryButton} ${
                                        activeCategory === category
                                            ? styles.categoryButtonActive
                                            : styles.categoryButtonInactive
                                    }`}
                                >
                                    <span className={styles.categoryLabel}>
                                        {isExpanded ? (
                                            <ChevronDown className={styles.chevronIcon} />
                                        ) : (
                                            <ChevronRight className={styles.chevronIcon} />
                                        )}
                                        {category} 
                                    </span>
                                </button>

                                {/* Component List - Collapsible */}
                                {isExpanded && (
                                    <div className={styles.componentList}>
                                        {categoryComponents.map((component) => (
                                            <a
                                                key={component.id}
                                                // href={`/components/${component.slug}`}
                                                href={`/components/${component.id}`} // Using ID for routing
                                                className={styles.componentLink}
                                            >
                                                {/* {component.name} */}
                                                {component.name ?? component.title} {/* Fallback to title if name is missing */}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
