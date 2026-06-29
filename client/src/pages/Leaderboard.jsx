import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import LeaderboardRow from '../components/layout/gamification/LeaderBoard';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { user } = useAuth();

    useEffect(() => {
        fetchLeaderboard();
        
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/users/leaderboard');
            setUsers(res.data.users);
        } catch {
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const sharedShellStyle = {
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: `10px 10px 22px rgba(15, 23, 42, 0.14), -10px -10px 22px rgba(255, 255, 255, 0.9)`,
        border: `1px solid rgba(255,255,255,0.7)`,
        width: '100%',
        maxWidth: '650px',
        boxSizing: 'border-box'
    };

    return (
        <ResponsiveLayout>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '12px 0' }}>
                <article style={sharedShellStyle}>
                    {/* Header */}
                    <div style={styles.header}>
                        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Clash Display, Satoshi, sans-serif', color: '#0f172a' }}>
                            Community Leaderboard
                        </h3>
                        <p style={styles.sub}>Top citizens making a difference across Hyderabad</p>
                    </div>

                    {loading ? (
                        <div style={styles.centered}><p>Loading scores...</p></div>
                    ) : users.length === 0 ? (
                        <div style={styles.centered}>
                            <p style={{ fontSize: '2.5rem' }}>🏙️</p>
                            <p style={{ fontWeight: 'bold' }}>No registered citizens yet.</p>
                        </div>
                    ) : (
                        <div style={styles.list}>
                            {users.map((u, i) => (
                                <LeaderboardRow
                                    key={u._id}
                                    user={u}
                                    rank={i + 1}
                                    isCurrentUser={u._id === user?._id}
                                />
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </ResponsiveLayout>
    );
}

const styles = {
    desktopContainer: {
        maxWidth: '650px',
        margin: '1.5rem auto 0',
        background: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: '24px',
        boxShadow: '10px 10px 22px rgba(15, 23, 42, 0.06), -10px -10px 22px rgba(255, 255, 255, 0.9)',
        overflow: 'hidden'
    },
    header: { 
        padding: '1.5rem', 
        background: '#fff', 
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        textAlign: 'left'
    },
    title: { 
        margin: '0 0 0.25rem', 
        fontSize: '1.5rem', 
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: '-0.02em',
        fontFamily: 'Clash Display, Satoshi, sans-serif'
    },
    sub: { 
        margin: 0, 
        fontSize: '0.88rem', 
        color: '#64748b',
        fontWeight: '600'
    },
    centered: { 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '4rem 2rem', 
        color: '#94a3b8' 
    },
    list: { 
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }
};