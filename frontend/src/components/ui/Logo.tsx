import styles from '../../css/ui/Logo.module.css';

export function Logo({
    className = "",
    size = 28,
    glow = true,
}: {
    className?: string;
    size?: number;
    glow?: boolean;
}) {
    return (
        <div className={`${styles.wrapper} ${className}`}>
            {glow && (
                <div
                    className={styles.glowEffect}
                    style={{ width: size * 1.5, height: size * 1.5, zIndex: 0 }}
                />
            )}
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svgIcon}
            >
                <defs>
                    <linearGradient id="reacthub-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
                        <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
                    </linearGradient>
                    <linearGradient id="reacthub-grad-light" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" /> {/* purple-400 */}
                        <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Center Core */}
                <circle cx="50" cy="50" r="10" fill="url(#reacthub-grad-light)" />

                {/* Orbit 1 */}
                <ellipse
                    cx="50" cy="50" rx="42" ry="14"
                    stroke="url(#reacthub-grad)" strokeWidth="4" fill="transparent"
                    transform="rotate(30 50 50)"
                />
                {/* Orbit 2 */}
                <ellipse
                    cx="50" cy="50" rx="42" ry="14"
                    stroke="url(#reacthub-grad)" strokeWidth="4" fill="transparent"
                    transform="rotate(90 50 50)"
                />
                {/* Orbit 3 */}
                <ellipse
                    cx="50" cy="50" rx="42" ry="14"
                    stroke="url(#reacthub-grad)" strokeWidth="4" fill="transparent"
                    transform="rotate(150 50 50)"
                />

                {/* Connection nodes on orbits */}
                <circle cx="86" cy="70" r="4" fill="#a855f7" />
                <circle cx="14" cy="30" r="4" fill="#3b82f6" />
                <circle cx="50" cy="8" r="4" fill="#60a5fa" />

            </svg>
        </div>
    );
}

export default Logo;
