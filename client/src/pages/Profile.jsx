import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

    const accentColor = '#0066FF';
    const secondaryAccent = '#FF9500';
    const textColor = '#0f172a';

    const sharedShellStyle = {
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: `10px 10px 22px rgba(15, 23, 42, 0.14), -10px -10px 22px rgba(255, 255, 255, 0.9)`,
        border: `1px solid rgba(255,255,255,0.7)`,
    };

    const inputNeumorphic = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        fontSize: '0.95rem',
        background: '#f0f3f8',
        boxShadow: 'inset 2px 2px 5px rgba(15,23,42,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)',
        outline: 'none',
        color: '#1e293b'
    };

    const textBaseStyle = {
        color: textColor,
        fontFamily: "Satoshi, Clash Display, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    };

    const headingStyle = {
        ...textBaseStyle,
        fontSize: '1.25rem',
        fontWeight: '700',
        fontFamily: 'Clash Display, Satoshi, sans-serif'
    };

    // Calculate resolution statistics
    const totalReports = myIssues.length;
    const resolvedReports = myIssues.filter(i => i.status === 'resolved').length;
    const resolutionPercentage = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    const profileCardElement = (
        <article style={{ ...sharedShellStyle, padding: 18, boxSizing: 'border-box' }}>
            <h3 style={{ ...headingStyle, marginTop: 0 }}>
                My Profile
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={styles.avatarLarge}>
                    {profile?.name?.[0]?.toUpperCase() || '?'}
                </div>

                {editing ? (
                    <div style={styles.editForm}>
                        <input
                            style={inputNeumorphic}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your name"
                        />
                        <input
                            style={{ ...inputNeumorphic, marginTop: '6px' }}
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
                        <h4 style={{ ...textBaseStyle, fontWeight: 700, fontSize: '1.15rem', margin: '0 0 4px', fontFamily: 'Clash Display, Satoshi, sans-serif' }}>
                            {profile?.name || 'No name set'}
                        </h4>
                        <div style={{ ...textBaseStyle, opacity: 0.7, fontSize: '0.9rem', marginBottom: 12 }}>
                            {totalReports} reports • {resolvedReports} resolved
                        </div>

                        {/* Neumorphic progress bar from Framer component */}
                        <div
                            style={{
                                width: '100%',
                                marginTop: 4,
                                marginBottom: 14,
                                borderRadius: 12,
                                overflow: "hidden",
                                background: "rgba(15, 23, 42, 0.08)",
                                height: 10
                            }}
                        >
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: `${resolutionPercentage || 72}%` }}
                                transition={{ duration: 1.2 }}
                                style={{ height: 10, background: accentColor }}
                            />
                        </div>

                        <p style={styles.profileWard}>📍 {profile?.ward || 'No ward set'}</p>
                        <p style={styles.profilePhone}>{profile?.phone}</p>
                        <button style={styles.editBtn} onClick={() => setEditing(true)}>
                            <Edit2 size={12} style={{ marginRight: 4 }} /> Edit Profile
                        </button>
                    </>
                )}
            </div>
        </article>
    );

    const achievementsElement = (
        <article style={{ ...sharedShellStyle, padding: 18, boxSizing: 'border-box' }}>
            <h3 style={{ ...headingStyle, marginTop: 0 }}>
                My Badges & Progress
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: 12 }}>
                <XPBar xp={profile?.xp || 0} />
                <BadgeGrid earnedBadges={badges} />
            </div>
        </article>
    );

    const reportsElement = (
        <article style={{ ...sharedShellStyle, padding: 18, boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ ...headingStyle, marginTop: 0 }}>
                Recent Reports
            </h3>
            {myIssues.length === 0 ? (
                <p style={styles.empty}>No issues reported yet</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, minHeight: 0, marginTop: 8 }}>
                    {myIssues.map(issue => (
                        <div
                            key={issue._id}
                            style={{
                                ...textBaseStyle,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0',
                                borderBottom: "1px solid rgba(0,0,0,0.06)",
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/issue/${issue._id}`)}
                        >
                            <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {issue.title}
                                </p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', opacity: 0.7, textTransform: 'capitalize' }}>
                                    {issue.category?.replace('_', ' ')} • {formatDistanceToNow(issue.createdAt)}
                                </p>
                            </div>
                            <IssueStatusBadge status={issue.status} />
                        </div>
                    ))}
                </div>
            )}
        </article>
    );

    return (
        <ResponsiveLayout>
            {isMobile ? (
                // Mobile layout
                <div style={{ paddingBottom: '20px' }}>
                    <div style={{ ...styles.header, ...sharedShellStyle, borderRadius: '16px', margin: '4px 0 12px', padding: '10px 14px' }}>
                        <h2 style={styles.title}>My Profile</h2>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            <LogOut size={18} color="#ef4444" />
                        </button>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        {profileCardElement}
                    </div>

                    {/* Stats */}
                    <div style={{ ...styles.statsRow, gap: '8px', borderBottom: 'none', marginBottom: '12px' }}>
                        {[
                            { label: 'Reported', value: profile?.issuesReported || 0, icon: '📋' },
                            { label: 'Verified', value: profile?.issuesVerified || 0, icon: '✅' },
                            { label: 'Badges', value: badges.length, icon: '🏅' },
                            { label: 'Total XP', value: profile?.xp || 0, icon: '⭐' },
                        ].map(s => (
                            <div key={s.label} style={{ ...styles.statCard, ...sharedShellStyle, borderRadius: '16px', padding: '12px 6px' }}>
                                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                                <p style={styles.statValue}>{s.value}</p>
                                <p style={styles.statLabel}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        {achievementsElement}
                    </div>

                    <div>
                        {reportsElement}
                    </div>
                </div>
            ) : (
                // Desktop full-page responsive website layout (exactly matches Framer 0.85fr 1.15fr split layout)
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: '0.85fr 1.15fr',
                    gap: '16px',
                    width: '100%',
                    height: 'calc(100vh - 110px)',
                    minHeight: 0
                }}>
                    {/* Left Column: Profile details & achievements */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
                        {profileCardElement}
                        {achievementsElement}
                    </div>

                    {/* Right Column: Reports */}
                    <div style={{ minHeight: 0 }}>
                        {reportsElement}
                    </div>
                </section>
            )}
        </ResponsiveLayout>
    );
}

const styles = {
    centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#94a3b8' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
    title: { margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' },
    logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' },
    avatarLarge: { width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2.2rem', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(0, 102, 255, 0.2)' },
    profileWard: { margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#64748b', fontWeight: '700' },
    profilePhone: { margin: '0 0 1rem', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' },
    editBtn: { display: 'inline-flex', alignItems: 'center', justifySelf: 'center', padding: '0.5rem 1.25rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.7)', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '800', color: '#475569', boxShadow: '4px 4px 10px rgba(15,23,42,0.05)' },
    editForm: { display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem', width: '100%' },
    editBtns: { display: 'flex', gap: '0.5rem', marginTop: '6px' },
    cancelBtn: { flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: '700', color: '#64748b', boxShadow: '2px 2px 6px rgba(15,23,42,0.04)' },
    saveBtn: { flex: 1, padding: '0.65rem', borderRadius: '12px', border: 'none', background: '#0066FF', color: '#fff', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' },
    statCard: { background: '#fff', textAlign: 'center' },
    statValue: { margin: '0.35rem 0 0.1rem', fontSize: '1.35rem', fontWeight: '950', color: '#0f172a' },
    statLabel: { margin: 0, fontSize: '0.68rem', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' },
    section: { background: 'none', padding: '0.5rem 0' },
    sectionTitle: { margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', letterSpacing: '-0.01em', fontFamily: 'Clash Display, Satoshi, sans-serif' },
    empty: { color: '#94a3b8', fontSize: '0.88rem', padding: '1.5rem 0', fontWeight: '600' }
};