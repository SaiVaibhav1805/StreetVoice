import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

const CATEGORY_COLORS = {
    pothole: '#ef4444',
    water_leakage: '#0066FF',
    streetlight: '#FF9500',
    garbage: '#22C55E',
    sewage: '#8b5cf6',
    road_damage: '#f97316',
    encroachment: '#ec4899',
    other: '#94a3b8'
};

const STATUS_COLORS = {
    reported: '#FF9500',
    verified: '#0066FF',
    assigned: '#8b5cf6',
    in_progress: '#FF9500',
    resolved: '#22C55E'
};

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview'); // overview | trends | wards
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        fetchDashboard();
        
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard');
            setData(res.data.dashboard);
        } catch {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={styles.centered}>
            <p style={{ fontSize: '2.5rem' }}>📊</p>
            <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>Loading dashboard...</p>
        </div>
    );

    if (!data) return (
        <div style={styles.centered}>
            <p>No dashboard statistics available at this time.</p>
        </div>
    );

    const { summary, statusBreakdown, categoryBreakdown, severityBreakdown,
        topWards, topReporters, recentResolved, dailyTrend } = data;

    const pieData = categoryBreakdown.map(c => ({
        name: c._id?.replace('_', ' ') || 'other',
        value: c.count,
        color: CATEGORY_COLORS[c._id] || '#94a3b8'
    }));

    const statusData = statusBreakdown.map(s => ({
        name: s._id?.replace('_', ' '),
        value: s.count,
        color: STATUS_COLORS[s._id] || '#94a3b8'
    }));

    const trendData = dailyTrend.map(d => ({
        date: d._id?.slice(5), // MM-DD
        issues: d.count
    }));

    return (
        <ResponsiveLayout>
            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.headerTitle}>📊 Impact Dashboard</h2>
                        <p style={styles.headerSub}>Real-time public accountability stats & community resolution trends</p>
                    </div>
                </div>

                {/* Tab Selector pills */}
                <div style={styles.tabs}>
                    {['overview', 'trends', 'wards'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                ...styles.tab,
                                background: tab === t ? '#0066FF' : '#fff',
                                color: tab === t ? '#fff' : '#64748b',
                                boxShadow: tab === t ? 'none' : 'var(--shadow-flat)'
                            }}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                <div style={styles.body}>

                    {/* Overview Tab */}
                    {tab === 'overview' && (
                        <>
                            {/* Summary cards in top row */}
                            <div style={{
                                ...styles.gridCards,
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)'
                            }}>
                                {[
                                    { icon: '📋', label: 'Total Issues', value: summary.totalIssues, color: '#0066FF' },
                                    { icon: '✅', label: 'Resolved', value: summary.resolvedIssues, color: '#22C55E' },
                                    { icon: '📅', label: 'This Month', value: summary.thisMonthIssues, color: '#FF9500' },
                                    { icon: '📈', label: 'Resolution Rate', value: `${summary.resolutionRate}%`, color: '#0066FF' },
                                    { icon: '⏱️', label: 'Avg Resolution', value: `${summary.avgResolutionHours}h`, color: '#0066FF' },
                                    { icon: '🗓️', label: 'Monthly Resolved', value: summary.thisMonthResolved, color: '#22C55E' },
                                ].map(s => (
                                    <div key={s.label} style={styles.summaryCard}>
                                        <span style={styles.summaryIcon}>{s.icon}</span>
                                        <p style={{ ...styles.summaryValue, color: s.color }}>{s.value}</p>
                                        <p style={styles.summaryLabel}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Main split following CivicFix layout */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1.2fr',
                                gap: '2rem',
                                marginTop: '1.5rem'
                            }}>
                                {/* Left Section: Stats & Category list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={styles.chartCard}>
                                        <h4 style={styles.chartTitle}>Issues by Category</h4>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={categoryBreakdown.map(c => ({
                                                name: c._id?.replace('_', ' ') || 'other',
                                                count: c.count
                                            }))}>
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: '700' }} />
                                                <YAxis tick={{ fontSize: 10, fontWeight: '700' }} />
                                                <Tooltip />
                                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                                    {categoryBreakdown.map((c, i) => (
                                                        <Cell key={i} fill={CATEGORY_COLORS[c._id] || '#94a3b8'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Issues by status pie chart */}
                                    <div style={styles.chartCard}>
                                        <h4 style={styles.chartTitle}>Issues by Status</h4>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%" cy="50%"
                                                    innerRadius={50} outerRadius={75}
                                                    dataKey="value"
                                                    label={({ name, value }) => `${name}: ${value}`}
                                                    labelLine={false}
                                                >
                                                    {statusData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Right Section: Mockup "Live Impact" panel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={styles.liveImpactCard}>
                                        <span style={styles.liveLabel}>Live impact</span>
                                        <h3 style={styles.liveValue}>{summary.resolutionRate}%</h3>
                                        <p style={styles.liveSub}>Wards target resolution met</p>

                                        {/* Progress bar */}
                                        <div style={styles.progressContainer}>
                                            <div style={{ ...styles.progressBar, width: `${summary.resolutionRate}%` }} />
                                        </div>
                                        <div style={styles.progressLabels}>
                                            <span>0% Resolved</span>
                                            <span>100% Target</span>
                                        </div>

                                        {/* Simple vertical bar graph of reports vs resolutions inside card */}
                                        <div style={{ marginTop: '1.5rem', height: '120px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={[
                                                    { name: 'Pothole', count: summary.totalIssues },
                                                    { name: 'Fixed', count: summary.resolvedIssues }
                                                ]}>
                                                    <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: '700' }} />
                                                    <Tooltip />
                                                    <Bar dataKey="count" fill="#0066FF" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Mini Leaderboard list */}
                                    <div style={styles.miniLeaderboardCard}>
                                        <h4 style={styles.chartTitle}>Top Contributors</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            {topReporters.slice(0, 3).map((u, i) => (
                                                <div key={u._id} style={styles.miniRow}>
                                                    <div style={styles.miniAvatar}>{u.name?.[0]}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={styles.miniName}>{u.name || 'Anonymous'}</p>
                                                        <p style={styles.miniSub}>{u.ward || 'No ward'}</p>
                                                    </div>
                                                    <span style={styles.miniXP}>{u.xp} XP</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recently resolved list */}
                            <div style={{ ...styles.chartCard, marginTop: '1.5rem' }}>
                                <h4 style={styles.chartTitle}>Recently Resolved Wards 🎉</h4>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                                    gap: '1rem'
                                }}>
                                    {recentResolved.length === 0 ? (
                                        <p style={styles.empty}>No resolved issues yet</p>
                                    ) : (
                                        recentResolved.map(i => (
                                            <div key={i._id} style={styles.resolvedRow}>
                                                <span style={styles.resolvedDot}>✅</span>
                                                <div>
                                                    <p style={styles.resolvedTitle}>{i.title}</p>
                                                    <p style={styles.resolvedMeta}>
                                                        {i.category?.replace('_', ' ')} • {i.location?.ward || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Trends Tab */}
                    {tab === 'trends' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1.2fr',
                            gap: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={styles.chartCard}>
                                    <h4 style={styles.chartTitle}>Issues Reported — Last 7 Days</h4>
                                    {trendData.length === 0 ? (
                                        <p style={styles.empty}>Not enough data yet</p>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={230}>
                                            <LineChart data={trendData}>
                                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                                <Tooltip />
                                                <Line
                                                    type="monotone" dataKey="issues"
                                                    stroke="#0066FF" strokeWidth={3}
                                                    dot={{ fill: '#0066FF', r: 5 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>

                                <div style={styles.chartCard}>
                                    <h4 style={styles.chartTitle}>Severity Distribution</h4>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={severityBreakdown.map(s => ({
                                            name: s._id,
                                            count: s.count
                                        }))}>
                                            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: '700' }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {severityBreakdown.map((s, i) => (
                                                    <Cell key={i} fill={
                                                        s._id === 'critical' ? '#ef4444' :
                                                            s._id === 'high' ? '#FF9500' :
                                                                s._id === 'medium' ? '#eab308' : '#22C55E'
                                                    } />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={styles.chartCard}>
                                <h4 style={styles.chartTitle}>Category Distribution</h4>
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%" cy="40%"
                                            outerRadius={90}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [value, name]} />
                                        <Legend iconSize={10} wrapperStyle={{ fontSize: '0.8rem', marginTop: '20px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Wards Tab */}
                    {tab === 'wards' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1.5fr',
                            gap: '1.5rem'
                        }}>
                            <div style={styles.chartCard}>
                                <h4 style={styles.chartTitle}>Top Wards by Issue Count</h4>
                                {topWards.length === 0 ? (
                                    <p style={styles.empty}>No ward data yet</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart
                                            data={topWards.map(w => ({ name: w._id || 'Unknown', count: w.count }))}
                                            layout="vertical"
                                        >
                                            <XAxis type="number" tick={{ fontSize: 11 }} />
                                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: '700' }} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#0066FF" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            <div style={styles.chartCard}>
                                <h4 style={styles.chartTitle}>🏆 Top Contributors</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {topReporters.map((u, i) => (
                                        <div key={u._id} style={styles.reporterRow}>
                                            <span style={styles.rank}>#{i + 1}</span>
                                            <div style={styles.reporterAvatar}>
                                                {u.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={styles.reporterName}>{u.name || 'Anonymous'}</p>
                                                <p style={styles.reporterMeta}>{u.ward || 'No ward'}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={styles.reporterXP}>⭐ {u.xp} XP</p>
                                                <p style={styles.reporterCount}>{u.issuesReported} issues</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}

const styles = {
    container: { width: '100%' },
    centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#94a3b8' },
    header: { padding: '1rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    headerTitle: { margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' },
    headerSub: { margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#64748b' },
    tabs: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
    tab: { padding: '0.55rem 1.4rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem', transition: 'all 0.2s' },
    body: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    gridCards: { display: 'grid', gap: '1.25rem' },
    summaryCard: { background: '#fff', borderRadius: '20px', padding: '1.5rem 1rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-flat)' },
    summaryIcon: { fontSize: '1.75rem' },
    summaryValue: { margin: '0.5rem 0 0.1rem', fontSize: '1.65rem', fontWeight: '900' },
    summaryLabel: { margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.03em' },
    chartCard: { background: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-flat)' },
    chartTitle: { margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.01em' },
    empty: { color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' },
    resolvedRow: { display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' },
    resolvedDot: { fontSize: '1.2rem', flexShrink: 0 },
    resolvedTitle: { margin: 0, fontWeight: '800', fontSize: '0.92rem', color: '#1e293b' },
    resolvedMeta: { margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b', textTransform: 'capitalize' },
    reporterRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' },
    rank: { fontWeight: '900', color: '#0066FF', fontSize: '0.9rem', width: '24px' },
    reporterAvatar: { width: '38px', height: '38px', borderRadius: '50%', background: '#0066FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem', flexShrink: 0 },
    reporterName: { margin: 0, fontWeight: '800', fontSize: '0.9rem', color: '#1e293b' },
    reporterMeta: { margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#64748b' },
    reporterXP: { margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#FF9500' },
    reporterCount: { margin: '0.1rem 0 0', fontSize: '0.72rem', color: '#64748b', fontWeight: '700' },
    
    /* Live Impact Card Styling matching CivicFix */
    liveImpactCard: {
        background: '#fff',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-flat)',
        padding: '2rem 1.5rem',
        textAlign: 'left'
    },
    liveLabel: {
        fontSize: '0.85rem',
        fontWeight: '800',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    liveValue: {
        fontSize: '2.5rem',
        fontWeight: '950',
        color: '#0f172a',
        margin: '0.25rem 0 0.1rem',
        letterSpacing: '-0.03em'
    },
    liveSub: {
        fontSize: '0.85rem',
        color: '#64748b',
        fontWeight: '600',
        margin: '0 0 1.25rem'
    },
    progressContainer: {
        height: '10px',
        borderRadius: '5px',
        background: '#e2e8f0',
        overflow: 'hidden',
        marginBottom: '0.5rem'
    },
    progressBar: {
        height: '100%',
        borderRadius: '5px',
        background: 'linear-gradient(to right, #0066FF, #00ccff)'
    },
    progressLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#94a3b8'
    },
    miniLeaderboardCard: {
        background: '#fff',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-flat)',
        padding: '1.5rem'
    },
    miniRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0',
        borderBottom: '1px solid #f1f5f9'
    },
    miniAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#0066FF',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '0.85rem'
    },
    miniName: {
        margin: 0,
        fontWeight: '800',
        fontSize: '0.85rem',
        color: '#1e293b'
    },
    miniSub: {
        margin: 0,
        fontSize: '0.72rem',
        color: '#94a3b8'
    },
    miniXP: {
        fontSize: '0.8rem',
        fontWeight: '850',
        color: '#FF9500'
    }
};