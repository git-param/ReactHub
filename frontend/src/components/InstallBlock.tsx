import React, { useState, useCallback } from 'react';
import styles from '../css/components/InstallBlock.module.css';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';
type InstallTab = 'cli' | 'manual';

interface InstallBlockProps {
    installCmd: {
        pnpm?: string;
        npm?: string;
        yarn?: string;
        bun?: string;
    };
    componentCode: string;
    cssCode?: string;
}

const MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const InstallBlock: React.FC<InstallBlockProps> = ({
    installCmd,
    componentCode,
    cssCode,
}) => {
    const [activeTab, setActiveTab] = useState<InstallTab>('cli');
    const [activePkg, setActivePkg] = useState<PackageManager>('npm');
    const [copied, setCopied] = useState(false);
    const [copiedFile, setCopiedFile] = useState<string | null>(null);

    const handleCopy = useCallback((text: string, fileId?: string) => {
        navigator.clipboard.writeText(text);
        if (fileId) {
            setCopiedFile(fileId);
            setTimeout(() => setCopiedFile(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, []);

    return (
        <div>
            {/* Outer tabs: CLI / Manual */}
            <div className={styles.tabsContainer}>
                <button
                    onClick={() => setActiveTab('cli')}
                    className={`${styles.tabButton} ${activeTab === 'cli'
                        ? styles.tabButtonActive
                        : styles.tabButtonInactive
                        }`}
                >
                    CLI
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`${styles.tabButton} ${activeTab === 'manual'
                        ? styles.tabButtonActive
                        : styles.tabButtonInactive
                        }`}
                >
                    Manual
                </button>
            </div>

            {activeTab === 'cli' ? (
                <div>
                    {/* Package manager switcher */}
                    <div className={styles.pkgSwitcher}>
                        {MANAGERS.map((mgr) => (
                            <button
                                key={mgr}
                                onClick={() => setActivePkg(mgr)}
                                className={`${styles.pkgButton} ${activePkg === mgr
                                    ? styles.pkgButtonActive
                                    : styles.pkgButtonInactive
                                    }`}
                            >
                                {mgr}
                                {activePkg === mgr && (
                                    <span className={styles.pkgIndicator} />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Command line */}
                    <div
                        className={styles.commandLine}
                        style={{ backgroundColor: '#0d0917', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <code className={styles.commandCode} style={{ color: '#86efac' }}>
                            {installCmd[activePkg] ?? ''}
                        </code>
                        <button
                            onClick={() => handleCopy(installCmd[activePkg] ?? '')}
                            className={styles.copyBtn}
                            style={{ color: copied ? '#4ade80' : 'rgba(255,255,255,0.4)' }}
                        >
                            {copied ? (
                                <svg className={styles.iconSm} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className={styles.iconSm} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                /* Manual tab — show file contents */
                <div className={styles.manualContainer}>
                    <div
                        className={styles.fileBlock}
                        style={{ backgroundColor: '#0d0917', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className={styles.fileHeader}>
                            <span className={styles.fileName}>Component.tsx</span>
                            <button
                                onClick={() => handleCopy(componentCode, 'component')}
                                className={styles.fileCopyBtn}
                                style={{ color: copiedFile === 'component' ? '#4ade80' : 'rgba(255,255,255,0.4)' }}
                            >
                                {copiedFile === 'component' ? (
                                    <svg className={styles.iconXs} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className={styles.iconXs} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className={styles.fileContent}>
                            <pre className={styles.fileCode} style={{ color: 'rgba(255,255,255,0.7)' }}>
                                {componentCode}
                            </pre>
                        </div>
                    </div>

                    {cssCode && (
                        <div
                            className={styles.fileBlock}
                            style={{ backgroundColor: '#0d0917', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div className={styles.fileHeader}>
                                <span className={styles.fileName}>Component.css</span>
                                <button
                                    onClick={() => handleCopy(cssCode, 'css')}
                                    className={styles.fileCopyBtn}
                                    style={{ color: copiedFile === 'css' ? '#4ade80' : 'rgba(255,255,255,0.4)' }}
                                >
                                    {copiedFile === 'css' ? (
                                        <svg className={styles.iconXs} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className={styles.iconXs} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <div className={styles.fileContent}>
                                <pre className={styles.fileCode} style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {cssCode}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstallBlock;
