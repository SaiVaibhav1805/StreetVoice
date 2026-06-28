const ALL_BADGES = [
    { id: 'first_report', label: 'First Voice', emoji: '📣' },
    { id: 'reporter_5', label: 'Street Watcher', emoji: '👀' },
    { id: 'reporter_10', label: 'Civic Hero', emoji: '🦸' },
    { id: 'reporter_25', label: 'Community Legend', emoji: '🏆' },
    { id: 'verifier_5', label: 'Truth Seeker', emoji: '🔍' },
    { id: 'verifier_10', label: 'Ground Scout', emoji: '🧭' },
    { id: 'xp_100', label: 'Rising Star', emoji: '⭐' },
    { id: 'xp_500', label: 'Power Citizen', emoji: '💪' },
    { id: 'xp_1000', label: 'Urban Champion', emoji: '🌟' },
]

export default function BadgeGrid({ earnedBadges = [] }) {
    return (
        <div style={styles.grid}>
            {ALL_BADGES.map(badge => {
                const earned = earnedBadges.includes(badge.id)
                return (
                    <div
                        key={badge.id}
                        style={{
                            ...styles.badge,
                            opacity: earned ? 1 : 0.3,
                            background: earned ? '#fef9c3' : '#f1f5f9',
                            border: earned ? '2px solid #fbbf24' : '2px solid #e2e8f0'
                        }}
                        title={badge.label}
                    >
                        <span style={styles.emoji}>{badge.emoji}</span>
                        <p style={styles.label}>{badge.label}</p>
                        {earned && <span style={styles.earned}>✓</span>}
                    </div>
                )
            })}
        </div>
    )
}

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' },
    badge: { borderRadius: '10px', padding: '0.75rem 0.5rem', textAlign: 'center', position: 'relative' },
    emoji: { fontSize: '1.6rem' },
    label: { margin: '0.25rem 0 0', fontSize: '0.68rem', fontWeight: '600', color: '#374151', lineHeight: 1.2 },
    earned: { position: 'absolute', top: '4px', right: '6px', fontSize: '0.65rem', color: '#16a34a', fontWeight: '700' }
}