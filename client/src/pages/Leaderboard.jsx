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

    return (
        <ResponsiveLayout>
            <div style={isMobile ? {} : styles.desktopContainer}>
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>🏆 Community Leaderboard</h2>
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
            </div>
        </ResponsiveLayout>
    );
}

const styles = {
    desktopContainer: {
        maxWidth: '650px',
        margin: '1.5rem auto 0',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
        overflow: 'hidden'
    },
    header: { 
        padding: '1.5rem', 
        background: '#fff', 
        borderBottom: '1px solid #f1f5f9',
        textAlign: 'left'
    },
    title: { 
        margin: '0 0 0.25rem', 
        fontSize: '1.5rem', 
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: '-0.02em'
    },
    sub: { 
        margin: 0, 
        fontSize: '0.88rem', 
        color: '#64748b',
        fontWeight: '500'
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
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    }
};