import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import XPBar from '../components/layout/gamification/XPBar';
import BadgeGrid from '../components/layout/gamification/BadgeGrid';
import IssueStatusBadge from '../components/layout/issue/IssueStatusBadge';
import { formatDistanceToNow } from '../utils/formatters';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [myIssues, setMyIssues] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [ward, setWard] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        fetchProfile();
        
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile(res.data.user);
            setMyIssues(res.data.myIssues);
            setBadges(res.data.user.badges || []);
            setName(res.data.user.name || '');
            setWard(res.data.user.ward || '');
        } catch {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put('/auth/profile', { name, ward });
            toast.success('Profile updated!');
            setEditing(false);
            fetchProfile();
        } catch {
            toast.error('Update failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return (
        <div style={styles.centered}><p>Loading profile...</p></div>
    );

    const profileCardElement = (
        <div style={styles.profileCard}>
            <div style={styles.avatarLarge}>
                {profile?.name?.[0]?.toUpperCase() || '?'}
            </div>

            {editing ? (
                <div style={styles.editForm}>
                    <input
                        style={styles.input}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                    />
                    <input
                        style={styles.input}
                        value={ward}
                        onChange={e => setWard(e.target.value)}
                        placeholder="Ward / Area"
                    />
                    <div style={styles.editBtns}>
                        <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                        <button style={styles.saveBtn} onClick={handleSave}>Save</button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 style={styles.profileName}>{profile?.name || 'No name set'}</h3>
                    <p style={styles.profileWard}>📍 {profile?.ward || 'No ward set'}</p>
                    <p style={styles.profilePhone}>{profile?.phone}</p>
                    <button style={styles.editBtn} onClick={() => setEditing(true)}>
                        <Edit2 size={12} style={{ marginRight: 4 }} /> Edit Profile
                    </button>
                </>
            )}
        </div>
    );

    const achievementsElement = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={styles.section}>
                <XPBar xp={profile?.xp || 0} />
            </div>
            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>My Badges</h4>
                <BadgeGrid earnedBadges={badges} />
            </div>
        </div>
    );

    const reportsElement = (
        <div style={styles.section}>
            <h4 style={styles.sectionTitle}>My Reports ({myIssues.length})</h4>
            {myIssues.length === 0 ? (
                <p style={styles.empty}>No issues reported yet</p>
            ) : (
                myIssues.map(issue => (
                    <div
                        key={issue._id}
                        style={styles.issueRow}
                        onClick={() => navigate(`/issue/${issue._id}`)}
                    >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                            <p style={styles.issueTitle}>{issue.title}</p>
                            <p style={styles.issueMeta}>
                                {issue.category?.replace('_', ' ')} • {formatDistanceToNow(issue.createdAt)}
                            </p>
                        </div>
                        <IssueStatusBadge status={issue.status} />
                    </div>
                ))
            )}
        </div>
    );

    return (
        <ResponsiveLayout>
            {isMobile ? (
                // Mobile layout
                <div style={{ paddingBottom: '20px' }}>
                    <div style={styles.header}>
                        <h2 style={styles.title}>My Profile</h2>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            <LogOut size={18} color="#ef4444" />
                        </button>
                    </div>

                    <div style={styles.mobileCardWrapper}>
                        {profileCardElement}
                    </div>

                    {/* Stats */}
                    <div style={styles.statsRow}>
                        {[
                            { label: 'Reported', value: profile?.issuesReported || 0, icon: '📋' },
                            { label: 'Verified', value: profile?.issuesVerified || 0, icon: '✅' },
                            { label: 'Badges', value: badges.length, icon: '🏅' },
                            { label: 'Total XP', value: profile?.xp || 0, icon: '⭐' },
                        ].map(s => (
                            <div key={s.label} style={styles.statCard}>
                                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                                <p style={styles.statValue}>{s.value}</p>
                                <p style={styles.statLabel}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {achievementsElement}
                    {reportsElement}
                </div>
            ) : (
                // Desktop full-page responsive website layout
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', padding: '0.5rem 0' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
                                My Reports Dashboard
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                Track your submitted cases, achievements, and contributor ranking
                            </p>
                        </div>
                    </div>

                    {/* Content Columns split */}
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                        {/* Left Column: Avatar details, stats, badges */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Card wrapper */}
                            <div style={{ background: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-flat)' }}>
                                {profileCardElement}
                            </div>

                            {/* Stats grids */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                {[
                                    { label: 'Reported', value: profile?.issuesReported || 0, icon: '📋' },
                                    { label: 'Verified', value: profile?.issuesVerified || 0, icon: '✅' },
                                    { label: 'Badges', value: badges.length, icon: '🏅' },
                                    { label: 'Total XP', value: profile?.xp || 0, icon: '⭐' },
                                ].map(s => (
                                    <div key={s.label} style={{ ...styles.statCard, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', padding: '1.25rem 0.5rem', boxShadow: 'var(--shadow-flat)' }}>
                                        <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                                        <p style={styles.statValue}>{s.value}</p>
                                        <p style={styles.statLabel}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Badges and XP */}
                            <div style={{ background: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-flat)' }}>
                                {achievementsElement}
                            </div>
                        </div>

                        {/* Right Column: Reports */}
                        <div style={{ flex: 1.5, background: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-flat)' }}>
                            {reportsElement}
                        </div>
                    </div>
                </div>
            )}
        </ResponsiveLayout>
    );
}

const styles = {
    centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fff', borderBottom: '1px solid #eee' },
    title: { margin: 0, fontSize: '1.1rem', fontWeight: '700' },
    logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' },
    mobileCardWrapper: { background: '#fff', padding: '1.5rem', borderBottom: '1px solid #eee', marginBottom: '1rem' },
    profileCard: { textAlign: 'center' },
    avatarLarge: { width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2.2rem', margin: '0 auto 1rem', boxShadow: '0 4px 15px rgba(0, 102, 255, 0.2)' },
    profileName: { margin: '0 0 0.25rem', fontSize: '1.35rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.01em' },
    profileWard: { margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#64748b', fontWeight: '700' },
    profilePhone: { margin: '0 0 1rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' },
    editBtn: { display: 'inline-flex', alignItems: 'center', justifySelf: 'center', padding: '0.5rem 1.25rem', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800', color: '#475569', boxShadow: 'var(--shadow-flat)' },
    editForm: { display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' },
    input: { padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', background: '#f8fafc', outline: 'none' },
    editBtns: { display: 'flex', gap: '0.5rem' },
    cancelBtn: { flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: '700', color: '#64748b' },
    saveBtn: { flex: 1, padding: '0.65rem', borderRadius: '12px', border: 'none', background: '#0066FF', color: '#fff', cursor: 'pointer', fontWeight: '700' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', borderBottom: '1px solid #eee', marginBottom: '1rem' },
    statCard: { background: '#fff', padding: '1rem 0.5rem', textAlign: 'center' },
    statValue: { margin: '0.35rem 0 0.1rem', fontSize: '1.35rem', fontWeight: '950', color: '#1e293b' },
    statLabel: { margin: 0, fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em' },
    section: { background: 'none', padding: '0.5rem 0' },
    sectionTitle: { margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', letterSpacing: '-0.01em' },
    empty: { color: '#94a3b8', fontSize: '0.88rem', padding: '1.5rem 0' },
    issueRow: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' },
    issueTitle: { margin: 0, fontWeight: '750', fontSize: '0.92rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    issueMeta: { margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b', textTransform: 'capitalize' }
};