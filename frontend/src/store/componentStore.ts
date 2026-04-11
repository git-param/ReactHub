import { create } from 'zustand';
import axios from 'axios';
import type { ComponentMeta, User, ComponentRequest, ActivityLog, Comment, Like } from '../types/component';
import { normalizeCategory } from '../utils/categories';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
type SectionKey = 'components' | 'users' | 'requests' | 'logs';
type MutationKey = 'addComponent' | 'submitRequest' | 'updateRequestStatus' | 'deleteComponent';

type RawComponent = Partial<ComponentMeta> & {
    id?: string | number;
    name?: string;
    slug?: string;
    component_code?: string;
    css_code?: string;
    usage_code?: string;
    component_code_path?: string;
    user_id?: string | number;
    created_at?: string;
    updated_at?: string;
    author?: {
        name?: string;
    };
    installCmd?: ComponentMeta['installCmd'] | string;
};

const normalizeComponent = (component: RawComponent): ComponentMeta => {
    const normalizedInstallCmd =
        typeof component.installCmd === 'string'
            ? { npm: component.installCmd }
            : component.installCmd;

    return {
        ...component,
        id: String(component.id ?? Date.now()),
        slug: component.slug,
        title: component.title ?? component.name ?? 'Untitled Component',
        name: component.name ?? component.title ?? 'Untitled Component',
        category: normalizeCategory(component.category),
        description: component.description ?? '',
        installCmd: normalizedInstallCmd,
        componentCode: component.componentCode ?? component.component_code ?? '',
        cssCode: component.cssCode ?? component.css_code ?? '',
        usageCode: component.usageCode ?? component.usage_code ?? '',
        componentPath: component.componentPath ?? component.component_code_path,
        userId: String(component.userId ?? component.user_id ?? component.author?.name ?? 'unknown'),
        createdAt: component.createdAt ?? component.created_at ?? new Date().toISOString(),
        status: component.status ?? 'published',
    };
};

interface ComponentStore {
    components: ComponentMeta[];
    users: User[];
    requests: ComponentRequest[];
    logs: ActivityLog[];
    comments: Comment[];
    likes: Like[];
    loading: boolean;
    error: string | null;
    sectionLoading: Record<SectionKey, boolean>;
    sectionError: Partial<Record<SectionKey, string | null>>;
    mutationLoading: Record<MutationKey, boolean>;
    mutationError: Partial<Record<MutationKey, string | null>>;

    fetchData: () => Promise<void>;
    fetchComponents: () => Promise<void>;
    fetchUsers: () => Promise<void>;
    fetchRequests: () => Promise<void>;
    fetchLogs: () => Promise<void>;

    addComponent: (component: Omit<ComponentMeta, 'userId' | 'createdAt'>) => Promise<void>;
    submitRequest: (request: Pick<ComponentRequest, 'category' | 'component_name' | 'description' | 'username'>) => Promise<void>;
    updateRequestStatus: (requestId: string, status: 'approved' | 'rejected') => Promise<void>;
    deleteComponent: (id: string) => Promise<void>;
    addLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => Promise<void>;
}

const normalizeRequests = (raw: unknown): ComponentRequest[] => {
    if (Array.isArray(raw)) {
        return raw as ComponentRequest[];
    }

    if (raw && typeof raw === 'object') {
        return Object.values(raw as Record<string, ComponentRequest>);
    }

    return [];
};

const toRequestRecord = (requests: ComponentRequest[]) =>
    Object.fromEntries(requests.map((request) => [request.request_id, request]));

export const useComponentStore = create<ComponentStore>((set, get) => ({
    components: [],
    users: [],
    requests: [],
    logs: [],
    comments: [],
    likes: [],
    loading: false,
    error: null,
    sectionLoading: {
        components: false,
        users: false,
        requests: false,
        logs: false,
    },
    sectionError: {},
    mutationLoading: {
        addComponent: false,
        submitRequest: false,
        updateRequestStatus: false,
        deleteComponent: false,
    },
    mutationError: {},

    fetchData: async () => {
        set({ loading: true, error: null });

        await Promise.all([
            get().fetchComponents(),
            get().fetchUsers(),
            get().fetchRequests(),
            get().fetchLogs(),
        ]);

        const current = get();
        const hasSectionError = Object.values(current.sectionError).some(Boolean);
        set({
            loading: false,
            error: hasSectionError ? 'Some dashboard sections failed to load.' : null,
        });
    },

    fetchComponents: async () => {
        set((state) => ({
            sectionLoading: { ...state.sectionLoading, components: true },
            sectionError: { ...state.sectionError, components: null },
        }));

        try {
            const { data } = await axios.get<RawComponent[]>(`${API_BASE_URL}/api/components/browse/all`);

            const components = data.map(normalizeComponent);

            set((state) => ({
                components,
                sectionLoading: { ...state.sectionLoading, components: false },
            }));
        } catch {
            set((state) => ({
                sectionLoading: { ...state.sectionLoading, components: false },
                sectionError: { ...state.sectionError, components: 'Failed to load components.' },
                error: state.error ?? 'Failed to fetch dashboard data',
            }));
        }
    },

    fetchUsers: async () => {
        set((state) => ({
            sectionLoading: { ...state.sectionLoading, users: true },
            sectionError: { ...state.sectionError, users: null },
        }));

        try {
            const { data } = await axios.get(`${API_BASE_URL}/users`);
            set((state) => ({
                users: data,
                sectionLoading: { ...state.sectionLoading, users: false },
            }));
        } catch {
            set((state) => ({
                sectionLoading: { ...state.sectionLoading, users: false },
                sectionError: { ...state.sectionError, users: 'Failed to load users.' },
                error: state.error ?? 'Failed to fetch dashboard data',
            }));
        }
    },

    fetchRequests: async () => {
        set((state) => ({
            sectionLoading: { ...state.sectionLoading, requests: true },
            sectionError: { ...state.sectionError, requests: null },
        }));

        try {
            const { data } = await axios.get(`${API_BASE_URL}/component_requests`);
            set((state) => ({
                requests: normalizeRequests(data),
                sectionLoading: { ...state.sectionLoading, requests: false },
            }));
        } catch {
            set((state) => ({
                sectionLoading: { ...state.sectionLoading, requests: false },
                sectionError: { ...state.sectionError, requests: 'Failed to load requests.' },
                error: state.error ?? 'Failed to fetch dashboard data',
            }));
        }
    },

    fetchLogs: async () => {
        set((state) => ({
            sectionLoading: { ...state.sectionLoading, logs: true },
            sectionError: { ...state.sectionError, logs: null },
        }));

        try {
            const { data } = await axios.get(`${API_BASE_URL}/activity_logs`);
            set((state) => ({
                logs: data,
                sectionLoading: { ...state.sectionLoading, logs: false },
            }));
        } catch {
            set((state) => ({
                sectionLoading: { ...state.sectionLoading, logs: false },
                sectionError: { ...state.sectionError, logs: 'Failed to load activity logs.' },
                error: state.error ?? 'Failed to fetch dashboard data',
            }));
        }
    },

    addComponent: async (component) => {
        set((state) => ({
            loading: true,
            mutationLoading: { ...state.mutationLoading, addComponent: true },
            mutationError: { ...state.mutationError, addComponent: null },
        }));

        const newComponent = {
            ...component,
            status: 'published' as const,
            userId: '1', // Hardcoded admin for now
            createdAt: new Date().toISOString(),
        };

        try {
            await axios.post(`${API_BASE_URL}/components`, newComponent);
            await get().addLog({
                userId: '1',
                action: 'ADD_COMPONENT',
                details: `Added component: ${component.title}`,
            });
            await get().fetchComponents();
            set((state) => ({
                loading: false,
                mutationLoading: { ...state.mutationLoading, addComponent: false },
                error: null,
            }));
        } catch {
            set((state) => ({
                loading: false,
                error: 'Failed to add component',
                mutationLoading: { ...state.mutationLoading, addComponent: false },
                mutationError: { ...state.mutationError, addComponent: 'Failed to add component.' },
            }));
            throw new Error('Failed to add component');
        }
    },

    submitRequest: async (request) => {
        set((state) => ({
            mutationLoading: { ...state.mutationLoading, submitRequest: true },
            mutationError: { ...state.mutationError, submitRequest: null },
        }));

        const newRequest = {
            request_id: `REQ-${Date.now()}`,
            category: request.category,
            component_name: request.component_name,
            description: request.description,
            username: request.username,
            createdAt: new Date().toISOString(),
            status: 'pending' as const,
        };

        try {
            const { data } = await axios.get(`${API_BASE_URL}/component_requests`);
            if (Array.isArray(data)) {
                await axios.post(`${API_BASE_URL}/component_requests`, newRequest);
            } else {
                const existingRequests = normalizeRequests(data);
                const requestRecord = {
                    ...toRequestRecord(existingRequests),
                    [newRequest.request_id]: newRequest,
                };
                await axios.put(`${API_BASE_URL}/component_requests`, requestRecord);
            }
            await get().fetchRequests();
            set((state) => ({
                mutationLoading: { ...state.mutationLoading, submitRequest: false },
            }));
        } catch {
            set((state) => ({
                error: 'Failed to submit request',
                mutationLoading: { ...state.mutationLoading, submitRequest: false },
                mutationError: { ...state.mutationError, submitRequest: 'Failed to submit request.' },
            }));
            throw new Error('Failed to submit request');
        }
    },

    updateRequestStatus: async (requestId, status) => {
        set((state) => ({
            mutationLoading: { ...state.mutationLoading, updateRequestStatus: true },
            mutationError: { ...state.mutationError, updateRequestStatus: null },
        }));

        try {
            const request = get().requests.find((r) => r.request_id === requestId);
            if (!request) {
                set((state) => ({
                    mutationLoading: { ...state.mutationLoading, updateRequestStatus: false },
                }));
                return;
            }
            const { data } = await axios.get(`${API_BASE_URL}/component_requests`);
            if (Array.isArray(data)) {
                const requestFromArray = (data as Array<ComponentRequest & { id?: string }>).find(
                    (item) => item.request_id === requestId,
                );
                if (!requestFromArray) {
                    set((state) => ({
                        mutationLoading: { ...state.mutationLoading, updateRequestStatus: false },
                    }));
                    return;
                }
                const dbRecordId = requestFromArray.id ?? requestFromArray.request_id;
                await axios.patch(`${API_BASE_URL}/component_requests/${dbRecordId}`, { status });
            } else {
                const existingRequests = normalizeRequests(data);
                const requestRecord = toRequestRecord(existingRequests);
                if (!requestRecord[requestId]) {
                    set((state) => ({
                        mutationLoading: { ...state.mutationLoading, updateRequestStatus: false },
                    }));
                    return;
                }
                requestRecord[requestId] = { ...requestRecord[requestId], status };
                await axios.put(`${API_BASE_URL}/component_requests`, requestRecord);
            }

            await get().addLog({
                userId: '1',
                action: `REQUEST_${status.toUpperCase()}`,
                details: `${status === 'approved' ? 'Approved' : 'Rejected'} request: ${request.component_name}`,
            });

            if (status === 'approved') {
                await axios.post(`${API_BASE_URL}/components`, {
                    id: `comp-${request.request_id}`,
                    title: request.component_name,
                    description: request.description,
                    category: normalizeCategory(request.category),
                    status: 'pending',
                    componentCode: '// TODO: Implement requested component',
                    usageCode: '// TODO: Add usage example',
                    cssCode: '',
                    userId: '1',
                    createdAt: new Date().toISOString(),
                });

                await get().addLog({
                    userId: '1',
                    action: 'ADD_COMPONENT',
                    details: `Added component from request: ${request.component_name}`,
                });

                await get().fetchComponents();
            }

            await get().fetchRequests();
            set((state) => ({
                mutationLoading: { ...state.mutationLoading, updateRequestStatus: false },
            }));
        } catch {
            set((state) => ({
                error: 'Failed to update request status',
                mutationLoading: { ...state.mutationLoading, updateRequestStatus: false },
                mutationError: { ...state.mutationError, updateRequestStatus: 'Failed to update request status.' },
            }));
            throw new Error('Failed to update request status');
        }
    },

    deleteComponent: async (id) => {
        set((state) => ({
            mutationLoading: { ...state.mutationLoading, deleteComponent: true },
            mutationError: { ...state.mutationError, deleteComponent: null },
        }));

        try {
            const existingComponent = get().components.find((component) => component.id === id);

            await axios.delete(`${API_BASE_URL}/components/${id}`);

            await get().addLog({
                userId: '1',
                action: 'DELETE_COMPONENT',
                details: `Deleted component: ${existingComponent?.title ?? id}`,
            });

            await get().fetchComponents();

            set((state) => ({
                mutationLoading: { ...state.mutationLoading, deleteComponent: false },
            }));
        } catch {
            set((state) => ({
                error: 'Failed to delete component',
                mutationLoading: { ...state.mutationLoading, deleteComponent: false },
                mutationError: { ...state.mutationError, deleteComponent: 'Failed to delete component.' },
            }));
            throw new Error('Failed to delete component');
        }
    },

    addLog: async (log) => {
        const newLog = {
            ...log,
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
        try {
            await axios.post(`${API_BASE_URL}/activity_logs`, newLog);
            await get().fetchLogs();
        } catch { }
    },
}));
