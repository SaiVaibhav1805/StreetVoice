const statusConfig = {
    reported: { label: 'Reported', bg: '#fef3c7', color: '#d97706' },
    verified: { label: 'Verified', bg: '#dbeafe', color: '#2563eb' },
    assigned: { label: 'Assigned', bg: '#f3e8ff', color: '#7c3aed' },
    in_progress: { label: 'In Progress', bg: '#ffedd5', color: '#ea580c' },
    resolved: { label: 'Resolved', bg: '#dcfce7', color: '#16a34a' },
}

export default function IssueStatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.reported
    return (
        <span style={{
            padding: '0.25rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: config.bg,
            color: config.color
        }}>
            {config.label}
        </span>
    )
}