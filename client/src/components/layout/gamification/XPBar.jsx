export default function XPBar({ xp }) {
    const level = Math.floor(xp / 100) + 1
    const progress = xp % 100
    const nextLevelXP = level * 100

    return (
        <div style={styles.container}>
            <div style={styles.topRow}>
                <span style={styles.level}>Level {level}</span>
                <span style={styles.xpText}>{xp} XP</span>
            </div>
            <div style={styles.barBg}>
                <div style={{ ...styles.barFill, width: `${progress}%` }} />
            </div>
            <p style={styles.next}>{100 - progress} XP to Level {level + 1}</p>
        </div>
    )
}

const styles = {
    container: { width: '100%' },
    topRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' },
    level: { fontWeight: '700', fontSize: '0.9rem', color: '#2563eb' },
    xpText: { fontWeight: '600', fontSize: '0.9rem', color: '#f59e0b' },
    barBg: { height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' },
    barFill: { height: '100%', background: 'linear-gradient(90deg, #2563eb, #7c3aed)', borderRadius: '4px', transition: 'width 0.5s ease' },
    next: { margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#94a3b8' }
}