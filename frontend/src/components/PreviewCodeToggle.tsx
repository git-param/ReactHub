import React from 'react';
import styles from '../css/components/PreviewCodeToggle.module.css';

interface PreviewCodeToggleProps {
    activeTab: 'preview' | 'code';
    onTabChange: (tab: 'preview' | 'code') => void;
}

const PreviewCodeToggle: React.FC<PreviewCodeToggleProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className={styles.toggleContainer} style={{ backgroundColor: '#1a1030' }}>
            <button
                onClick={() => onTabChange('preview')}
                className={`${styles.toggleButton} ${activeTab === 'preview' ? styles.toggleButtonActive : styles.toggleButtonInactive}`}
            >
                Preview
            </button>
            <button
                onClick={() => onTabChange('code')}
                className={`${styles.toggleButton} ${activeTab === 'code' ? styles.toggleButtonActive : styles.toggleButtonInactive}`}
            >
                Code
            </button>
        </div>
    );
};

export default PreviewCodeToggle;
