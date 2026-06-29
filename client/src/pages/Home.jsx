import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IssueCard from '../components/layout/issue/IssueCard';
import { useMapSocket } from '../hooks/useMapSocket';
import { Plus } from 'lucide-react';

// Fix default leaflet marker icons (known Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Color coded pins by severity
const pinColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    resolved: '#6b7280'
};

const createColorPin = (color) => L.divIcon({
    className: '',
    html: `<div style="
    width:14px; height:14px;
    background:${color};
    border:2px solid #fff;
    border-radius:50%;
    box-shadow:0 2px 6px rgba(0,0,0,0.3)
  "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

// Auto-locate user on map
function LocateUser({ onLocate }) {
    const map = useMap();
    useEffect(() => {
        map.locate({ setView: true, maxZoom: 15 });
        map.on('locationfound', e => onLocate(e.latlng));
    }, [map]);
    return null;
}

export default function Home() {
    const [issues, setIssues] = useState([]);
    const [view, setView] = useState('map'); // 'map' | 'feed' (for mobile only)
    const [userPos, setUserPos] = useState(null);
    const [filter, setFilter] = useState('all'); // status filter
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const categoryFilter = searchParams.get('category') || 'all';

    useMapSocket({
        onNewIssue: (issue) => {
            setIssues(prev => [issue, ...prev]);
        }
    });

    useEffect(() => {
        fetchIssues();
        
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchIssues = async () => {
        try {
            const res = await api.get('/issues');
            setIssues(res.data.issues || []);
        } catch {
            setIssues([]);
        }
    };

    const filtered = issues.filter(i => {
        const matchesStatus = filter === 'all' || i.status === filter;
        const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter;
        return matchesStatus && matchesCategory;
    });

    const sharedShellStyle = {
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: `10px 10px 22px rgba(15, 23, 42, 0.14), -10px -10px 22px rgba(255, 255, 255, 0.9)`,
        border: `1px solid rgba(255,255,255,0.7)`,
    };

    const headingStyle = {
        margin: '0 0 12px',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        fontFamily: 'Clash Display, Satoshi, sans-serif'
    };

    const mapElement = (
        <article style={{ ...sharedShellStyle, padding: 18, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <h3 style={headingStyle}>
                Nearby Reported Issues
            </h3>
            <div style={{ 
                flex: 1, 
                width: '100%', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid rgba(255,255,255,0.7)', 
                boxShadow: 'inset 2px 2px 5px rgba(15,23,42,0.05)'
            }}>
                <MapContainer center={[17.385, 78.4867]} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocateUser onLocate={setUserPos} />
                    {userPos && (
                        <Marker position={userPos} icon={L.divIcon({
                            className: '',
                            html: `<div style="width:16px;height:16px;background:#0066FF;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(0,102,255,0.2)"></div>`,
                            iconSize: [16, 16], iconAnchor: [8, 8]
                        })}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}
                    {filtered.map(issue => (
                        <Marker
                            key={issue._id}
                            position={[issue.location.coordinates[1], issue.location.coordinates[0]]}
                            icon={createColorPin(issue.status === 'resolved' ? pinColors.resolved : pinColors[issue.severity] || pinColors.medium)}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'sans-serif' }}>
                                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{issue.title}</strong><br />
                                    <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                                        {issue.category.replace('_', ' ')} • {issue.status}
                                    </span><br />
                                    <button 
                                        onClick={() => navigate(`/issue/${issue._id}`)} 
                                        style={{ marginTop: '8px', color: '#0066FF', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                                    >
                                        View details →
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </article>
    );

    const feedElement = (
        <article style={{ ...sharedShellStyle, padding: 18, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <h3 style={headingStyle}>
                Issue Feed
            </h3>
            {/* Filter status row styled to fit the layout perfectly */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {['all', 'reported', 'verified', 'resolved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            ...styles.pill,
                            background: filter === f ? '#0066FF' : 'rgba(255,255,255,0.6)',
                            color: filter === f ? '#fff' : '#64748b',
                            boxShadow: filter === f ? '0 4px 10px rgba(0, 102, 255, 0.2)' : 'inset 2px 2px 5px rgba(15,23,42,0.04), inset -2px -2px 5px rgba(255,255,255,0.9)',
                            border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.6)'
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div style={{ 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                flex: 1
            }}>
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem' }}>
                        <p style={{ fontSize: '2.5rem' }}>🏙️</p>
                        <p style={{ fontWeight: 'bold', color: '#64748b' }}>No active reports</p>
                        <p style={{ fontSize: '0.85rem' }}>Change category or submit a new case!</p>
                    </div>
                ) : (
                    filtered.map(issue => <IssueCard key={issue._id} issue={issue} />)
                )}
            </div>
        </article>
    );

    return (
        <ResponsiveLayout>
            {isMobile ? (
                // Mobile layout
                <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
                    {/* Header info */}
                    <div style={{ ...styles.header, ...sharedShellStyle, borderRadius: '16px', margin: '4px 0 10px', padding: '10px 14px' }}>
                        <span style={styles.logo}>📍 Nearby Issues</span>
                        <span style={styles.count}>{filtered.length} filtered</span>
                    </div>

                    {/* Tab Switcher */}
                    <div style={{ ...styles.toggle, ...sharedShellStyle, borderRadius: '16px', padding: '6px', marginBottom: '10px', gap: '6px' }}>
                        <button
                            onClick={() => setView('map')}
                            style={{ 
                                ...styles.toggleBtn, 
                                background: view === 'map' ? '#0066FF' : 'transparent', 
                                color: view === 'map' ? '#fff' : '#475569', 
                                boxShadow: view === 'map' ? '0 4px 12px rgba(0,102,255,0.2)' : 'none' 
                            }}
                        >
                            🗺️ Map
                        </button>
                        <button
                            onClick={() => setView('feed')}
                            style={{ 
                                ...styles.toggleBtn, 
                                background: view === 'feed' ? '#0066FF' : 'transparent', 
                                color: view === 'feed' ? '#fff' : '#475569', 
                                boxShadow: view === 'feed' ? '0 4px 12px rgba(0,102,255,0.2)' : 'none' 
                            }}
                        >
                            📋 Feed
                        </button>
                    </div>

                    {/* Render active tab */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                        {view === 'map' ? mapElement : feedElement}
                    </div>
                </div>
            ) : (
                // Desktop split side-by-side website layout (exactly matches Framer 1.25fr 1fr split)
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: '1.25fr 1fr',
                    gap: '16px',
                    width: '100%',
                    height: 'calc(100vh - 110px)',
                    minHeight: 0
                }}>
                    {mapElement}
                    {feedElement}
                </section>
            )}

            {/* Quick Report FAB Button */}
            <button 
                onClick={() => navigate('/report')} 
                style={styles.floatingActionBtn} 
                title="Report Issue"
            >
                <Plus size={28} color="#fff" />
            </button>
        </ResponsiveLayout>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        zIndex: 10
    },
    logo: { fontWeight: '800', fontSize: '1rem', color: '#0f172a' },
    count: { fontSize: '0.8rem', color: '#64748b', fontWeight: '600' },
    toggle: {
        display: 'flex',
        background: 'rgba(255,255,255,0.5)',
    },
    toggleBtn: {
        flex: 1, padding: '0.55rem', borderRadius: '12px',
        border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem',
        transition: 'all 0.15s'
    },
    pill: {
        padding: '0.4rem 1.15rem',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '800',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s'
    },
    floatingActionBtn: {
        position: 'fixed',
        bottom: '2rem',
        right: '2.5rem',
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'transform 0.2s',
        outline: 'none'
    }
};