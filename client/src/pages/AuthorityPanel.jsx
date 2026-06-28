import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, CheckCircle, Clock,
    Filter, RefreshCw, ChevronRight, LogOut
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import IssueStatusBadge from '../components/layout/issue/IssueStatusBadge';
import CategoryIcon from '../components/layout/issue/CategoryIcon';
import { formatDistanceToNow } from '../utils/formatters';
import StatusUpdateModal from '../components/layout/issue/StatusUpdateModal';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['all', 'reported', 'verified', 'assigned', 'in_progress', 'resolved'];
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'];

export default function AuthorityPanel() {
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sevFilter, setSevFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('issues'); // 'issues' | 'stats'
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [statusFilter, sevFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            if (sevFilter !== 'all') params.severity = sevFilter;

            const [issueRes, statsRes] = await Promise.all([
                api.get('/authority/issues', { params }),
                api.get('/authority/stats')
            ]);
            setIssues(issueRes.data.issues);
            setStats(statsRes.data.stats);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (id) => {
        try {
            await api.post(`/authority/issues/${id}/assign`);
            toast.success('Issue assigned to you');
            fetchData();
        } catch {
            toast.error('Failed to assign issue');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filtered = issues; // API already filters based on params

    return (
        <div style={{ ...styles.container, padding: isMobile ? '0' : '1.5rem 2.5rem' }}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.headerTitle}>🏛️ Municipal Authority Panel</h2>
                    <p style={styles.headerSub}>Manage citizen reports, assign crews, and update statuses</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button onClick={fetchData} style={styles.refreshBtn} title="Refresh Data">
                        <RefreshCw size={18} color="#64748b" />
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn} title="Logout">
                        <LogOut size={18} color="#ef4444" />
                    </button>
                </div>
            </div>

            {/* Tab selector */}
            <div style={styles.tabRow}>
                <button
                    onClick={() => setActiveTab('issues')}
                    style={{
                        ...styles.tab,
                        background: activeTab === 'issues' ? '#7c3aed' : '#fff',
                        color: activeTab === 'issues' ? '#fff' : '#64748b',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    📋 Tasks Queue ({issues.length})
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    style={{
                        ...styles.tab,
                        background: activeTab === 'stats' ? '#7c3aed' : '#fff',
                        color: activeTab === 'stats' ? '#fff' : '#64748b',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    📈 Performance Stats
                </button>
            </div>

            {loading ? (
                <div style={styles.centered}><p>Loading municipal data...</p></div>
            ) : (
                <>
                    {/* Issues Tab */}
                    {activeTab === 'issues' && (
                        <>
                            {/* Filter Section */}
                            <div style={styles.filterSection}>
                                <div style={styles.filterRow}>
                                    <span style={styles.filterLabel}><Filter size={13} style={{ marginRight: 4, display: 'inline' }} />Status:</span>
                                    <div style={styles.pills}>
                                        {STATUSES.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setStatusFilter(s)}
                                                style={{
                                                    ...styles.pill,
                                                    background: statusFilter === s ? '#7c3aed' : '#f1f5f9',
                                                    color: statusFilter === s ? '#fff' : '#475569'
                                                }}
                                            >
                                                {s.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.filterRow}>
                                    <span style={styles.filterLabel}><Filter size={13} style={{ marginRight: 4, display: 'inline' }} />Severity:</span>
                                    <div style={styles.pills}>
                                        {SEVERITIES.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSevFilter(s)}
                                                style={{
                                                    ...styles.pill,
                                                    background: sevFilter === s ? '#7c3aed' : '#f1f5f9',
                                                    color: sevFilter === s ? '#fff' : '#475569'
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Issues list - Render grid on desktop, vertical list on mobile */}
                            {filtered.length === 0 ? (
                                <div style={styles.centered}>
                                    <p style={{ fontSize: '2rem' }}>🎉</p>
                                    <p>No active issues matching the filters</p>
                                </div>
                            ) : (
                                <div style={{
                                    ...styles.list,
                                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))'
                                }}>
                                    {filtered.map(issue => (
                                        <div key={issue._id} style={styles.issueCard}>
                                            <div style={styles.cardTop}>
                                                <CategoryIcon category={issue.category} size="1.2rem" />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4 style={styles.cardTitle}>{issue.title}</h4>
                                                    <p style={styles.cardMeta}>
                                                        {issue.location?.ward || 'Unknown Ward'} • {formatDistanceToNow(issue.createdAt)}
                                                    </p>
                                                </div>
                                                <IssueStatusBadge status={issue.status} />
                                            </div>

                                            <div style={styles.cardMid}>
                                                <span style={styles.reporter}>
                                                    By: {issue.reportedBy?.name || 'Anonymous'}
                                                </span>
                                                <span style={styles.verCount}>
                                                    ✓ {issue.verificationCount || 0} verifications
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div style={styles.cardActions}>
                                                {!issue.assignedTo && issue.status !== 'resolved' && (
                                                    <button
                                                        style={styles.assignBtn}
                                                        onClick={() => handleAssign(issue._id)}
                                                    >
                                                        Assign to me
                                                    </button>
                                                )}
                                                <button
                                                    style={styles.updateBtn}
                                                    onClick={() => setSelectedIssue(issue)}
                                                >
                                                    Update Status
                                                </button>
                                                <button
                                                    style={styles.viewBtn}
                                                    onClick={() => navigate(`/issue/${issue._id}`)}
                                                    title="View Details"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && stats && (
                        <div style={styles.statsContainer}>
                            {/* Summary cards */}
                            <div style={{
                                ...styles.statsGrid,
                                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)'
                            }}>
                                {[
                                    { label: 'Total', value: stats.total, color: '#2563eb', icon: '📋' },
                                    { label: 'Critical', value: stats.critical, color: '#ef4444', icon: '🚨' },
                                    { label: 'Pending', value: stats.reported, color: '#f97316', icon: '⏳' },
                                    { label: 'In Progress', value: stats.inProgress, color: '#eab308', icon: '🔧' },
                                    { label: 'Resolved', value: stats.resolved, color: '#22c55e', icon: '✅' },
                                    { label: 'Resolution %', value: `${stats.resolutionRate}%`, color: '#7c3aed', icon: '📈' },
                                ].map(s => (
                                    <div key={s.label} style={styles.statCard}>
                                        <span style={styles.statIcon}>{s.icon}</span>
                                        <p style={{ ...styles.statValue, color: s.color }}>{s.value}</p>
                                        <p style={styles.statLabel}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Split breakdown rows on desktop */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                gap: '1.5rem',
                                marginTop: '1rem'
                            }}>
                                {/* Category breakdown */}
                                <div style={styles.breakdownCard}>
                                    <h4 style={styles.breakdownTitle}>Issues by Category</h4>
                                    {stats.categoryBreakdown.map(c => (
                                        <div key={c._id} style={styles.breakdownRow}>
                                            <span style={styles.breakdownLabel}>
                                                {c._id?.replace('_', ' ') || 'other'}
                                            </span>
                                            <div style={styles.barContainer}>
                                                <div style={{
                                                    ...styles.bar,
                                                    width: `${Math.round((c.count / stats.total) * 100)}%`
                                                }} />
                                            </div>
                                            <span style={styles.breakdownCount}>{c.count}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Ward breakdown */}
                                <div style={styles.breakdownCard}>
                                    <h4 style={styles.breakdownTitle}>Top 5 Wards by Issues</h4>
                                    {stats.wardBreakdown.map((w, i) => (
                                        <div key={w._id || i} style={styles.breakdownRow}>
                                            <span style={styles.breakdownLabel}>{w._id || 'Unknown'}</span>
                                            <div style={styles.barContainer}>
                                                <div style={{
                                                    ...styles.bar,
                                                    width: `${Math.round((w.count / stats.total) * 100)}%`,
                                                    background: '#7c3aed'
                                                }} />
                                            </div>
                                            <span style={styles.breakdownCount}>{w.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Status Update Modal */}
            {selectedIssue && (
                <StatusUpdateModal
                    issue={selectedIssue}
                    onClose={() => setSelectedIssue(null)}
                    onUpdated={() => { setSelectedIssue(null); fetchData(); }}
                />
            )}
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#f8fafc', boxSizing: 'border-box' },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 1rem', background: '#fff', borderBottom: '1px solid #e2e8f0',
        borderRadius: '8px'
    },
    headerTitle: { margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' },
    headerSub: { margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' },
    refreshBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' },
    logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' },
    tabRow: {
        display: 'flex', gap: '0.5rem', padding: '1rem 0',
        borderBottom: '1px solid #e2e8f0', margin: '0.5rem 0'
    },
    tab: {
        flex: 1, padding: '0.65rem', borderRadius: '20px',
        border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem',
        transition: 'all 0.2s'
    },
    filterSection: {
        background: '#fff', padding: '1rem', borderRadius: '12px',
        border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem',
        marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
    },
    filterRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
    filterLabel: { fontSize: '0.82rem', fontWeight: '700', color: '#64748b', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.03em' },
    pills: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
    pill: {
        padding: '0.3rem 0.85rem', borderRadius: '20px', border: 'none',
        cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', transition: 'all 0.2s'
    },
    centered: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '5rem 2rem', color: '#94a3b8'
    },
    list: { display: 'grid', gap: '1rem' },
    issueCard: {
        background: '#fff', borderRadius: '16px', padding: '1.25rem',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
        display: 'flex', flexDirection: 'column', gap: '0.75rem'
    },
    cardTop: { display: 'flex', gap: '0.75rem', alignItems: 'flex-start' },
    cardTitle: { margin: 0, fontWeight: '700', fontSize: '0.95rem', lineHeight: 1.35, color: '#1e293b' },
    cardMeta: { margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: '600' },
    cardMid: {
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
        padding: '0.5rem 0'
    },
    reporter: { fontSize: '0.75rem', color: '#64748b', fontWeight: '600' },
    verCount: { fontSize: '0.75rem', color: '#10b981', marginLeft: 'auto', fontWeight: '700' },
    cardActions: { display: 'flex', gap: '0.5rem', marginTop: '0.25rem' },
    assignBtn: {
        padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid #bfdbfe',
        background: '#eff6ff', color: '#2563eb', cursor: 'pointer',
        fontSize: '0.8rem', fontWeight: '700'
    },
    updateBtn: {
        padding: '0.45rem 1rem', borderRadius: '8px', border: 'none',
        background: '#2563eb', color: '#fff', cursor: 'pointer',
        fontSize: '0.8rem', fontWeight: '700', flex: 1
    },
    viewBtn: {
        padding: '0.45rem', borderRadius: '8px', border: '1px solid #e2e8f0',
        background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center'
    },
    statsContainer: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    statsGrid: { display: 'grid', gap: '1rem' },
    statCard: {
        background: '#fff', borderRadius: '16px', padding: '1.25rem 1rem',
        textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
    },
    statIcon: { fontSize: '1.5rem' },
    statValue: { margin: '0.5rem 0 0.1rem', fontSize: '1.5rem', fontWeight: '900' },
    statLabel: { margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em' },
    breakdownCard: {
        background: '#fff', borderRadius: '16px', padding: '1.5rem',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
    },
    breakdownTitle: { margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: '800', color: '#1e293b' },
    breakdownRow: {
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        marginBottom: '0.75rem'
    },
    breakdownLabel: { fontSize: '0.85rem', color: '#475569', width: '100px', textTransform: 'capitalize', fontWeight: '700' },
    barContainer: { flex: 1, background: '#f1f5f9', borderRadius: '4px', height: '8px' },
    bar: { height: '8px', borderRadius: '4px', background: '#2563eb', transition: 'width 0.3s' },
    breakdownCount: { fontSize: '0.82rem', fontWeight: '700', color: '#334155', width: '24px', textAlign: 'right' }
};