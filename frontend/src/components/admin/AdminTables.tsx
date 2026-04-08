import { useState, type ReactNode } from 'react';
import { useComponentStore } from '../../store/componentStore';
import type { ComponentRequest } from '../../types/component';
import styles from '../../css/admin/AdminTables.module.css';

interface TableProps {
    title: string;
    description: string;
}

const TableHeader = ({ title, description }: TableProps) => (
    <>
        <h3 className={styles.tableTitle}>{title}</h3>
        <p className={styles.tableDescription}>{description}</p>
    </>
);

const TableShell = ({ children }: { children: ReactNode }) => (
    <div className={styles.tableShell}>
        <table className={styles.table}>{children}</table>
    </div>
);

const TableStateRow = ({
    colSpan,
    message,
    tone = 'neutral',
}: {
    colSpan: number;
    message: string;
    tone?: 'neutral' | 'error';
}) => (
    <tr>
        <td
            colSpan={colSpan}
            className={`${styles.stateCell} ${tone === 'error' ? styles.toneError : styles.toneNeutral}`}
        >
            {message}
        </td>
    </tr>
);

const RequestStatusBadge = ({ status }: { status: ComponentRequest['status'] }) => {
    const statusClass =
        status === 'pending'
            ? styles.statusPending
            : status === 'approved'
                ? styles.statusApproved
                : styles.statusRejected;

    return (
        <span className={`${styles.statusBadge} ${statusClass}`}>
            {status}
        </span>
    );
};

const truncateText = (value: string, maxLength = 72) =>
    value.length <= maxLength ? value : `${value.slice(0, maxLength)}...`;

export const ComponentsTable = ({ title, description }: TableProps) => {
    const {
        components,
        sectionLoading,
        sectionError,
        deleteComponent,
        mutationLoading,
        mutationError,
    } = useComponentStore();
    const [componentToDelete, setComponentToDelete] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!componentToDelete) {
            return;
        }

        try {
            await deleteComponent(componentToDelete);
            setComponentToDelete(null);
        } catch {
            // Mutation error is surfaced via store state.
        }
    };

    return (
        <div className={styles.sectionWrapper}>
            <TableHeader title={title} description={description} />

            {mutationError.deleteComponent && (
                <div className={styles.errorBanner}>
                    {mutationError.deleteComponent}
                </div>
            )}

            <TableShell>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th className={styles.headerCell}>ID</th>
                            <th className={styles.headerCell}>Title</th>
                            <th className={styles.headerCell}>Category</th>
                            <th className={styles.headerCell}>Created</th>
                            <th className={styles.headerCellRight}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {sectionLoading.components && <TableStateRow colSpan={5} message="Loading components..." />}

                        {!sectionLoading.components && sectionError.components && (
                            <TableStateRow colSpan={5} message={sectionError.components} tone="error" />
                        )}

                        {!sectionLoading.components && !sectionError.components && components.length === 0 && (
                            <TableStateRow colSpan={5} message="No components found." />
                        )}

                        {components.map((c) => (
                            <tr key={c.id} className={styles.dataRow}>
                                <td className={styles.cellId}>{c.id}</td>
                                <td className={styles.cellPrimary}>{c.title}</td>
                                <td className={styles.cellSecondary}>{c.category}</td>
                                <td className={styles.cellMuted}>
                                    {new Date(c.createdAt ?? '').toLocaleDateString()}
                                </td>
                                <td className={styles.cellActions}>
                                    <button
                                        onClick={() => setComponentToDelete(c.id)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </TableShell>

            {componentToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h4 className={styles.modalTitle}>Delete component?</h4>
                        <p className={styles.modalText}>
                            This action cannot be undone. The component will be removed from the gallery.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setComponentToDelete(null)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={mutationLoading.deleteComponent}
                                className={styles.confirmDeleteButton}
                            >
                                {mutationLoading.deleteComponent ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const UsersTable = ({ title, description }: TableProps) => {
    const { users, sectionLoading, sectionError } = useComponentStore();

    return (
        <div className={styles.sectionWrapper}>
            <TableHeader title={title} description={description} />
            <TableShell>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th className={styles.headerCell}>Name</th>
                            <th className={styles.headerCell}>Email</th>
                            <th className={styles.headerCell}>Role</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {sectionLoading.users && <TableStateRow colSpan={3} message="Loading users..." />}

                        {!sectionLoading.users && sectionError.users && (
                            <TableStateRow colSpan={3} message={sectionError.users} tone="error" />
                        )}

                        {!sectionLoading.users && !sectionError.users && users.length === 0 && (
                            <TableStateRow colSpan={3} message="No users found." />
                        )}

                        {users.map((u) => (
                            <tr key={u.id} className={styles.dataRow}>
                                <td className={styles.cellPrimary}>{u.name}</td>
                                <td className={styles.cellSecondary}>{u.email}</td>
                                <td className={styles.cellMuted}>{u.role ?? 'user'}</td>
                            </tr>
                        ))}
                    </tbody>
            </TableShell>
        </div>
    );
};

export const RequestsTable = ({ title, description }: TableProps) => {
    const {
        requests,
        updateRequestStatus,
        sectionLoading,
        sectionError,
        mutationLoading,
        mutationError,
    } = useComponentStore();

    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

    const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
        try {
            await updateRequestStatus(requestId, status);
        } catch {
            // Mutation error is surfaced via store state.
        }
    };

    const expandedRequest = expandedRequestId
        ? requests.find((request) => request.request_id === expandedRequestId)
        : null;

    const getComponentName = (request: ComponentRequest) => request.component_name;
    const getRequestUser = (request: ComponentRequest) => request.username;
    const getRequestDate = (request: ComponentRequest) => request.createdAt;
    const formatRequestDate = (request: ComponentRequest) => {
        const dateValue = getRequestDate(request);
        return dateValue ? new Date(dateValue).toLocaleDateString() : '-';
    };

    return (
        <div className={styles.sectionWrapper}>
            <TableHeader title={title} description={description} />

            {mutationError.updateRequestStatus && (
                <div className={styles.errorBanner}>
                    {mutationError.updateRequestStatus}
                </div>
            )}

            <TableShell>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th className={styles.headerCell}>Title</th>
                            <th className={styles.headerCell}>Category</th>
                            <th className={styles.headerCell}>Description</th>
                            <th className={styles.headerCell}>Requested by</th>
                            <th className={styles.headerCell}>Date submitted</th>
                            <th className={styles.headerCell}>Status</th>
                            <th className={styles.headerCellRight}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {sectionLoading.requests && <TableStateRow colSpan={7} message="Loading requests..." />}

                        {!sectionLoading.requests && sectionError.requests && (
                            <TableStateRow colSpan={7} message={sectionError.requests} tone="error" />
                        )}

                        {!sectionLoading.requests && !sectionError.requests && requests.length === 0 && (
                            <TableStateRow colSpan={7} message="No requests found." />
                        )}

                        {requests.map((r) => (
                            <tr key={r.request_id} className={styles.dataRow}>
                                <td className={styles.cellPrimary}>{getComponentName(r)}</td>
                                <td className={styles.cellSecondary}>{r.category}</td>
                                <td className={styles.cellSecondary}>{truncateText(r.description)}</td>
                                <td className={styles.cellSecondary}>
                                    {getRequestUser(r)}
                                </td>
                                <td className={styles.cellMuted}>
                                    {formatRequestDate(r)}
                                </td>
                                <td className={styles.cellStatus}>
                                    <RequestStatusBadge status={r.status} />
                                </td>
                                <td className={styles.cellActions}>
                                    <div className={styles.actionsGroup}>
                                        <button
                                            onClick={() => setExpandedRequestId(r.request_id)}
                                            className={styles.viewDetailsButton}
                                        >
                                            View Details
                                        </button>

                                        {r.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleRequestAction(r.request_id, 'approved')}
                                                    disabled={mutationLoading.updateRequestStatus}
                                                    className={styles.approveButton}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(r.request_id, 'rejected')}
                                                    disabled={mutationLoading.updateRequestStatus}
                                                    className={styles.rejectButton}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </TableShell>

            {expandedRequestId && expandedRequest && (
                <div className={styles.modalOverlay}>
                    <div className={styles.expandedModalContent}>
                        <div className={styles.expandedModalHeader}>
                            <div>
                                <h4 className={styles.expandedModalTitle}>{getComponentName(expandedRequest)}</h4>
                                <p className={styles.expandedModalMeta}>
                                    Requested by{' '}
                                    {getRequestUser(expandedRequest)}
                                </p>
                            </div>

                            <button
                                onClick={() => setExpandedRequestId(null)}
                                className={styles.closeButton}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.expandedModalBody}>
                            <p className={styles.expandedModalDescription}>
                                {expandedRequest.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ActivityTable = ({ title, description }: TableProps) => {
    const { logs, sectionLoading, sectionError } = useComponentStore();

    return (
        <div className={styles.sectionWrapper}>
            <TableHeader title={title} description={description} />
            <TableShell>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th className={styles.headerCell}>Action</th>
                            <th className={styles.headerCell}>Details</th>
                            <th className={styles.headerCell}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {sectionLoading.logs && <TableStateRow colSpan={3} message="Loading activity logs..." />}

                        {!sectionLoading.logs && sectionError.logs && (
                            <TableStateRow colSpan={3} message={sectionError.logs} tone="error" />
                        )}

                        {!sectionLoading.logs && !sectionError.logs && logs.length === 0 && (
                            <TableStateRow colSpan={3} message="No activity logs found." />
                        )}

                        {logs.map((l) => (
                            <tr key={l.id} className={styles.dataRow}>
                                <td className={styles.cellStatus}>
                                    <span className={styles.actionBadge}>
                                        {l.action.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className={styles.cellDetail}>{l.details}</td>
                                <td className={styles.cellMuted}>
                                    {new Date(l.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </TableShell>
        </div>
    );
};
