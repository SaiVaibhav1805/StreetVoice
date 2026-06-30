import { useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Plus, LayoutDashboard, User, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function BottomNav() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user } = useAuth()

    const isAuthority = user?.role === 'authority' || user?.role === 'moderator'
    const tabs = isAuthority ? [
        { path: '/authority', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/home', icon: MapPin, label: 'Map' }
    ] : [
        { path: '/home', icon: MapPin, label: 'Map' },
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/report', icon: Plus, label: 'Report' },
        { path: '/leaderboard', icon: Trophy, label: 'Leaders' },
        { path: '/profile', icon: User, label: 'Profile' },
    ]

    return (
        <nav style={styles.nav}>
            {tabs.map(({ path, icon: Icon, label }) => {
                const active = pathname === path
                const isReport = label === 'Report'
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        style={{
                            ...styles.tab,
                            ...(isReport ? styles.reportBtn : {}),
                            color: active ? '#2563eb' : '#888'
                        }}
                    >
                        <Icon size={isReport ? 26 : 22} color={isReport ? '#fff' : active ? '#2563eb' : '#888'} />
                        {!isReport && <span style={{ fontSize: '0.65rem', marginTop: '2px' }}>{label}</span>}
                    </button>
                )
            })}
        </nav>
    )
}

const styles = {
    nav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.06)'
    },
    tab: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        borderRadius: '8px',
        minWidth: '48px'
    },
    reportBtn: {
        background: '#2563eb',
        borderRadius: '50%',
        width: '52px',
        height: '52px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(37,99,235,0.4)'
    }
}