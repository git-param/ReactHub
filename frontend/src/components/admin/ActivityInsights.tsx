import { useComponentStore } from '../../store/componentStore';
import styles from '../../css/admin/ActivityInsights.module.css';

const ActivityInsights = () => {
    const { components, users, logs, sectionLoading, sectionError } = useComponentStore();

    // Calculate components per user
    const userStats = users.map(user => ({
        name: user.name,
        count: components.filter(c => c.userId === user.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const recentComponents = [...components]
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 5);

    const latestActivity = [...logs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    return (
        <div className={styles.grid}>
            {/* User Contribution */}
            <div className={styles.card}>
                <h4 className={styles.cardTitle}>Top Contributors</h4>
                <div className={styles.cardContent}>
                    {sectionLoading.users || sectionLoading.components ? (
                        <p className={styles.loadingText}>Loading contributors...</p>
                    ) : sectionError.users || sectionError.components ? (
                        <p className={styles.errorText}>Failed to load contributors.</p>
                    ) : userStats.length === 0 ? (
                        <p className={styles.loadingText}>No contributor data available.</p>
                    ) : userStats.map((stat, i) => (
                        <div key={i} className={styles.contributorRow}>
                            <span className={styles.contributorName}>{stat.name}</span>
                            <span className={styles.contributorCount}>{stat.count} components</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Components */}
            <div className={styles.card}>
                <h4 className={styles.cardTitle}>Recently Added</h4>
                <div className={styles.cardContent}>
                    {sectionLoading.components ? (
                        <p className={styles.loadingText}>Loading components...</p>
                    ) : sectionError.components ? (
                        <p className={styles.errorText}>Failed to load recent components.</p>
                    ) : recentComponents.length === 0 ? (
                        <p className={styles.loadingText}>No recent components.</p>
                    ) : recentComponents.map((comp, i) => (
                        <div key={i} className={styles.componentRow}>
                            <div className={styles.componentIcon}>
                                {comp.title?.[0] ?? '?'}
                            </div>
                            <div className={styles.componentInfo}>
                                <p className={styles.componentName}>{comp.title ?? 'Untitled'}</p>
                                <p className={styles.componentCategory}>{comp.category ?? 'Uncategorized'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Latest Activity */}
            <div className={styles.card}>
                <h4 className={styles.cardTitle}>Latest Activity</h4>
                <div className={styles.cardContent}>
                    {sectionLoading.logs ? (
                        <p className={styles.loadingText}>Loading activity...</p>
                    ) : sectionError.logs ? (
                        <p className={styles.errorText}>Failed to load activity.</p>
                    ) : latestActivity.length === 0 ? (
                        <p className={styles.loadingText}>No recent activity.</p>
                    ) : latestActivity.map((log, i) => (
                        <div key={i} className={styles.activityRow}>
                            <div className={styles.activityDot} />
                            <div>
                                <p className={styles.activityDetails}>{log.details}</p>
                                <p className={styles.activityTime}>
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityInsights;
