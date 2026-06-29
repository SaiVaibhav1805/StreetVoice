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
        { path: '/home', label: 'Home', view: 'Home' },
        { path: '/report', label: 'Report Issue', view: 'Report Issue' },
        { path: '/profile', label: 'My Reports', view: 'My Reports' },
        { path: '/dashboard', label: 'Dashboard', view: 'Dashboard' },
        { path: '/leaderboard', label: 'Community', view: 'Community' },
    ];

    const handleCategoryClick = (val) => {
        if (val === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', val);
        }
        setSearchParams(searchParams);
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

    const surfaceColor = '#FFFFFF';
    const textColor = '#0f172a';
    const accentColor = '#0066FF';
    const secondaryAccent = '#FF9500';

    const sharedShellStyle = {
        background: surfaceColor,
        borderRadius: 24,
        boxShadow: `10px 10px 22px rgba(15, 23, 42, 0.08), -10px -10px 22px rgba(255, 255, 255, 0.9)`,
        border: `1px solid rgba(255,255,255,0.7)`,
    };

    const textBaseStyle = {
        color: textColor,
        fontFamily: "Satoshi, Clash Display, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    };

    return (
        <div style={{
            ...styles.container,
            ...textBaseStyle,
        }}>
            {/* Top Navigation Header (Desktop Only) */}
            {!isMobile && (
                <header style={{ ...styles.topHeader, ...sharedShellStyle }}>
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
                                        color: active ? '#FFFFFF' : textColor,
                                        background: active ? accentColor : 'rgba(255,255,255,0.52)',
                                        boxShadow: active 
                                            ? '0 8px 22px rgba(0, 102, 255, 0.25)' 
                                            : 'inset 2px 2px 6px rgba(15,23,42,0.05), inset -2px -2px 6px rgba(255,255,255,0.9)',
                                        fontWeight: active ? '700' : '650',
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
                    <aside style={{ ...styles.sidebar, ...sharedShellStyle }}>
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
                                            background: active ? 'rgba(0,102,255,0.06)' : 'rgba(255,255,255,0.4)',
                                            border: active ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.6)',
                                            boxShadow: active 
                                                ? 'inset 2px 2px 5px rgba(0,102,255,0.1)' 
                                                : 'inset 2px 2px 5px rgba(15,23,42,0.04), inset -2px -2px 5px rgba(255,255,255,0.9)',
                                            fontWeight: active ? '700' : '500',
                                            color: active ? accentColor : '#475569'
                                        }}
                                    >
                                        <span style={styles.categoryEmoji}>{c.emoji}</span>
                                        <span style={styles.categoryLabel}>{c.label}</span>
                                        {active && <span style={{ ...styles.activeDot, background: accentColor }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Gamification mini-banner */}
                        {user && (
                            <div style={{ ...styles.gamificationMiniBanner, ...sharedShellStyle, boxShadow: 'none', background: 'rgba(255,255,255,0.6)' }}>
                                <div style={styles.bannerHeader}>
                                    <Sparkles size={14} color="#FF9500" fill="#FF9500" />
                                    <span>Civic Rank</span>
                                </div>
                                <h4 style={styles.rankName}>
                                    {user.xp >= 200 ? '🦸 Civic Hero' : user.xp >= 100 ? '👀 Street Watcher' : '🌱 Rookie'}
                                </h4>
                                <div style={styles.xpTextRow}>
                                    <span>XP Balance</span>
                                    <strong style={{ color: secondaryAccent }}>{user.xp || 0} XP</strong>
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

            {/* Mobile Bottom Navigation */}
            {isMobile && <BottomNav />}
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(155deg, #f7f8fb 0%, #eef1f7 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '12px'
    },
    topHeader: {
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        marginBottom: '12px'
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
        gap: '10px',
        height: '100%'
    },
    navTab: {
        border: 'none',
        height: '42px',
        padding: '0 1.25rem',
        fontSize: '0.92rem',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        borderRadius: '14px',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
    },
    notificationBtn: {
        background: '#fff',
        border: '1px solid rgba(255,255,255,0.7)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '4px 4px 10px rgba(15,23,42,0.05), -4px -4px 10px #ffffff'
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
        background: 'rgba(255,255,255,0.6)',
        padding: '0.35rem 0.85rem',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '4px 4px 10px rgba(15,23,42,0.04)'
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
        minHeight: 0,
        gap: '14px'
    },
    sidebar: {
        width: '260px',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        flexShrink: 0,
        height: 'calc(100vh - 110px)',
        overflowY: 'auto'
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: '14px',
        padding: '0.5rem 0.75rem',
        boxShadow: 'inset 2px 2px 5px rgba(15,23,42,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)'
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
        gap: '8px'
    },
    menuLabel: {
        fontSize: '0.72rem',
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingLeft: '0.5rem',
        marginBottom: '0.25rem'
    },
    categoryBtn: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: '12px',
        fontSize: '0.88rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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
        position: 'absolute',
        right: '12px'
    },
    gamificationMiniBanner: {
        marginTop: 'auto',
        borderRadius: '16px',
        padding: '1rem',
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
        height: 'calc(100vh - 110px)',
        overflowY: 'auto'
    },
    pageInner: {
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0
    }
};
