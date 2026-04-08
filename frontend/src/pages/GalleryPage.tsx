import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useComponentStore } from '../store/componentStore';
import ComponentCard from '../components/ComponentCard';
import AnimatedList from '../components/AnimatedList';
import '../components/AnimatedList.css';
import styles from '../css/pages/GalleryPage.module.css';

const animatedListItems = [
    'Button Component',
    'Modal Dialog',
    'Dropdown Menu',
    'Toast Notification',
    'Data Table',
    'Form Input',
    'Avatar Group',
    'Progress Bar',
    'Tab Navigation',
    'Badge Component',
];

function getDemoForId(id: string) {
    switch (id) {
        case 'animated-list':
            return (
                <AnimatedList
                    items={animatedListItems}
                    onItemSelect={(item, index) => console.log(item, index)}
                    showGradients
                    enableArrowNavigation
                    displayScrollbar
                />
            );
        default:
            return null;
    }
}

function GalleryPage() {
    const { components, loading, error, fetchComponents } = useComponentStore();

    useEffect(() => {
        fetchComponents();
    }, [fetchComponents]);

    return (
        <div className={styles.pageWrapper}>
            {/* Header */}
            <div className={styles.headerSection}>
                <h1 className={styles.title}>Components</h1>
                <p className={styles.subtitle}>
                    Browse interactive, copy-ready React components
                </p>
            </div>

            {/* Grid */}
            <div className={styles.contentSection}>
                {loading && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner} />
                    </div>
                )}

                {error && (
                    <div className={styles.errorBox}>
                        {error}
                    </div>
                )}

                {!loading && !error && components.length === 0 && (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            No components yet. Add one from the{' '}
                            <a href="/admin" style={{ color: '#a78bfa', textDecoration: 'underline' }}>
                                Admin Panel
                            </a>
                            .
                        </p>
                    </div>
                )}

                <div className={styles.componentsGrid}>
                    {components.map((comp) => (
                        <ComponentCard
                            key={comp.id}
                            id={comp.id}
                            title={comp.title ?? comp.name ?? ''}
                            category={comp.category}
                            demoSlot={getDemoForId(comp.id)}
                        />
                    ))}
                </div>

                {/* Request Section */}
                <div className={styles.requestWrapper}>
                    <div className={styles.requestCard}>
                        <h3 className={styles.requestTitle}>Need a Custom Component?</h3>
                        <p className={styles.requestDescription}>
                            Submit a request and our team will review it.
                        </p>
                        <Link
                            to="/request"
                            className={styles.requestButton}
                        >
                            Request a Component
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GalleryPage;
