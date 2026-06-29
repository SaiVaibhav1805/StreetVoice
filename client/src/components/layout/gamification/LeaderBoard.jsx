import { motion } from 'framer-motion';

const rankColors = { 
    1: '#FF9500', 
    2: '#94a3b8', 
    3: '#b45309' 
};

export default function LeaderboardRow({ user, rank, isCurrentUser }) {
    const accentColor = '#0066FF';

    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.15 }}
            style={{
                display: "grid",
                gridTemplateColumns: "36px 44px 1fr auto",
                alignItems: "center",
                gap: 12,
                borderRadius: 16,
                padding: "10px 14px",
                marginBottom: 10,
                background: isCurrentUser ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                border: isCurrentUser ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.7)',
                boxShadow: isCurrentUser 
                    ? '0 8px 24px rgba(0, 102, 255, 0.15)' 
                    : '6px 6px 14px rgba(15, 23, 42, 0.1), -6px -6px 14px rgba(255, 255, 255, 0.96)',
                cursor: 'pointer',
                boxSizing: 'border-box'
            }}
        >
            {/* Rank badge */}
            <div style={{
                color: rankColors[rank] || '#64748b',
                fontSize: rank <= 3 ? '1.4rem' : '0.95rem',
                fontWeight: '900',
                textAlign: 'center'
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
                    <span>✓ {user.issuesVerified || 0} Verified</span>
                </div>
            </div>

            {/* Contributions points */}
            <div style={styles.xpBlock}>
                <p style={{ ...styles.xp, color: accentColor }}>{user.xp || 0} pts</p>
                <span style={styles.badgeCount}>
                    🏅 {user.badges?.length || 0} Badges
                </span>
            </div>
        </motion.div>
    );
}

const styles = {
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
        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.18)'
    },
    name: { 
        margin: 0, 
        fontWeight: '700', 
        fontSize: '0.95rem',
        color: '#0f172a',
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
        color: '#64748b',
        fontWeight: '600'
    },
    stats: { 
        display: 'flex', 
        gap: '0.5rem', 
        marginTop: '0.35rem', 
        fontSize: '0.78rem', 
        color: '#94a3b8',
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
        fontWeight: '800', 
        fontSize: '1.1rem',
        fontFamily: 'Clash Display, Satoshi, sans-serif'
    },
    badgeCount: { 
        display: 'inline-block',
        marginTop: '0.25rem', 
        fontSize: '0.72rem', 
        color: '#8b5cf6',
        fontWeight: '850'
    }
};