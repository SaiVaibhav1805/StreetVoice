import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';
import { 
    MapPin, LayoutDashboard, PlusCircle, Trophy, User, 
    LogOut, Bell, Search, AlertCircle, Sparkles, Filter 
} from 'lucide-react';

const CATEGORIES = [
    { value: 'all', label: 'All Categories', emoji: '🏙️' },
    { value: 'pothole', label: 'Pothole', emoji: '🕳️' },
    { value: 'water_leakage', label: 'Water Leakage', emoji: '💧' },
    { value: 'streetlight', label: 'Streetlight', emoji: '💡' },
    { value: 'garbage', label: 'Garbage', emoji: '🗑️' },
    { value: 'sewage', label: 'Sewage', emoji: '🚧' },
    { value: 'road_damage', label: 'Road Damage', emoji: '🛣️' },
    { value: 'encroachment', label: 'Encroachment', emoji: '🏗️' },
    { value: 'other', label: 'Other Issues', emoji: '📦' }
];

export default function ResponsiveLayout({ children }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, logout } = useAuth();
    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [searchQuery, setSearchQuery] = useState('');
    const currentCategory = searchParams.get('category') || 'all';

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { path: '/home', label: 'Home' },
        { path: '/report', label: 'Report Issue' },
        { path: '/profile', label: 'My Reports' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/leaderboard', label: 'Community' },
    ];

    const handleCategoryClick = (val) => {
        if (val === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', val);
        }
        setSearchParams(searchParams);
        // If not already on home page, redirect to home with that category filter!
        if (pathname !== '/home') {
            navigate(`/home?category=${val}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const filteredCategories = CATEGORIES.filter(c => 
        c.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={styles.container}>
            {/* Top Navigation Header (Desktop Only) */}
            {!isMobile && (
                <header style={styles.topHeader}>
                    <div style={styles.logoBox} onClick={() => navigate('/home')}>
                        <span style={styles.logoIcon}>📍</span>
                        <span style={styles.logoText}>StreetVoice</span>
                    </div>

                    <nav style={styles.topNav}>
                        {navItems.map(({ path, label }) => {
                            const active = pathname === path;
                            return (
                                <button
                                    key={path}
                                    onClick={() => navigate(path)}
                                    style={{
                                        ...styles.navTab,
                                        color: active ? '#0066FF' : '#64748b',
                                        fontWeight: active ? '800' : '600',
                                        borderBottom: active ? '3px solid #0066FF' : '3px solid transparent'
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </nav>

                    <div style={styles.headerRight}>
                        <button style={styles.notificationBtn} title="Notifications">
                            <Bell size={20} color="#64748b" />
                            <span style={styles.bellDot} />
                        </button>
                        
                        {user && (
                            <div style={styles.userCard}>
                                <div style={styles.avatarMini}>
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span style={styles.userName}>{user.name || 'Citizen'}</span>
                                <button onClick={handleLogout} style={styles.logoutIconBtn} title="Logout">
                                    <LogOut size={15} color="#94a3b8" />
                                </button>
                            </div>
                        )}
                    </div>
                </header>
            )}

            <div style={styles.appBody}>
                {/* Left Sidebar (Desktop Only) */}
                {!isMobile && (
                    <aside style={styles.sidebar}>
                        <div style={styles.searchBox}>
                            <Search size={16} color="#94a3b8" style={{ marginRight: '0.4rem' }} />
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <div style={styles.categoryMenu}>
                            <p style={styles.menuLabel}>Report Categories</p>
                            {filteredCategories.map(c => {
                                const active = currentCategory === c.value;
                                return (
                                    <button
                                        key={c.value}
                                        onClick={() => handleCategoryClick(c.value)}
                                        style={{
                                            ...styles.categoryBtn,
                                            background: active ? '#fff' : 'transparent',
                                            boxShadow: active ? 'var(--shadow-flat)' : 'none',
                                            fontWeight: active ? '800' : '500',
                                            color: active ? '#0066FF' : '#1e293b'
                                        }}
                                    >
                                        <span style={styles.categoryEmoji}>{c.emoji}</span>
                                        <span style={styles.categoryLabel}>{c.label}</span>
                                        {active && <span style={styles.activeDot} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Gamification mini-banner */}
                        {user && (
                            <div style={styles.gamificationMiniBanner}>
                                <div style={styles.bannerHeader}>
                                    <Sparkles size={14} color="#FF9500" />
                                    <span>Civic Rank</span>
                                </div>
                                <h4 style={styles.rankName}>
                                    {user.xp >= 200 ? '🦸 Civic Hero' : user.xp >= 100 ? '👀 Street Watcher' : '🌱 Rookie'}
                                </h4>
                                <div style={styles.xpTextRow}>
                                    <span>XP Balance</span>
                                    <strong>{user.xp || 0} XP</strong>
                                </div>
                            </div>
                        )}
                    </aside>
                )}

                {/* Main Content Area */}
                <main style={{ 
                    ...styles.mainCanvas, 
                    paddingTop: isMobile ? '0px' : '20px',
                    paddingBottom: isMobile ? '70px' : '20px'
                }}>
                    <div style={styles.pageInner}>
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Header */}
            {isMobile && <BottomNav />}
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#f0f3f8',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', 'Inter', sans-serif"
    },
    topHeader: {
        height: '70px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
    },
    logoBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer'
    },
    logoIcon: {
        fontSize: '1.5rem'
    },
    logoText: {
        fontSize: '1.3rem',
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: '-0.02em',
    },
    topNav: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        height: '100%'
    },
    navTab: {
        border: 'none',
        background: 'none',
        height: '100%',
        padding: '0 1.25rem',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        marginTop: '3px' // Align height
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
    },
    notificationBtn: {
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 2px 5px rgba(0,0,0,0.01)'
    },
    bellDot: {
        position: 'absolute',
        top: '10px',
        right: '11px',
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: '#ef4444'
    },
    userCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: '#f8fafc',
        padding: '0.35rem 0.85rem',
        borderRadius: '20px',
        border: '1px solid #e2e8f0'
    },
    avatarMini: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: '#0066FF',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '0.85rem'
    },
    userName: {
        fontSize: '0.85rem',
        fontWeight: '800',
        color: '#1e293b'
    },
    logoutIconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '0.25rem'
    },
    appBody: {
        display: 'flex',
        flex: 1,
        minHeight: 0
    },
    sidebar: {
        width: '250px',
        background: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'sticky',
        top: '70px',
        height: 'calc(100vh - 70px)',
        overflowY: 'auto'
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: '#f0f3f8',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.5rem 0.75rem',
        boxShadow: 'var(--shadow-concave)'
    },
    searchInput: {
        border: 'none',
        background: 'none',
        outline: 'none',
        fontSize: '0.85rem',
        color: '#1e293b',
        width: '100%'
    },
    categoryMenu: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
    },
    menuLabel: {
        fontSize: '0.75rem',
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingLeft: '0.5rem',
        marginBottom: '0.5rem'
    },
    categoryBtn: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 0.85rem',
        borderRadius: '12px',
        border: '1px solid transparent',
        background: 'none',
        fontSize: '0.88rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        outline: 'none',
        position: 'relative'
    },
    categoryEmoji: {
        marginRight: '0.75rem',
        fontSize: '1.1rem'
    },
    categoryLabel: {
        flex: 1
    },
    activeDot: {
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: '#0066FF',
        position: 'absolute',
        right: '12px'
    },
    gamificationMiniBanner: {
        marginTop: 'auto',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
        textAlign: 'left'
    },
    bannerHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.72rem',
        fontWeight: '800',
        color: '#FF9500',
        textTransform: 'uppercase',
        marginBottom: '0.25rem'
    },
    rankName: {
        fontSize: '0.95rem',
        fontWeight: '900',
        color: '#0f172a',
        margin: '0 0 0.5rem'
    },
    xpTextRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#64748b'
    },
    mainCanvas: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: 'calc(100vh - 70px)',
        overflowY: 'auto'
    },
    pageInner: {
        width: '100%',
        padding: '1.25rem 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    }
};
