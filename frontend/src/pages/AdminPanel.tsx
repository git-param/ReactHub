import { useState, useEffect } from 'react';
import { useComponentStore } from '../store/componentStore';
import DashboardStats from '../components/admin/DashboardStats';
import ActivityInsights from '../components/admin/ActivityInsights';
import { ComponentsTable, UsersTable, RequestsTable, ActivityTable } from '../components/admin/AdminTables';
import axios from 'axios';
import styles from '../css/pages/AdminPanel.module.css';
import { DEFAULT_COMPONENT_CATEGORIES } from '../utils/categories';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface ComponentForm {
    name: string;
    description: string;
    category: string;
    framework: string;
    installCmd: string;
    css: string;
    componentCode: string;
    cssCode: string;
    usageCode: string;
}

const EMPTY_FORM: ComponentForm = {
    name: '',
    description: '',
    category: '',
    framework: 'React 18, TypeScript',
    installCmd: '',
    css: 'tailwind',
    componentCode: '',
    cssCode: '',
    usageCode: '',
};

type Tab = 'overview' | 'components' | 'users' | 'requests' | 'settings';

function AdminPanel() {
    const { fetchData, error: storeError, mutationLoading } = useComponentStore();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [showAddModal, setShowAddModal] = useState(false);

    const [form, setForm] = useState<ComponentForm>({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Build slug from name
            const slug = form.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            const newComponent = {
                id: String(Date.now()),
                slug,
                name: form.name,
                description: form.description,
                category: form.category,
                framework: form.framework.split(',').map(f => f.trim()).filter(Boolean),
                votes: [],
                comments: [],
                author: {
                    name: 'Admin',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
                },
                previewImage: `https://placehold.co/600x400/7c3aed/ffffff?text=${encodeURIComponent(form.name)}`,
                installCmd: form.installCmd,
                css: form.css,
                componentCode: form.componentCode,
                cssCode: form.cssCode,
                usageCode: form.usageCode,
                status: 'published',
                userId: '1',
                createdAt: new Date().toISOString(),
            };

            await axios.post(`${API_BASE_URL}/components`, newComponent);

            setForm({ ...EMPTY_FORM });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setShowAddModal(false);
            }, 2000);
        } catch {
            setError('Failed to add component. Make sure the server is running (npm run server).');
        } finally {
            setSubmitting(false);
        }
    };

    const tabStyle = (tab: Tab) => ({
        padding: '12px 20px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 600,
        backgroundColor: activeTab === tab ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
        color: activeTab === tab ? '#a78bfa' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        outline: 'none',
    } as const);


    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Admin Dashboard</h1>
                        <p className={styles.subtitle}>
                            Manage your components, users, and overall platform activity.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={styles.addButton}
                    >
                        <span>+</span> Add Component
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.tabBar}>
                    {(['overview', 'components', 'users', 'requests', 'settings'] as Tab[]).map((tab) => (
                        <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {storeError && (
                    <div className={styles.errorBanner}>
                        {storeError}
                    </div>
                )}

                {activeTab === 'overview' && (
                    <>
                        <DashboardStats />
                        <ActivityInsights />
                        <ActivityTable title="Platform Logs" description="Recent system and user activities." />
                    </>
                )}
                {activeTab === 'components' && (
                    <ComponentsTable title="Components Registry" description="Inventory of all published components." />
                )}
                {activeTab === 'users' && (
                    <UsersTable title="User Directory" description="List of all registered platform users." />
                )}
                {activeTab === 'requests' && (
                    <RequestsTable title="Submission Requests" description="Handle pending component requests from users." />
                )}
                {activeTab === 'settings' && (
                    <div className={styles.settingsPlaceholder}>Settings panel coming soon.</div>
                )}
            </div>

            {/* Add Component Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className={styles.modalClose}
                        >
                            ✕
                        </button>

                        <h2 className={styles.modalTitle}>Publish New Component</h2>

                        {success && (
                            <div className={styles.successBanner}>
                                ✓ Component published successfully! The page will auto-update.
                            </div>
                        )}

                        {error && (
                            <div className={styles.errorBannerModal}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* Row 1: Name + Category */}
                            <div className={styles.formGrid}>
                                <div>
                                    <label className={styles.labelClass}>Component Name *</label>
                                    <input
                                        name="name" value={form.name} onChange={handleChange} required
                                        className={styles.inputClass}
                                        placeholder="e.g. Animated Button"
                                    />
                                </div>
                                <div>
                                    <label className={styles.labelClass}>Category *</label>
                                    <select
                                        name="category" value={form.category} onChange={handleChange} required
                                        className={styles.inputClass}
                                    >
                                        <option value="">Select Category</option>
                                        {DEFAULT_COMPONENT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Description */}
                            <div>
                                <label className={styles.labelClass}>Description *</label>
                                <input
                                    name="description" value={form.description} onChange={handleChange} required
                                    className={styles.inputClass}
                                    placeholder="Brief summary of this component..."
                                />
                            </div>

                            {/* Row 3: Framework + Install Command */}
                            <div className={styles.formGrid}>
                                <div>
                                    <label className={styles.labelClass}>Framework (comma-separated)</label>
                                    <input
                                        name="framework" value={form.framework} onChange={handleChange}
                                        className={styles.inputClass}
                                        placeholder="React 18, TypeScript, Tailwind CSS"
                                    />
                                </div>
                                <div>
                                    <label className={styles.labelClass}>Install Command</label>
                                    <input
                                        name="installCmd" value={form.installCmd} onChange={handleChange}
                                        className={styles.inputClass}
                                        placeholder="e.g. npm install framer-motion"
                                    />
                                </div>
                            </div>

                            {/* Row 4: Source Code (JSX/TSX) */}
                            <div>
                                <label className={styles.labelClass}>Source Code (JSX/TSX) *</label>
                                <textarea
                                    name="componentCode" value={form.componentCode} onChange={handleChange} required rows={10}
                                    className={styles.codeInput}
                                    placeholder="Paste your full React component code here..."
                                    spellCheck={false}
                                />
                            </div>

                            {/* Row 5: CSS Code */}
                            <div>
                                <label className={styles.labelClass}>CSS Code</label>
                                <textarea
                                    name="cssCode" value={form.cssCode} onChange={handleChange} rows={6}
                                    className={styles.codeInput}
                                    placeholder="Paste CSS styles for this component..."
                                    spellCheck={false}
                                />
                            </div>

                            {/* Row 6: Usage / Import Code */}
                            <div>
                                <label className={styles.labelClass}>Usage / Import Code *</label>
                                <textarea
                                    name="usageCode" value={form.usageCode} onChange={handleChange} required rows={5}
                                    className={styles.codeInput}
                                    placeholder={`import MyComponent from './MyComponent';\nimport './MyComponent.css';\n\n<MyComponent prop1="value" />`}
                                    spellCheck={false}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting || mutationLoading.addComponent}
                                className={styles.submitButton}
                            >
                                {submitting ? 'Publishing...' : 'Publish Component'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
