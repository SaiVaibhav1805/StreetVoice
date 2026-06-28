import { formatDate } from '../../../utils/formatters'

const stepConfig = [
    { status: 'reported', label: 'Issue Reported', icon: '📍' },
    { status: 'verified', label: 'Community Verified', icon: '✅' },
    { status: 'assigned', label: 'Assigned to Team', icon: '👷' },
    { status: 'in_progress', label: 'Work In Progress', icon: '🔧' },
    { status: 'resolved', label: 'Issue Resolved', icon: '🎉' },
]

const statusOrder = ['reported', 'verified', 'assigned', 'in_progress', 'resolved']

export default function IssueTimeline({ currentStatus, createdAt, resolvedAt }) {
    const currentIndex = statusOrder.indexOf(currentStatus)

    return (
        <div style={styles.container}>
            {stepConfig.map((step, index) => {
                const done = index <= currentIndex
                const current = index === currentIndex
                return (
                    <div key={step.status} style={styles.row}>
                        {/* Line */}
                        <div style={styles.lineCol}>
                            <div style={{
                                ...styles.dot,
                                background: done ? '#2563eb' : '#e2e8f0',
                                border: current ? '3px solid #93c5fd' : 'none',
                                transform: current ? 'scale(1.2)' : 'scale(1)'
                            }}>
                                {done && <span style={{ fontSize: '0.6rem' }}>✓</span>}
                            </div>
                            {index < stepConfig.length - 1 && (
                                <div style={{
                                    ...styles.connector,
                                    background: index < currentIndex ? '#2563eb' : '#e2e8f0'
                                }} />
                            )}
                        </div>

                        {/* Content */}
                        <div style={{ ...styles.content, opacity: done ? 1 : 0.4 }}>
                            <span style={styles.icon}>{step.icon}</span>
                            <div>
                                <p style={styles.label}>{step.label}</p>
                                {current && (
                                    <p style={styles.date}>
                                        {step.status === 'reported'
                                            ? formatDate(createdAt)
                                            : step.status === 'resolved' && resolvedAt
                                                ? formatDate(resolvedAt)
                                                : 'In progress'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const styles = {
    container: { padding: '0.5rem 0' },
    row: { display: 'flex', gap: '0.75rem', minHeight: '52px' },
    lineCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' },
    dot: {
        width: '24px', height: '24px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '0.7rem', flexShrink: 0, transition: 'all 0.3s'
    },
    connector: { width: '2px', flex: 1, margin: '2px 0', transition: 'background 0.3s' },
    content: {
        display: 'flex', alignItems: 'flex-start',
        gap: '0.5rem', paddingBottom: '0.75rem', transition: 'opacity 0.3s'
    },
    icon: { fontSize: '1.1rem', marginTop: '2px' },
    label: { margin: 0, fontWeight: '600', fontSize: '0.9rem' },
    date: { margin: 0, fontSize: '0.75rem', color: '#94a3b8' }
}