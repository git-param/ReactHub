import { useComponentStore } from '../../store/componentStore';
import styles from '../../css/admin/DashboardStats.module.css';

type StatKey = 'users' | 'components' | 'comments' | 'likes';

const statsConfig: Array<{ label: string; key: StatKey; colorClass: string }> = [
    { label: 'Total Users', key: 'users', colorClass: styles.colorSky },
    { label: 'Total Components', key: 'components', colorClass: styles.colorViolet },
    { label: 'Total Comments', key: 'comments', colorClass: styles.colorEmerald },
    { label: 'Total Likes', key: 'likes', colorClass: styles.colorAmber },
];

const DashboardStats = () => {
    const { users, components, comments, likes, sectionLoading, sectionError } = useComponentStore();

    const statValues = {
        users: users.length,
        components: components.length,
        comments: comments.length,
        likes: likes.length,
    };

    const isLoading = sectionLoading.users || sectionLoading.components;
    const hasError = Boolean(sectionError.users || sectionError.components);

    return (
        <div className={styles.grid}>
            {statsConfig.map((stat) => (
                <div
                    key={stat.label}
                    className={styles.statCard}
                >
                    <p className={styles.statLabel}>{stat.label}</p>
                    <h3 className={styles.statValue}>
                        {isLoading ? '...' : statValues[stat.key]}
                    </h3>
                    <div className={`${styles.colorBar} ${stat.colorClass}`} />
                    {hasError && (
                        <p className={styles.errorHint}>Data may be incomplete.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
