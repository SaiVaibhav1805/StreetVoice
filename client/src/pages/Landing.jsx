import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Users, Shield, ArrowRight, Zap, Target, Eye, 
    BarChart2, Trophy, Clock, HelpCircle, Flame, Star, Check 
} from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'authority' || user.role === 'moderator') {
                navigate('/authority', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    return (
        <div style={styles.container}>
            {/* Navigation Header */}
            <header style={styles.navBar}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoIcon}>📍</span>
                    <span style={styles.logoText}>StreetVoice</span>
                </div>
                <div style={styles.navLinks}>
                    <a href="#about" style={styles.navLink}>How it Works</a>
                    <a href="#features" style={styles.navLink}>Features</a>
                    <a href="#impact" style={styles.navLink}>Impact</a>
                    <a href="#authorities" style={styles.navLink}>For Authorities</a>
                </div>
                <button 
                    style={styles.navCTA} 
                    onClick={() => navigate('/login?portal=citizen')}
                >
                    Launch App
                </button>
            </header>

            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div style={styles.heroGlow} />
                <h1 style={styles.heroTitle}>
                    Your Street Has a Voice. <br />
                    <span style={styles.gradientText}>Now It's Time to Use It.</span>
                </h1>
                <p style={styles.heroSubtitle}>
                    Report potholes, broken streetlights, water leakages and more — in seconds. AI verifies it. Your community backs it. Authorities fix it. All in one place.
                </p>
                <div style={styles.heroActions}>
                    <button 
                        style={styles.heroBtnPrimary}
                        onClick={() => navigate('/login?portal=citizen')}
                    >
                        Start Reporting — It's Free <ArrowRight size={18} />
                    </button>
                    <button 
                        style={styles.heroBtnSecondary}
                        onClick={() => navigate('/login?portal=citizen')}
                    >
                        See Issues Near Me
                    </button>
                </div>
                <p style={styles.heroTrustLine}>
                    Join 10,000+ citizens already making their streets better
                </p>
            </section>

            {/* Social Proof Bar */}
            <section style={styles.socialProofBar}>
                <div style={styles.socialProofContent}>
                    <span style={styles.proofItem}>🏙️ 50+ Cities</span>
                    <span style={styles.proofDivider}>|</span>
                    <span style={styles.proofItem}>📋 12,000+ Issues Reported</span>
                    <span style={styles.proofDivider}>|</span>
                    <span style={styles.proofItem}>✅ 8,400+ Resolved</span>
                    <span style={styles.proofDivider}>|</span>
                    <span style={styles.proofItem}><Star size={15} fill="#f59e0b" color="#f59e0b" style={{display:'inline', marginRight:4}} />4.8 Rating</span>
                </div>
            </section>

            {/* Problem Section */}
            <section id="problem" style={styles.problemSection}>
                <h2 style={styles.sectionTitle}>
                    Your city has problems. <br />
                    <span style={{ color: '#ef4444' }}>Reporting them shouldn't be one of them.</span>
                </h2>
                <div style={styles.problemGrid}>
                    <div style={styles.problemCard}>
                        <div style={styles.problemEmoji}>📞</div>
                        <h4 style={styles.problemTitle}>Calling helplines that never answer</h4>
                        <p style={styles.problemDesc}>
                            You wait on hold for 30 minutes just to be told "we'll look into it." Nothing happens.
                        </p>
                    </div>
                    <div style={styles.problemCard}>
                        <div style={styles.problemEmoji}>📝</div>
                        <h4 style={styles.problemTitle}>Filling forms nobody reads</h4>
                        <p style={styles.problemDesc}>
                            Online complaint portals that feel like tax filings. You submit and never hear back.
                        </p>
                    </div>
                    <div style={styles.problemCard}>
                        <div style={styles.problemEmoji}>😤</div>
                        <h4 style={styles.problemTitle}>Watching the same pothole for months</h4>
                        <p style={styles.problemDesc}>
                            You've seen it. Your neighbors have seen it. Yet somehow, nobody in charge has.
                        </p>
                    </div>
                </div>
            </section>

            {/* Solution / How it Works Section */}
            <section id="about" style={styles.solutionSection}>
                <div style={styles.solutionGlow} />
                <h2 style={styles.sectionTitle}>
                    We built the platform your city deserved all along.
                </h2>
                <p style={styles.sectionSubtitle}>
                    StreetVoice connects citizens directly to action — with AI, community power, and real accountability.
                </p>

                <div style={styles.stepsContainer}>
                    {[
                        {
                            num: "01",
                            title: "Snap a Photo",
                            desc: "Take a photo of the issue right where you are. No forms. No typing. Just point and shoot.",
                            icon: "📸"
                        },
                        {
                            num: "02",
                            title: "AI Does the Heavy Lifting",
                            desc: "Gemini AI instantly reads your photo, identifies the issue, assigns a category and severity — automatically.",
                            icon: "🤖"
                        },
                        {
                            num: "03",
                            title: "Community Backs You Up",
                            desc: "Neighbors nearby can verify the same issue. Three verifications = automatic escalation to authorities. You're not alone.",
                            icon: "🤝"
                        },
                        {
                            num: "04",
                            title: "Watch It Get Fixed",
                            desc: "Track status updates in real time. Get notified when work begins. Celebrate when it's resolved.",
                            icon: "✅"
                        }
                    ].map((step, index) => (
                        <div key={index} style={styles.stepCard}>
                            <div style={styles.stepHeader}>
                                <span style={styles.stepNum}>{step.num}</span>
                                <span style={styles.stepIcon}>{step.icon}</span>
                            </div>
                            <h4 style={styles.stepTitle}>Step {index + 1} — {step.title}</h4>
                            <p style={styles.stepDesc}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={styles.featuresSection}>
                <h2 style={styles.sectionTitle}>Everything your city needs. <span style={styles.gradientText}>Nothing it doesn't.</span></h2>
                <div style={styles.featuresGrid}>
                    {[
                        {
                            icon: <Zap size={22} color="#3b82f6" />,
                            title: "Live Issue Map",
                            desc: "See every reported problem in your area on a real-time map. Color-coded by severity. Updated the moment something changes."
                        },
                        {
                            icon: <Zap size={22} color="#f59e0b" />,
                            title: "AI-Powered Categorization",
                            desc: "No need to describe anything. Our AI reads your photo and figures out the rest — category, severity, summary. Done."
                        },
                        {
                            icon: <Users size={22} color="#10b981" />,
                            title: "Community Verification",
                            desc: "When neighbors confirm the same issue, it gets prioritized faster. Democracy in action, one tap at a time."
                        },
                        {
                            icon: <BarChart2 size={22} color="#ec4899" />,
                            title: "Public Accountability Dashboard",
                            desc: "See how many issues were reported, how fast they were fixed, and which wards are performing — all publicly visible."
                        },
                        {
                            icon: <Trophy size={22} color="#a855f7" />,
                            title: "Earn While You Help",
                            desc: "Rack up XP, unlock badges, and climb the leaderboard just by being a good citizen. Civic duty never felt this good."
                        },
                        {
                            icon: <Clock size={22} color="#06b6d4" />,
                            title: "Real-Time Updates",
                            desc: "The moment an authority updates your issue status, you know. No more wondering if anyone even saw your report."
                        }
                    ].map((f, i) => (
                        <div key={i} style={styles.featureCard}>
                            <div style={styles.featureIconContainer}>{f.icon}</div>
                            <h4 style={styles.featureCardTitle}>{f.title}</h4>
                            <p style={styles.featureCardDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Section */}
            <section style={styles.comparisonSection}>
                <h2 style={styles.sectionTitle}>The old way vs. the StreetVoice way</h2>
                <div style={styles.comparisonTableContainer}>
                    <table style={styles.comparisonTable}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={styles.tableHeader}>OLD WAY</th>
                                <th style={{ ...styles.tableHeader, color: '#60a5fa' }}>STREETVOICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ["Call a helpline → hold music", "Report in 30 seconds"],
                                ["Fill a 6-page form", "Take one photo"],
                                ["Wait weeks for acknowledgement", "AI responds instantly"],
                                ["No updates, ever", "Real-time status tracking"],
                                ["One person complaining", "Whole community backing you"],
                                ["Authority ignores it", "Public dashboard holds them accountable"],
                                ["Issue stays for months", "Average resolution: 12 days"]
                            ].map((row, idx) => (
                                <tr key={idx} style={styles.tableRow}>
                                    <td style={styles.tableCellOld}>❌ {row[0]}</td>
                                    <td style={styles.tableCellNew}>✨ {row[1]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Testimonials / Impact Section */}
            <section id="impact" style={styles.impactSection}>
                <h2 style={styles.sectionTitle}>Real streets. Real people. Real change.</h2>
                <div style={styles.impactGrid}>
                    {[
                        {
                            quote: "I reported a pothole on my street that had been there for 8 months. Three neighbors verified it. It was filled within 11 days. I couldn't believe it actually worked.",
                            author: "Priya M.",
                            role: "Bengaluru Citizen"
                        },
                        {
                            quote: "As a ward councillor, StreetVoice changed how we work. We now respond to issues with data, not guesswork. Our resolution rate went from 34% to 81% in 3 months.",
                            author: "Councillor Rajan K.",
                            role: "Hyderabad"
                        },
                        {
                            quote: "My son nearly fell off his cycle because of a broken drain cover. I reported it at 9pm. By next morning it had 7 verifications. Fixed within the week.",
                            author: "Suresh T.",
                            role: "Chennai Citizen"
                        }
                    ].map((t, i) => (
                        <div key={i} style={styles.impactCard}>
                            <p style={styles.impactQuote}>"{t.quote}"</p>
                            <div style={styles.impactAuthorBox}>
                                <div style={styles.avatarMini}>{t.author[0]}</div>
                                <div>
                                    <p style={styles.impactAuthor}>{t.author}</p>
                                    <p style={styles.impactRole}>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gateway & For Authorities Section */}
            <section id="authorities" style={styles.authoritySection}>
                <div style={styles.authGlow} />
                <div style={styles.authLayout}>
                    <div style={styles.authContentLeft}>
                        <h2 style={styles.authTitle}>Built for citizens. <br /><span style={styles.gradientText}>Powerful for authorities.</span></h2>
                        <p style={styles.authSubtitle}>
                            StreetVoice isn't just a complaint box. It's a complete issue management system for local government.
                        </p>
                        <div style={styles.authBulletList}>
                            {[
                                { title: "Prioritized Issue Queue", desc: "Stop guessing what matters most. Issues are ranked by severity, verification count, and community impact." },
                                { title: "Ward-level Analytics", desc: "See which areas need the most attention and track your team's resolution performance over time." },
                                { title: "Status Update Tools", desc: "Assign issues, update progress, set estimated resolution dates — all visible to citizens in real time." },
                                { title: "Public Accountability Score", desc: "Your responsiveness is publicly rated. The best-performing wards get recognized. The lagging ones get noticed." }
                            ].map((b, i) => (
                                <div key={i} style={styles.authBullet}>
                                    <span style={styles.checkIcon}><Check size={14} color="#10b981" /></span>
                                    <div>
                                        <h5 style={styles.bulletTitle}>{b.title}</h5>
                                        <p style={styles.bulletDesc}>{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            style={styles.authCTA}
                            onClick={() => navigate('/login?portal=authority')}
                        >
                            Request Authority Access <ArrowRight size={16} />
                        </button>
                    </div>
                    
                    {/* Visual Portal Selector Card */}
                    <div style={styles.authCardRight}>
                        <h3 style={styles.portalBoxTitle}>Choose Your Access Portal</h3>
                        
                        <div style={styles.portalTile} onClick={() => navigate('/login?portal=citizen')}>
                            <div style={styles.portalTileIconBlue}>📍</div>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={styles.portalTileTitle}>Citizen Portal</h4>
                                <p style={styles.portalTileDesc}>Report issues, upvote, verify and help improve your ward.</p>
                            </div>
                        </div>

                        <div style={styles.portalTile} onClick={() => navigate('/login?portal=authority')}>
                            <div style={styles.portalTileIconPurple}>🏛️</div>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={styles.portalTileTitle}>Authority Portal</h4>
                                <p style={styles.portalTileDesc}>Resolve tickets, update progress and manage resolution scores.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gamification Section */}
            <section style={styles.gamificationSection}>
                <div style={styles.gameContent}>
                    <div style={styles.fireBadge}><Flame size={20} fill="#f97316" color="#f97316" style={{marginRight:6}} />Gamification</div>
                    <h2 style={styles.sectionTitle}>Good citizenship should feel rewarding. <br /><span style={{color: '#f59e0b'}}>It does on StreetVoice.</span></h2>
                    
                    <div style={styles.gameBenefitsGrid}>
                        <div style={styles.gameStatCard}>
                            <h3>+10 XP</h3>
                            <p>Every report earns you experience points</p>
                        </div>
                        <div style={styles.gameStatCard}>
                            <h3>+5 XP</h3>
                            <p>Every verification adds to your score</p>
                        </div>
                        <div style={styles.gameStatCard}>
                            <h3>🎖️ Hero</h3>
                            <p>Every resolved issue makes you a local hero</p>
                        </div>
                    </div>

                    <p style={styles.gameParagraph}>
                        Climb from <strong>Street Reporter</strong> &rarr; <strong>Civic Hero</strong> &rarr; <strong>Community Legend</strong>. Unlock badges. Top the leaderboard. Make your ward proud.
                    </p>
                    <p style={styles.gameFooterText}>
                        Because the people who make cities better deserve to be seen.
                    </p>
                </div>
            </section>

            {/* Final CTA Section */}
            <section style={styles.finalCTASection}>
                <div style={styles.finalGlow} />
                <h2 style={styles.finalTitle}>Your street is waiting.</h2>
                <p style={styles.finalSubtitle}>
                    One photo. One tap. One step closer to the city you deserve. <br />
                    It takes 30 seconds to report an issue. It takes a community to fix one. Be part of it.
                </p>
                <div style={styles.heroActions}>
                    <button 
                        style={styles.heroBtnPrimary}
                        onClick={() => navigate('/login?portal=citizen')}
                    >
                        Report Your First Issue — Free <ArrowRight size={18} />
                    </button>
                    <button 
                        style={styles.heroBtnSecondary}
                        onClick={() => navigate('/login?portal=citizen')}
                    >
                        View the Live Map
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    <p style={styles.footerLogo}>📍 StreetVoice</p>
                    <p style={styles.footerText}>
                        Made for citizens. Built with purpose. <br />
                        <strong>StreetVoice</strong> — Because every street deserves attention.
                    </p>
                    <div style={styles.divider} />
                    <p style={styles.copyright}>
                        &copy; 2026 StreetVoice. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#090a10',
        color: '#fff',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
    },
    navBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(9, 10, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    logoIcon: {
        fontSize: '1.45rem'
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '900',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    navLinks: {
        display: 'none', // hidden on mobile, block on desktop via CSS in next steps or just standard flex
        alignItems: 'center',
        gap: '2rem'
    },
    navLink: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'color 0.2s'
    },
    navCTA: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        background: 'rgba(59, 130, 246, 0.1)',
        color: '#60a5fa',
        fontWeight: '700',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    heroSection: {
        position: 'relative',
        textAlign: 'center',
        padding: '6rem 1.5rem 4rem',
        maxWidth: '850px',
        margin: '0 auto',
        boxSizing: 'border-box'
    },
    heroGlow: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0) 70%)',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
    },
    heroTitle: {
        fontSize: '3.6rem',
        fontWeight: '950',
        lineHeight: '1.1',
        margin: '0 0 1.5rem',
        letterSpacing: '-0.04em'
    },
    gradientText: {
        background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    heroSubtitle: {
        fontSize: '1.15rem',
        color: '#94a3b8',
        lineHeight: '1.6',
        margin: '0 0 2.5rem',
        fontWeight: '400'
    },
    heroActions: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1.5rem'
    },
    heroBtnPrimary: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.95rem 1.75rem',
        borderRadius: '12px',
        background: 'linear-gradient(to right, #2563eb, #3b82f6)',
        color: '#fff',
        border: 'none',
        fontWeight: '800',
        cursor: 'pointer',
        fontSize: '1rem',
        boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
        transition: 'transform 0.2s'
    },
    heroBtnSecondary: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.95rem 1.75rem',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background 0.2s'
    },
    heroTrustLine: {
        fontSize: '0.85rem',
        color: '#64748b',
        fontWeight: '600',
        margin: 0
    },
    socialProofBar: {
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.01)',
        padding: '1rem'
    },
    socialProofContent: {
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        fontSize: '0.88rem',
        fontWeight: '700',
        color: '#94a3b8'
    },
    proofItem: {
        display: 'flex',
        alignItems: 'center'
    },
    proofDivider: {
        color: 'rgba(255,255,255,0.1)',
        display: 'none' // hidden on wrapping screens, handled via layout flex wrap
    },
    problemSection: {
        padding: '5rem 1.5rem',
        maxWidth: '950px',
        margin: '0 auto',
        textAlign: 'center'
    },
    sectionTitle: {
        fontSize: '2.2rem',
        fontWeight: '900',
        lineHeight: '1.2',
        margin: '0 0 1rem',
        letterSpacing: '-0.03em'
    },
    sectionSubtitle: {
        fontSize: '1.05rem',
        color: '#94a3b8',
        maxWidth: '600px',
        margin: '0 auto 3rem',
        lineHeight: '1.6'
    },
    problemGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
    },
    problemCard: {
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'left'
    },
    problemEmoji: {
        fontSize: '2rem',
        marginBottom: '1rem'
    },
    problemTitle: {
        fontSize: '1.1rem',
        fontWeight: '800',
        margin: '0 0 0.5rem',
        color: '#f8fafc'
    },
    problemDesc: {
        fontSize: '0.88rem',
        color: '#64748b',
        lineHeight: '1.5',
        margin: 0
    },
    solutionSection: {
        position: 'relative',
        padding: '5rem 1.5rem',
        background: 'radial-gradient(ellipse at bottom, rgba(59,130,246,0.05) 0%, rgba(9,10,16,0) 70%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
    },
    solutionGlow: {
        position: 'absolute',
        width: '500px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, rgba(0,0,0,0) 70%)',
        bottom: 0,
        right: 0
    },
    stepsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1000px',
        margin: '3rem auto 0'
    },
    stepCard: {
        background: 'rgba(30, 41, 59, 0.35)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'left',
        backdropFilter: 'blur(8px)'
    },
    stepHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem'
    },
    stepNum: {
        fontSize: '1.8rem',
        fontWeight: '900',
        color: 'rgba(255,255,255,0.08)',
        fontFamily: 'monospace'
    },
    stepIcon: {
        fontSize: '1.5rem'
    },
    stepTitle: {
        fontSize: '1rem',
        fontWeight: '800',
        margin: '0 0 0.5rem',
        color: '#f8fafc'
    },
    stepDesc: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        lineHeight: '1.5',
        margin: 0
    },
    featuresSection: {
        padding: '5rem 1.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '3rem'
    },
    featureCard: {
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'left',
        transition: 'border-color 0.2s'
    },
    featureIconContainer: {
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
    },
    featureCardTitle: {
        fontSize: '1.05rem',
        fontWeight: '800',
        margin: '0 0 0.5rem',
        color: '#f8fafc'
    },
    featureCardDesc: {
        fontSize: '0.85rem',
        color: '#64748b',
        lineHeight: '1.5',
        margin: 0
    },
    comparisonSection: {
        padding: '5rem 1.5rem',
        maxWidth: '850px',
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    comparisonTableContainer: {
        marginTop: '3rem',
        overflowX: 'auto',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(30, 41, 59, 0.25)',
        backdropFilter: 'blur(8px)'
    },
    comparisonTable: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        minWidth: '500px'
    },
    tableHeaderRow: {
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },
    tableHeader: {
        padding: '1.25rem 1.5rem',
        fontSize: '0.9rem',
        fontWeight: '800',
        letterSpacing: '0.05em'
    },
    tableRow: {
        borderBottom: '1px solid rgba(255,255,255,0.04)'
    },
    tableCellOld: {
        padding: '1.1rem 1.5rem',
        fontSize: '0.9rem',
        color: '#f43f5e',
        fontWeight: '500'
    },
    tableCellNew: {
        padding: '1.1rem 1.5rem',
        fontSize: '0.9rem',
        color: '#10b981',
        fontWeight: '700'
    },
    impactSection: {
        padding: '5rem 1.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    impactGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginTop: '3rem'
    },
    impactCard: {
        background: 'rgba(30, 41, 59, 0.3)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '200px'
    },
    impactQuote: {
        fontSize: '0.95rem',
        color: '#94a3b8',
        lineHeight: '1.6',
        margin: '0 0 1.5rem',
        fontStyle: 'italic'
    },
    impactAuthorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    avatarMini: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(96, 165, 250, 0.1)',
        border: '1px solid rgba(96, 165, 250, 0.2)',
        color: '#60a5fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '0.95rem'
    },
    impactAuthor: {
        fontSize: '0.88rem',
        fontWeight: '700',
        margin: 0,
        color: '#f8fafc'
    },
    impactRole: {
        fontSize: '0.75rem',
        color: '#64748b',
        margin: 0
    },
    authoritySection: {
        position: 'relative',
        padding: '6rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(to bottom, #090a10 0%, #0d0c1b 100%)'
    },
    authGlow: {
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(0,0,0,0) 70%)',
        top: '50px',
        right: '50px',
        pointerEvents: 'none'
    },
    authLayout: {
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4rem'
    },
    authContentLeft: {
        flex: '1 1 500px',
        textAlign: 'left'
    },
    authTitle: {
        fontSize: '2.5rem',
        fontWeight: '900',
        lineHeight: '1.15',
        margin: '0 0 1.25rem',
        letterSpacing: '-0.03em'
    },
    authSubtitle: {
        fontSize: '1.05rem',
        color: '#94a3b8',
        lineHeight: '1.6',
        margin: '0 0 2.5rem'
    },
    authBulletList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginBottom: '2.5rem'
    },
    authBullet: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
    },
    checkIcon: {
        flexShrink: 0,
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2px'
    },
    bulletTitle: {
        fontSize: '0.98rem',
        fontWeight: '800',
        margin: '0 0 0.25rem',
        color: '#f8fafc'
    },
    bulletDesc: {
        fontSize: '0.85rem',
        color: '#64748b',
        lineHeight: '1.4',
        margin: 0
    },
    authCTA: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.95rem 1.75rem',
        borderRadius: '12px',
        background: 'linear-gradient(to right, #7c3aed, #8b5cf6)',
        color: '#fff',
        border: 'none',
        fontWeight: '800',
        cursor: 'pointer',
        fontSize: '0.95rem',
        boxShadow: '0 4px 20px rgba(124,58,237,0.3)'
    },
    authCardRight: {
        flex: '1 1 350px',
        background: 'rgba(30, 41, 59, 0.45)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        boxShadow: '0 10px 45px rgba(0,0,0,0.3)'
    },
    portalBoxTitle: {
        fontSize: '1.25rem',
        fontWeight: '800',
        margin: '0 0 0.5rem',
        letterSpacing: '-0.01em'
    },
    portalTile: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.1rem',
        background: 'rgba(15, 23, 42, 0.4)',
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'transform 0.2s, border-color 0.2s'
    },
    portalTileIconBlue: {
        fontSize: '1.8rem',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    portalTileIconPurple: {
        fontSize: '1.8rem',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: 'rgba(168, 85, 247, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    portalTileTitle: {
        fontSize: '1rem',
        fontWeight: '800',
        margin: '0 0 0.2rem'
    },
    portalTileDesc: {
        fontSize: '0.78rem',
        color: '#64748b',
        margin: 0,
        lineHeight: '1.3'
    },
    gamificationSection: {
        padding: '6rem 1.5rem',
        background: '#07080d',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
    },
    gameContent: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    fireBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '0.8rem',
        fontWeight: '800',
        color: '#f97316',
        background: 'rgba(249, 115, 22, 0.1)',
        border: '1px solid rgba(249, 115, 22, 0.2)',
        padding: '0.35rem 0.75rem',
        borderRadius: '20px',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    gameBenefitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginTop: '3rem',
        marginBottom: '2.5rem'
    },
    gameStatCard: {
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '16px',
        padding: '1.75rem 1.5rem'
    },
    gameParagraph: {
        fontSize: '1.1rem',
        color: '#94a3b8',
        lineHeight: '1.6',
        marginBottom: '0.5rem'
    },
    gameFooterText: {
        fontSize: '0.9rem',
        color: '#64748b',
        fontWeight: '600'
    },
    finalCTASection: {
        position: 'relative',
        textAlign: 'center',
        padding: '7rem 1.5rem',
        background: 'radial-gradient(circle at center, rgba(59,130,246,0.07) 0%, rgba(9,10,16,0) 70%)',
        borderTop: '1px solid rgba(255,255,255,0.06)'
    },
    finalGlow: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(0,0,0,0) 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
    },
    finalTitle: {
        fontSize: '2.8rem',
        fontWeight: '900',
        marginBottom: '1rem',
        letterSpacing: '-0.03em'
    },
    finalSubtitle: {
        fontSize: '1.1rem',
        color: '#94a3b8',
        lineHeight: '1.6',
        maxWidth: '650px',
        margin: '0 auto 2.5rem'
    },
    footer: {
        background: '#04060b',
        padding: '4rem 2rem 2.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center'
    },
    footerContent: {
        maxWidth: '900px',
        margin: '0 auto'
    },
    footerLogo: {
        fontSize: '1.25rem',
        fontWeight: '900',
        color: '#fff',
        margin: '0 0 0.75rem'
    },
    footerText: {
        fontSize: '0.88rem',
        color: '#64748b',
        maxWidth: '500px',
        margin: '0 auto 2rem',
        lineHeight: '1.6'
    },
    divider: {
        height: '1px',
        background: 'rgba(255,255,255,0.06)',
        margin: '2rem 0'
    },
    copyright: {
        fontSize: '0.78rem',
        color: '#475569',
        margin: 0
    }
};
