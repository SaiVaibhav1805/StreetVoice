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

    const mapElement = (
        <div style={{ height: '100%', width: '100%', borderRadius: isMobile ? 0 : '20px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-concave)' }}>
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
    );

    const feedElement = (
        <div style={{ 
            overflowY: 'auto', 
            padding: isMobile ? '0.75rem' : '0rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            flex: 1,
            maxHeight: isMobile ? 'none' : 'calc(100vh - 250px)'
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
    );

    return (
        <ResponsiveLayout>
            {isMobile ? (
                // Mobile layout
                <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
                    {/* Header info */}
                    <div style={styles.header}>
                        <span style={styles.logo}>📍 Nearby Issues</span>
                        <span style={styles.count}>{filtered.length} filtered</span>
                    </div>

                    {/* Tab Switcher */}
                    <div style={styles.toggle}>
                        <button
                            onClick={() => setView('map')}
                            style={{ ...styles.toggleBtn, background: view === 'map' ? '#0066FF' : '#fff', color: view === 'map' ? '#fff' : '#475569', boxShadow: view === 'map' ? 'none' : 'var(--shadow-flat)' }}
                        >
                            🗺️ Map
                        </button>
                        <button
                            onClick={() => setView('feed')}
                            style={{ ...styles.toggleBtn, background: view === 'feed' ? '#0066FF' : '#fff', color: view === 'feed' ? '#fff' : '#475569', boxShadow: view === 'feed' ? 'none' : 'var(--shadow-flat)' }}
                        >
                            📋 Feed
                        </button>
                    </div>

                    {/* Filter pills */}
                    <div style={styles.filters}>
                        {['all', 'reported', 'verified', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    ...styles.pill,
                                    background: filter === f ? '#0066FF' : '#fff',
                                    color: filter === f ? '#fff' : '#475569',
                                    boxShadow: filter === f ? 'none' : 'var(--shadow-flat)'
                                }}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Render active tab */}
                    <div style={{ flex: 1 }}>
                        {view === 'map' ? mapElement : feedElement}
                    </div>
                </div>
            ) : (
                // Desktop split side-by-side website layout
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', height: 'calc(100vh - 120px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
                                Nearby Reported Issues
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                                Active Filter: <strong style={{ color: '#0066FF', textTransform: 'capitalize' }}>{categoryFilter.replace('_', ' ')}</strong> Category
                            </p>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#64748b', background: '#fff', padding: '0.6rem 1.25rem', borderRadius: '20px', boxShadow: 'var(--shadow-flat)' }}>
                            📋 {filtered.length} active cases
                        </span>
                    </div>

                    {/* Filter status row */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status:</span>
                        {['all', 'reported', 'verified', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    ...styles.pill,
                                    padding: '0.5rem 1.35rem',
                                    fontSize: '0.85rem',
                                    background: filter === f ? '#0066FF' : '#fff',
                                    color: filter === f ? '#fff' : '#64748b',
                                    boxShadow: filter === f ? 'none' : 'var(--shadow-flat)',
                                    border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.4)'
                                }}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Side-by-side split */}
                    <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>
                        <div style={{ flex: 1.8, height: '100%' }}>
                            {mapElement}
                        </div>
                        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflow: 'hidden' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-0.01em' }}>
                                Recent Reported Issues
                            </h3>
                            {feedElement}
                        </div>
                    </div>
                </div>
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
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 10
    },
    logo: { fontWeight: '800', fontSize: '1rem', color: '#0f172a' },
    count: { fontSize: '0.8rem', color: '#666' },
    filters: {
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        background: '#f0f3f8',
        overflowX: 'auto',
        borderBottom: '1px solid #e2e8f0'
    },
    toggle: {
        display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem',
        background: '#f0f3f8', borderBottom: '1px solid #e2e8f0'
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
        boxShadow: '0 4px 20px rgba(0, 102, 255, 0.4)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'transform 0.2s',
        outline: 'none'
    }
};