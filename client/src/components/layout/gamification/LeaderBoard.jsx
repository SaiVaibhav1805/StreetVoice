import BadgeGrid from './BadgeGrid';

const rankColors = { 
    1: '#FF9500', 
    2: '#94a3b8', 
    3: '#b45309' 
};

export default function LeaderboardRow({ user, rank, isCurrentUser }) {
    return (
        <div style={{
            ...styles.row,
            background: isCurrentUser ? '#fff' : '#f8fafc',
            border: isCurrentUser ? '2px solid #0066FF' : '1px solid #e2e8f0',
            boxShadow: isCurrentUser ? 'var(--shadow-flat)' : 'none'
        }}>
            {/* Rank badge */}
            <div style={{
                ...styles.rank,
                color: rankColors[rank] || '#64748b',
                fontSize: rank <= 3 ? '1.4rem' : '0.95rem',
                fontWeight: '900'
            }}>
                {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
            </div>

            {/* User Profile Avatar */}
            <div style={styles.avatar}>
                {user.name?.[0]?.toUpperCase() || '?'}
            </div>

            {/* Info details */}
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={styles.name}>
                    {user.name || 'Anonymous'}
                    {isCurrentUser && <span style={styles.youTag}>You</span>}
                </p>
                <p style={styles.ward}>📍 {user.ward || 'General Citizen'}</p>
                <div style={styles.stats}>
                    <span>📋 {user.issuesReported || 0} Reports</span>
                    <span style={styles.dot}>•</span>
                    <span>✓ {user.issuesVerified || 0} Verifications</span>
                </div>
            </div>

            {/* Contributions points */}
            <div style={styles.xpBlock}>
                <p style={styles.xp}>⭐ {user.xp || 0}</p>
                <p style={styles.xpLabel}>Points</p>
                <span style={styles.badgeCount}>
                    🏅 {user.badges?.length || 0} Badges
                </span>
            </div>
        </div>
    );
}

const styles = {
    row: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '1rem 1.25rem', 
        borderRadius: '16px', 
        marginBottom: '0.25rem',
        transition: 'transform 0.15s ease'
    },
    rank: { 
        width: '36px', 
        textAlign: 'center', 
        flexShrink: 0 
    },
    avatar: { 
        width: '44px', 
        height: '44px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: '800', 
        fontSize: '1.15rem', 
        flexShrink: 0,
        boxShadow: '0 3px 8px rgba(0, 102, 255, 0.15)'
    },
    name: { 
        margin: 0, 
        fontWeight: '800', 
        fontSize: '0.95rem',
        color: '#1e293b',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem'
    },
    youTag: { 
        fontSize: '0.65rem', 
        color: '#fff', 
        background: '#0066FF',
        padding: '0.15rem 0.5rem',
        borderRadius: '10px',
        fontWeight: '800', 
        textTransform: 'uppercase'
    },
    ward: { 
        margin: '0.15rem 0 0', 
        fontSize: '0.75rem', 
        color: '#94a3b8',
        fontWeight: '700'
    },
    stats: { 
        display: 'flex', 
        gap: '0.5rem', 
        marginTop: '0.35rem', 
        fontSize: '0.78rem', 
        color: '#64748b',
        fontWeight: '600'
    },
    dot: {
        color: '#cbd5e1'
    },
    xpBlock: { 
        textAlign: 'right', 
        flexShrink: 0 
    },
    xp: { 
        margin: 0, 
        fontWeight: '900', 
        color: '#FF9500', 
        fontSize: '1.1rem' 
    },
    xpLabel: { 
        margin: 0, 
        fontSize: '0.68rem', 
        color: '#94a3b8',
        fontWeight: '700',
        textTransform: 'uppercase'
    },
    badgeCount: { 
        display: 'inline-block',
        marginTop: '0.25rem', 
        fontSize: '0.72rem', 
        color: '#8b5cf6',
        fontWeight: '850'
    }
};