import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
    MapPin, Menu, X, ArrowRight, ThumbsUp, MessageCircle, CheckCircle2,
    Trophy, Star, Leaf, Megaphone, Map,
    BarChart3, Users, Wrench, Building2, Search
} from 'lucide-react';

/* ─────────────────────── tiny helpers ─────────────────────── */
const TwitterIcon = ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);
const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
);
const InstagramIcon = ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);
const YoutubeIcon = ({ className = 'w-5 h-5' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
);

/* Scroll-triggered fade-up wrapper */
function FadeUp({ children, delay = 0, className = '', style = {} }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}

/* ─────────────────────── main component ─────────────────────── */
export default function Landing() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const howItWorksRef = useRef(null);
    const issuesRef = useRef(null);
    const gamifyRef = useRef(null);
    const ctaRef = useRef(null);

    /* redirect logged-in users */
    useEffect(() => {
        if (!loading && user) {
            navigate(
                user.role === 'authority' || user.role === 'moderator'
                    ? '/authority' : '/home',
                { replace: true }
            );
        }
    }, [user, loading, navigate]);

    /* sticky nav shadow on scroll */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { label: 'Explore Issues', onClick: () => scrollTo(issuesRef) },
        { label: 'Leaderboard', onClick: () => scrollTo(gamifyRef) },
        { label: 'About', onClick: () => scrollTo(howItWorksRef) },
        { label: 'For Authorities', onClick: () => navigate('/login?portal=authority') },
    ];

    const stats = [
        { value: '10K+', label: 'Issues Reported' },
        { value: '7K+', label: 'Issues Resolved' },
        { value: '15K+', label: 'Active Citizens' },
        { value: '60+', label: 'Cities & Towns' },
    ];

    const steps = [
        { num: '1', emoji: '📱', title: 'Report', desc: 'Snap a photo and let AI identify the issue, category and severity.' },
        { num: '2', emoji: '📍', title: 'Verify', desc: 'People nearby can verify the issue within 200 meters to prevent fake reports.' },
        { num: '3', emoji: '📋', title: 'Resolve', desc: 'Municipal authorities track and resolve issues with full transparency.' },
    ];

    const issueCards = [
        { severity: 'High', severityColor: '#D32F2F', title: 'Pothole on Main Road', location: 'Banjara Hills, Hyderabad', time: '2 hours ago', likes: 24, comments: 8, status: 'Verified', statusColor: '#2e7d32' },
        { severity: 'Medium', severityColor: '#E65100', title: 'Garbage Overflow', location: 'Kondapur, Hyderabad', time: '5 hours ago', likes: 17, comments: 4, status: 'Verified', statusColor: '#2e7d32' },
        { severity: 'Low', severityColor: '#1565C0', title: 'Broken Streetlight', location: 'Gachibowli, Hyderabad', time: '1 day ago', likes: 31, comments: 6, status: 'In Progress', statusColor: '#E65100' },
    ];

    const badges = [
        { icon: <Star size={20} />, label: 'Reporter', xp: '100 XP', color: '#FFB300' },
        { icon: <CheckCircle2 size={20} />, label: 'Verifier', xp: '250 XP', color: '#2e7d32' },
        { icon: <Trophy size={20} />, label: 'Community Champion', xp: '500 XP', color: '#E65100' },
        { icon: <Leaf size={20} />, label: 'Clean City Hero', xp: '1000 XP', color: '#2e7d32' },
    ];

    const contributors = [
        { name: 'Aarav Mehta', xp: '2,450 XP', rank: 1 },
        { name: 'Priya Sharma', xp: '2,120 XP', rank: 2 },
        { name: 'Rohan Verma', xp: '1,980 XP', rank: 3 },
        { name: 'Sneha Iyer', xp: '1,750 XP', rank: 4 },
        { name: 'Aditya Rao', xp: '1,520 XP', rank: 5 },
    ];

    const authorityFeatures = [
        'Real-time ticket management',
        'SLA monitoring & escalation',
        'Predictive maintenance insights',
        'Transparent citizen engagement',
    ];

    const C = {
        bg: '#f5f0e8',
        ink: '#1a1a1a',
        red: '#C62828',
        border: '#1a1a1a',
        muted: '#888',
        subtle: '#555',
    };

    return (
        <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>
            <style>{`
                .sv-btn-red {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: ${C.red}; color: #fff; font-weight: 700;
                    font-size: 0.9rem; padding: 12px 22px; border-radius: 6px;
                    border: none; cursor: pointer;
                    transition: background 0.18s, transform 0.14s;
                    white-space: nowrap;
                }
                .sv-btn-red:hover { background: #B71C1C; transform: translateY(-1px); }
                .sv-btn-outline-dark {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: transparent; color: ${C.ink}; font-weight: 600;
                    font-size: 0.9rem; padding: 11px 20px; border-radius: 6px;
                    border: 2px solid ${C.ink}; cursor: pointer;
                    transition: background 0.18s, transform 0.14s;
                    white-space: nowrap;
                }
                .sv-btn-outline-dark:hover { background: rgba(0,0,0,0.06); transform: translateY(-1px); }
                .sv-issue-card {
                    background: #fff; border-radius: 10px; overflow: hidden;
                    border: 2px solid ${C.border};
                    box-shadow: 3px 3px 0 ${C.border};
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .sv-issue-card:hover { transform: translateY(-3px) translateX(-1px); box-shadow: 5px 5px 0 ${C.border}; }
                .sv-nav-link {
                    background: none; border: none; cursor: pointer;
                    font-weight: 600; font-size: 0.85rem; color: ${C.ink};
                    padding: 4px 0; transition: color 0.15s;
                }
                .sv-nav-link:hover { color: ${C.red}; }
                .sv-footer-link {
                    font-size: 0.85rem; color: ${C.subtle}; margin-bottom: 8px;
                    cursor: pointer; transition: color 0.15s; display: block;
                }
                .sv-footer-link:hover { color: ${C.red}; }
                .sv-social-icon { cursor: pointer; color: ${C.ink}; transition: color 0.15s; }
                .sv-social-icon:hover { color: ${C.red}; }
                @media (max-width: 768px) {
                    .sv-desktop-nav, .sv-desktop-ctas { display: none !important; }
                    .sv-mobile-btn { display: flex !important; }
                    .sv-hero-art { display: none !important; }
                    .sv-hero-left { max-width: 100% !important; }
                    .sv-stats-row { flex-wrap: wrap; gap: 16px 28px !important; }
                    .sv-how-steps { flex-direction: column !important; gap: 24px !important; }
                    .sv-how-step-item { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; border-bottom: 2px solid ${C.border}; padding-bottom: 24px; }
                    .sv-how-step-item:last-child { border-bottom: none; padding-bottom: 0; }
                    .sv-issues-row { flex-direction: column !important; }
                    .sv-issues-grid { grid-template-columns: 1fr !important; }
                    .sv-real-impact { width: 100% !important; }
                    .sv-tri-col { flex-direction: column !important; gap: 32px !important; }
                    .sv-tri-col-item { border-right: none !important; padding-right: 0 !important; margin-right: 0 !important; border-bottom: 2px solid ${C.border}; padding-bottom: 32px !important; }
                    .sv-tri-col-item:last-child { border-bottom: none; padding-bottom: 0 !important; }
                    .sv-cta-row { flex-direction: column !important; }
                    .sv-footer-grid { flex-direction: column; gap: 32px !important; }
                }
            `}</style>

            {/* ════════════════════════ NAVBAR ════════════════════════ */}
            <motion.header
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                    position: 'sticky', top: 0, zIndex: 1000,
                    background: scrolled ? 'rgba(245,240,232,0.96)' : C.bg,
                    borderBottom: `2px solid ${C.border}`,
                    backdropFilter: 'blur(8px)',
                    boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.1)' : 'none',
                    transition: 'background 0.3s, box-shadow 0.3s',
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', userSelect: 'none' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px', lineHeight: 1 }}>
                            Street<span style={{ color: C.red }}>Voice</span><span style={{ color: C.red }}> 📣</span>
                        </div>
                        <div style={{ fontSize: '0.58rem', color: C.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Cleaner Cities · Stronger Communities
                        </div>
                    </div>

                    {/* Desktop nav */}
                    <nav className="sv-desktop-nav" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                        {navLinks.map(l => (
                            <button key={l.label} className="sv-nav-link" onClick={l.onClick}>{l.label}</button>
                        ))}
                    </nav>

                    {/* Desktop actions */}
                    <div className="sv-desktop-ctas" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Search size={17} style={{ cursor: 'pointer', color: C.ink }} />
                        <button
                            onClick={() => navigate('/login?portal=citizen')}
                            style={{ background: 'none', border: `2px solid ${C.ink}`, borderRadius: 6, padding: '7px 16px', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer', color: C.ink }}
                        >Login</button>
                        <button className="sv-btn-red" onClick={() => navigate('/login?portal=citizen')} style={{ padding: '8px 16px', borderRadius: 6, fontSize: '0.85rem' }}>
                            Get Started
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="sv-mobile-btn"
                        onClick={() => setMobileMenuOpen(v => !v)}
                        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden', borderTop: `2px solid ${C.border}`, background: C.bg }}
                        >
                            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {navLinks.map(l => (
                                    <button key={l.label} onClick={l.onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: C.ink, textAlign: 'left', padding: '4px 0' }}>{l.label}</button>
                                ))}
                                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                    <button onClick={() => navigate('/login?portal=citizen')} style={{ flex: 1, background: 'none', border: `2px solid ${C.ink}`, borderRadius: 6, padding: '10px', fontWeight: 700, cursor: 'pointer', color: C.ink }}>Login</button>
                                    <button className="sv-btn-red" onClick={() => navigate('/login?portal=citizen')} style={{ flex: 1, justifyContent: 'center', borderRadius: 6 }}>Get Started</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ════════════════════════ HERO ════════════════════════ */}
            <section style={{ background: C.bg, borderBottom: `3px solid ${C.border}`, overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0', display: 'flex', gap: 0, alignItems: 'flex-end' }}>
                    {/* Left: text + stats */}
                    <motion.div
                        className="sv-hero-left"
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        style={{ flex: '0 0 auto', maxWidth: 420, paddingBottom: 40, zIndex: 2 }}
                    >
                        <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', lineHeight: 1.0, letterSpacing: '-1.5px', margin: '0 0 18px', textTransform: 'uppercase', color: C.ink }}>
                            Your Streets.<br />
                            Your Voice.<br />
                            <span style={{ color: C.red }}>Your Impact.</span>
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: C.subtle, lineHeight: 1.65, margin: '0 0 24px', maxWidth: 340 }}>
                            Report civic issues. Verify with your community. Track real action. Together, we build cleaner, safer and better neighborhoods.
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                            <button className="sv-btn-red" onClick={() => navigate('/login?portal=citizen')}>
                                <Megaphone size={16} /> Report an Issue
                            </button>
                            <button className="sv-btn-outline-dark" onClick={() => navigate('/login?portal=citizen')}>
                                <Map size={16} /> Explore Map
                            </button>
                        </div>
                        <div className="sv-stats-row" style={{ display: 'flex', gap: 28 }}>
                            {stats.map(s => (
                                <div key={s.label}>
                                    <div style={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, color: C.ink }}>{s.value}</div>
                                    <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: hero illustration */}
                    <motion.div
                        className="sv-hero-art"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{ flex: 1, alignSelf: 'flex-end', overflow: 'hidden', minWidth: 0, display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <img
                            src="/poster-sections/02-hero.jpg"
                            alt="Citizens marching for a cleaner city"
                            style={{ width: '100%', maxWidth: 700, height: 290, objectFit: 'cover', objectPosition: 'center top', display: 'block', borderRadius: '10px 10px 0 0' }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
            <section ref={howItWorksRef} style={{ background: C.bg, borderBottom: `3px solid ${C.border}`, padding: '48px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadeUp>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
                            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-1px', textTransform: 'uppercase', margin: 0 }}>
                                How It Works
                            </h2>
                            <div style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', color: C.red, textAlign: 'right', transform: 'rotate(2deg)', lineHeight: 1.3 }}>
                                Simple Steps.<br />Real Change. ——
                            </div>
                        </div>
                    </FadeUp>
                    <div className="sv-how-steps" style={{ display: 'flex', gap: 0 }}>
                        {steps.map((step, i) => (
                            <FadeUp key={step.title} delay={i * 0.1} style={{ flex: 1 }}>
                                <div
                                    className="sv-how-step-item"
                                    style={{
                                        display: 'flex', gap: 14, alignItems: 'flex-start',
                                        paddingRight: i < steps.length - 1 ? 28 : 0,
                                        marginRight: i < steps.length - 1 ? 0 : 0,
                                        borderRight: i < steps.length - 1 ? `2px solid ${C.border}` : 'none',
                                        marginRight: i < steps.length - 1 ? 28 : 0,
                                    }}
                                >
                                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.red, color: '#fff', fontWeight: 900, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {step.num}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{step.emoji}</div>
                                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0 0 8px' }}>{step.title}</h3>
                                        <p style={{ fontSize: '0.83rem', color: C.subtle, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════ LIVE ISSUES ════════════════════════ */}
            <section ref={issuesRef} style={{ background: C.bg, borderBottom: `3px solid ${C.border}`, padding: '48px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="sv-issues-row" style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                        {/* Left: cards */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <FadeUp>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 10 }}>
                                    <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', margin: 0, display: 'flex', alignItems: 'center', gap: 10, textTransform: 'uppercase' }}>
                                        <span style={{ width: 11, height: 11, borderRadius: '50%', background: C.red, display: 'inline-block', boxShadow: `0 0 0 4px rgba(198,40,40,0.2)`, flexShrink: 0 }} />
                                        Live Issues Around You
                                    </h2>
                                    <button onClick={() => navigate('/login?portal=citizen')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem', color: C.ink, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'underline', padding: 0 }}>
                                        See on Map <ArrowRight size={13} />
                                    </button>
                                </div>
                            </FadeUp>
                            <div className="sv-issues-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                {issueCards.map((card, i) => (
                                    <FadeUp key={card.title} delay={i * 0.08}>
                                        <div className="sv-issue-card">
                                            <div style={{ position: 'relative', height: 100, overflow: 'hidden', background: '#e0d8ce' }}>
                                                <img
                                                    src="/poster-sections/04-live-issues.jpg"
                                                    alt={card.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${i * 34}% 55%` }}
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                <span style={{ position: 'absolute', top: 7, left: 7, background: card.severityColor, color: '#fff', fontWeight: 800, fontSize: '0.65rem', padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                                                    {card.severity}
                                                </span>
                                            </div>
                                            <div style={{ padding: '12px 13px' }}>
                                                <h3 style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0 0 4px' }}>{card.title}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', color: '#666', marginBottom: 2 }}>
                                                    <MapPin size={10} style={{ flexShrink: 0 }} /> {card.location}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: '#999', marginBottom: 11 }}>{card.time}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', gap: 10 }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#555' }}>
                                                            <ThumbsUp size={11} /> {card.likes}
                                                        </span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#555' }}>
                                                            <MessageCircle size={11} /> {card.comments}
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: 20, border: `1.5px solid ${card.statusColor}`, color: card.statusColor, display: 'flex', alignItems: 'center', gap: 3 }}>
                                                        {card.status === 'Verified' && <CheckCircle2 size={9} />}
                                                        {card.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeUp>
                                ))}
                            </div>
                        </div>

                        {/* Right: Real Impact box */}
                        <FadeUp delay={0.2}>
                            <div className="sv-real-impact" style={{ width: 230, flexShrink: 0, border: `2.5px solid ${C.border}`, borderRadius: 12, padding: '18px', background: '#fff', boxShadow: `4px 4px 0 ${C.border}` }}>
                                <div style={{ fontWeight: 900, fontSize: '1.3rem', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 18 }}>
                                    Real People.<br />Real Impact.
                                </div>
                                {[
                                    { Icon: BarChart3, val: '10K+', lbl: 'Issues Reported' },
                                    { Icon: Wrench, val: '7K+', lbl: 'Issues Resolved' },
                                    { Icon: Users, val: '15K+', lbl: 'Active Citizens' },
                                    { Icon: Building2, val: '60+', lbl: 'Cities & Towns' },
                                ].map(({ Icon, val, lbl }) => (
                                    <div key={lbl} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                                        <div style={{ width: 34, height: 34, background: '#fef2f2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.red }}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>{val}</div>
                                            <div style={{ fontSize: '0.68rem', color: '#666', marginTop: 2 }}>{lbl}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ════════════════════════ GAMIFY / CONTRIBUTORS / AUTHORITIES ════════════════════════ */}
            <section ref={gamifyRef} style={{ background: C.bg, borderBottom: `3px solid ${C.border}`, padding: '48px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="sv-tri-col" style={{ display: 'flex', gap: 0 }}>

                        {/* Col 1: Gamify */}
                        <FadeUp style={{ flex: 1 }}>
                            <div className="sv-tri-col-item" style={{ paddingRight: 28, borderRight: `2px solid ${C.border}`, marginRight: 28, paddingBottom: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <span style={{ fontSize: '1rem' }}>⭐</span>
                                    <h3 style={{ fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.2px' }}>Gamify Your Impact</h3>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: C.subtle, lineHeight: 1.6, marginBottom: 18 }}>
                                    Report, verify, and engage to earn XP, unlock badges and climb the leaderboard.
                                </p>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
                                    {badges.map(b => (
                                        <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 52 }}>
                                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: `${b.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${b.color}`, color: b.color }}>
                                                {b.icon}
                                            </div>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.2, color: C.ink }}>{b.label}</span>
                                            <span style={{ fontSize: '0.58rem', color: C.muted }}>{b.xp}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate('/login?portal=citizen')}
                                    style={{ background: 'none', border: `2px solid ${C.red}`, borderRadius: 6, padding: '8px 16px', fontWeight: 700, fontSize: '0.8rem', color: C.red, cursor: 'pointer' }}
                                >
                                    View All Badges
                                </button>
                            </div>
                        </FadeUp>

                        {/* Col 2: Top Contributors */}
                        <FadeUp delay={0.1} style={{ flex: 1 }}>
                            <div className="sv-tri-col-item" style={{ paddingRight: 28, borderRight: `2px solid ${C.border}`, marginRight: 28, paddingBottom: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Trophy size={17} style={{ color: '#FFB300' }} />
                                        <h3 style={{ fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', margin: 0 }}>Top Contributors</h3>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: C.muted, fontWeight: 600 }}>This Month</span>
                                </div>
                                {contributors.map((c, i) => (
                                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < contributors.length - 1 ? `1px solid #e0d8ce` : 'none' }}>
                                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: i < 3 ? C.red : '#e0d8ce', color: i < 3 ? '#fff' : C.ink, fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {c.rank}
                                        </span>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0d8ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                                            {c.name[0]}
                                        </div>
                                        <span style={{ flex: 1, fontWeight: 600, fontSize: '0.83rem' }}>{c.name}</span>
                                        <span style={{ fontWeight: 800, fontSize: '0.83rem', color: C.red }}>{c.xp}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeUp>

                        {/* Col 3: Authorities */}
                        <FadeUp delay={0.2} style={{ flex: 1 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <Building2 size={17} />
                                    <h3 style={{ fontWeight: 900, fontSize: '1.05rem', textTransform: 'uppercase', margin: 0 }}>For Municipal Authorities</h3>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: C.subtle, lineHeight: 1.6, marginBottom: 14 }}>
                                    A dedicated control center to manage tickets, track SLAs and gain insights for smarter cities.
                                </p>
                                {authorityFeatures.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                                        <CheckCircle2 size={14} style={{ color: '#2e7d32', flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.8rem', color: '#333' }}>{f}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => navigate('/login?portal=authority')}
                                    style={{ marginTop: 14, background: 'none', border: `2px solid ${C.ink}`, borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', color: C.ink, display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    Learn More <ArrowRight size={13} />
                                </button>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ════════════════════════ BOTTOM CTA ════════════════════════ */}
            <section ref={ctaRef} style={{ background: C.ink, color: '#fff', borderBottom: `3px solid ${C.red}`, overflow: 'hidden' }}>
                <div className="sv-cta-row" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'stretch', minHeight: 180 }}>
                    {/* Left: italic headline + crowd art */}
                    <FadeUp style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ padding: '32px 32px 0', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                            <div style={{ fontWeight: 900, fontSize: 'clamp(1.5rem, 4.5vw, 2.6rem)', textTransform: 'uppercase', lineHeight: 1.0, letterSpacing: '-1px', fontStyle: 'italic', paddingBottom: 28 }}>
                                Let's<br />Build<br />Cleaner<br />Cities<br />Together.
                            </div>
                            <img
                                src="/poster-sections/cta-crowd-art.png"
                                alt="Community celebration"
                                style={{ height: 130, objectFit: 'contain', alignSelf: 'flex-end', opacity: 0.8 }}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    </FadeUp>

                    {/* Divider */}
                    <div style={{ width: 2, background: 'rgba(255,255,255,0.15)', margin: '32px 0', flexShrink: 0 }} />

                    {/* Right: CTA */}
                    <FadeUp delay={0.12} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ padding: '40px', textAlign: 'right', maxWidth: 400 }}>
                            <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)', textTransform: 'uppercase', letterSpacing: '-0.5px', margin: '0 0 12px', lineHeight: 1.1 }}>
                                A Stronger Community Starts With a Louder Voice.
                            </h2>
                            <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)', marginBottom: 22, lineHeight: 1.55 }}>
                                Be the change in your neighborhood. Report, verify and inspire action.
                            </p>
                            <button className="sv-btn-red" onClick={() => navigate('/login?portal=citizen')} style={{ padding: '13px 26px', borderRadius: 6, fontSize: '0.92rem' }}>
                                Join StreetVoice Today <ArrowRight size={15} />
                            </button>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* ════════════════════════ FOOTER ════════════════════════ */}
            <footer style={{ background: C.bg, borderTop: `2px solid ${C.border}`, padding: '40px 24px 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="sv-footer-grid" style={{ display: 'flex', gap: 48, justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap' }}>
                        {/* Brand */}
                        <div style={{ minWidth: 160 }}>
                            <div style={{ fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-0.4px', marginBottom: 3 }}>
                                Street<span style={{ color: C.red }}>Voice</span><span style={{ color: C.red }}> 📣</span>
                            </div>
                            <div style={{ fontSize: '0.6rem', color: C.muted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                                Cleaner Cities · Stronger Communities
                            </div>
                        </div>

                        {/* Product */}
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', color: C.ink }}>Product</h4>
                            {['Home', 'Explore Issues', 'Leaderboard'].map(l => (
                                <button key={l} className="sv-footer-link" onClick={() => navigate('/login?portal=citizen')} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', display: 'block', cursor: 'pointer' }}>{l}</button>
                            ))}
                        </div>

                        {/* Company */}
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', color: C.ink }}>Company</h4>
                            {['About', 'For Authorities', 'Contact'].map(l => (
                                <button key={l} className="sv-footer-link" onClick={() => navigate(l === 'For Authorities' ? '/login?portal=authority' : '/login?portal=citizen')} style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', display: 'block', cursor: 'pointer' }}>{l}</button>
                            ))}
                        </div>

                        {/* Support */}
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', color: C.ink }}>Support</h4>
                            {['Help Center', 'Privacy Policy', 'Terms of Service'].map(l => (
                                <span key={l} className="sv-footer-link" style={{ display: 'block' }}>{l}</span>
                            ))}
                        </div>

                        {/* Social */}
                        <div>
                            <h4 style={{ fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', color: C.ink }}>Follow Us</h4>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                {[TwitterIcon, LinkedInIcon, InstagramIcon, YoutubeIcon].map((Icon, i) => (
                                    <span key={i} className="sv-social-icon"><Icon /></span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: `1.5px solid #d0c9be`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: '0.72rem', color: '#aaa' }}>© 2026 StreetVoice. All rights reserved.</span>
                        <span style={{ fontSize: '0.72rem', color: '#aaa' }}>Made with ❤️ for better cities</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
