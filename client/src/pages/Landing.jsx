import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
    MapPin, ChevronRight, Search, Sparkles, Archive, Trash2,
    Paperclip, MoreHorizontal, Reply, Forward, Menu, X, ArrowRight
} from 'lucide-react';

// Custom SVG Brand Icons to avoid lucide-react export mismatches in older versions
const InstagramIcon = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
    </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

// Shared Primitives
const AppleLogo = ({ className = "w-4 h-4" }) => (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
);

const LogoMark = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 256 256" fill="currentColor" className={className}>
        <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
    </svg>
);

const AppleButton = ({ label = "Continue to StreetVoice", full = false, onClick }) => (
    <button 
        onClick={onClick}
        className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer ${full ? 'w-full' : ''}`}
    >
        <AppleLogo className="w-4 h-4 text-black" />
        <span>{label}</span>
        <ChevronRight size={16} className="transition-transform group-hover:translate-x-[2px]" />
    </button>
);

const SectionEyebrow = ({ label, tag }) => (
    <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">{label}</span>
        {tag && (
            <span className="px-2.5 py-0.5 rounded-full border border-white/10 text-white/50 text-[10px] uppercase font-bold tracking-wider">
                {tag}
            </span>
        )}
    </div>
);

export default function Landing() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Refs for scrolling to sections
    const aboutRef = useRef(null);
    const triageRef = useRef(null);
    const testimonialsRef = useRef(null);
    const contactRef = useRef(null);

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'authority' || user.role === 'moderator') {
                navigate('/authority', { replace: true });
            } else {
                navigate('/home', { replace: true });
            }
        }
    }, [user, loading, navigate]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        navigate(`/login?portal=citizen${email ? `&email=${encodeURIComponent(email)}` : ''}`);
    };

    const scrollToSection = (ref) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const gradientStyle = {
        backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        filter: 'url(#c3-noise)',
    };

    const navItems = [
        { label: 'About Us', ref: aboutRef },
        { label: 'Triage', ref: triageRef },
        { label: 'Testimonials', ref: testimonialsRef },
        { label: 'Contact', ref: contactRef }
    ];

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white selection:bg-brand/30">
            {/* Global background video (fixed behind everything) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover pointer-events-none opacity-40"
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
                />
            </div>

            {/* Hidden-on-mobile fixed vertical guide lines at 36rem edges */}
            <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
            <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

            {/* Root SVG Filter for grainy multiplier */}
            <svg className="absolute w-0 h-0 pointer-events-none">
                <defs>
                    <filter id="c3-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
                        <feComposite in2="SourceGraphic" operator="in" result="noise" />
                        <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
                    </filter>
                </defs>
            </svg>

            {/* SECTION 1 — NAVBAR */}
            <motion.header 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-50 max-w-6xl mx-auto px-6 pt-6"
            >
                <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between">
                    {/* Left: LogoMark only */}
                    <div 
                        className="flex items-center cursor-pointer text-white hover:text-brand transition-colors"
                        onClick={() => navigate('/')}
                    >
                        <LogoMark className="w-8 h-8" />
                    </div>

                    {/* Center: Relevant links */}
                    <nav className="hidden md:flex gap-8">
                        {navItems.map((item, i) => (
                            <motion.button
                                key={item.label}
                                onClick={() => scrollToSection(item.ref)}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                                className="text-white/70 text-sm font-semibold hover:text-white transition-colors cursor-pointer bg-none border-none"
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>

                    {/* Right: AppleButton / Mobile trigger */}
                    <div className="hidden md:block">
                        <AppleButton label="Continue to StreetVoice" onClick={() => navigate('/login?portal=citizen')} />
                    </div>

                    <div className="md:hidden">
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-3 liquid-glass rounded-2xl p-6 flex flex-col gap-4 relative z-40"
                        >
                            {navItems.map((item) => (
                                <button 
                                    key={item.label}
                                    onClick={() => { setMobileMenuOpen(false); scrollToSection(item.ref); }}
                                    className="text-white/80 hover:text-white text-base font-semibold text-left bg-none border-none cursor-pointer"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <AppleButton label="Continue to StreetVoice" full onClick={() => navigate('/login?portal=citizen')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* SECTION 2 — HERO */}
            <section ref={aboutRef} className="relative z-10 max-w-4xl mx-auto pt-20 md:pt-36 pb-20 text-center flex flex-col items-center px-6">
                <motion.h1 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-8xl font-extrabold tracking-tight leading-[0.9] text-white"
                >
                    Your street.<br />
                    <span className="animate-shiny" style={gradientStyle}>Revitalized</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8 text-white/60 max-w-md text-base md:text-lg leading-[1.6]"
                >
                    StreetVoice is the premier civic platform for the current era. 
                    It leverages powerful AI to organize, prioritize, and resolve 
                    community issues into total clarity.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="mt-8 flex flex-col items-center gap-3"
                >
                    <AppleButton label="Continue to StreetVoice" onClick={() => navigate('/login?portal=citizen')} />
                    <span className="text-xs text-white/40 font-semibold tracking-wide">
                        Free access for all citizens and ward committees
                    </span>
                </motion.div>
            </section>

            {/* SECTION 3 — macOS MENU BAR STRIP */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="relative z-20 w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
            >
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs font-semibold tracking-wide">
                    <div className="flex items-center gap-5">
                        <AppleLogo className="w-3.5 h-3.5 text-white" />
                        <span className="bold text-white font-extrabold">StreetVoice</span>
                        {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((item, idx) => (
                            <span 
                                key={item} 
                                className={`text-white/60 hover:text-white cursor-pointer ${
                                    idx > 2 ? (idx > 3 ? 'hidden md:inline' : 'hidden sm:inline') : 'inline'
                                }`}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                        <Search size={13} className="text-white" />
                        <span>Wed May 6 1:09 PM</span>
                    </div>
                </div>
            </motion.div>

            {/* SECTION 4 — INBOX MOCKUP (Civic Dash Mockup with Simplified Sidebar) */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
                    className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
                >
                    {/* Window Title Bar */}
                    <div className="bg-black/30 px-4 py-3 flex items-center border-b border-white/5 relative">
                        <div className="flex items-center gap-1.5 absolute left-4">
                            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="mx-auto text-xs text-white/50 font-semibold tracking-wider">
                            StreetVoice — Civic Workspace
                        </span>
                    </div>

                    {/* App Window Grid */}
                    <div className="grid grid-cols-12 h-[520px] text-sm overflow-hidden">
                        {/* Sidebar (col-span-3) — inbox/resolved/etc removed */}
                        <div className="col-span-3 border-r border-white/5 bg-black/30 p-4 flex flex-col justify-between">
                            <div className="flex flex-col gap-6">
                                <button 
                                    onClick={() => navigate('/report')}
                                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-bold px-3 py-2.5 hover:bg-white/90 active:scale-[0.97] transition-all cursor-pointer"
                                >
                                    <Sparkles size={14} className="text-black" />
                                    <span>Report with StreetVoice</span>
                                </button>
                                
                                <div className="flex flex-col gap-3 mt-4">
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/40">
                                        Wards & Sectors
                                    </span>
                                    <div className="flex flex-col gap-2.5">
                                        {[
                                            { label: 'Ward 12', color: '#3D81E3' },
                                            { label: 'National Highway', color: '#A4F4FD' },
                                            { label: 'Central Park', color: '#f59e0b' },
                                            { label: 'Water Board', color: '#10b981' },
                                        ].map((label) => (
                                            <div key={label.label} className="flex items-center gap-2 cursor-pointer text-white/60 hover:text-white transition-colors">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                                                <span className="text-xs font-medium">{label.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message list (col-span-4) */}
                        <div className="col-span-4 border-r border-white/5 bg-black/10 flex flex-col">
                            {/* Search Header */}
                            <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-black/20">
                                <Search size={14} className="text-white/40" />
                                <input 
                                    type="text" 
                                    placeholder="Search civic cases"
                                    className="bg-transparent text-xs text-white placeholder:text-white/40 outline-none w-full"
                                />
                            </div>

                            {/* Scrollable Feed */}
                            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                                {[
                                    { name: "Sophia Chen", title: "Pothole on Lake Road", preview: "Dangerous pothole near the subway exit is expanding...", time: "9:41 AM", unread: true, active: true },
                                    { name: "Sophia Chen", title: "Streetlight out near Metro", preview: "No light for 3 nights, causing safety concerns...", time: "8:12 AM", unread: true },
                                    { name: "Figma", title: "Garbage overflow near school", preview: "Trash piling up near the primary school gate...", time: "Yesterday" },
                                    { name: "Stripe", title: "Water leakage near Banjara Hills", preview: "Water leaking from main pipeline, flooding road...", time: "Yesterday" },
                                    { name: "Vercel", title: "Open sewage drain in Gachibowli", preview: "Open drain posing hazard to pedestrians...", time: "Mon" },
                                    { name: "GitHub", title: "Encroachment on footpath", preview: "Temporary structures blocking the walkway...", time: "Mon" },
                                ].map((msg, i) => (
                                    <div 
                                        key={i}
                                        className={`p-3.5 flex flex-col gap-1 cursor-pointer transition-colors ${
                                            msg.active ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5">
                                                {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                                                <span className={`text-xs ${msg.unread ? 'font-bold text-white' : 'text-white/70'}`}>
                                                    {msg.name}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-white/40">{msg.time}</span>
                                        </div>
                                        <h4 className="text-xs font-semibold text-white truncate">{msg.title}</h4>
                                        <p className="text-[11px] text-white/50 truncate">{msg.preview}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reader (col-span-5) */}
                        <div className="col-span-5 flex flex-col h-full bg-[#0d0e12]">
                            {/* Reader Toolbar */}
                            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/20">
                                <div className="flex items-center gap-2">
                                    {[Reply, Forward, Archive, Trash2].map((Icon, idx) => (
                                        <button key={idx} className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer">
                                            <Icon size={14} />
                                        </button>
                                    ))}
                                </div>
                                <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>

                            {/* Reader Body */}
                            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                                {/* Subject Header */}
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">
                                        Pothole on Lake Road
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center font-bold text-xs text-white">
                                                L
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">Sophia Chen</p>
                                                <p className="text-[10px] text-white/55">to me · 9:41 AM</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full border border-[#00d2ff]/20 bg-[#00d2ff]/5 text-[#00d2ff] text-[10px] font-bold">
                                            Ward 12
                                        </span>
                                    </div>
                                </div>

                                {/* Summary Card by AI */}
                                <div className="rounded-xl border border-[#A4F4FD]/10 bg-[#A4F4FD]/5 p-4 flex gap-3">
                                    <Sparkles size={16} className="text-[#A4F4FD] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-xs font-bold text-white">Summary by StreetVoice</h4>
                                        <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                                            Category: Pothole. Severity: Critical. Verification: 3 neighbor votes. 
                                            Action required by GHMC Road Division.
                                        </p>
                                    </div>
                                </div>

                                {/* Text Body */}
                                <div className="text-xs text-white/80 space-y-4 leading-relaxed font-medium">
                                    <p>Hi team,</p>
                                    <p>
                                        I am reporting a severe pothole at Lake Road, Banjara Hills. It has been 
                                        getting larger over the last week and is causing major traffic blocks during 
                                        peak hours.
                                    </p>
                                    <p>
                                        Several motorcyclists have had close calls trying to avoid it at night. 
                                        Please dispatch the ward engineer to inspect and fill this as soon as possible.
                                    </p>
                                    
                                    {/* Attachment */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-semibold text-white/60 hover:text-white cursor-pointer transition-colors">
                                        <Paperclip size={12} />
                                        <span>photo-evidence.jpg</span>
                                    </div>

                                    <p className="text-white/55 mt-4 pt-4 border-t border-white/5">— Sophia Chen</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* SECTION 5 — FEATURE TRIAGE */}
            <section ref={triageRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
                    {/* Left Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col items-start"
                    >
                        <SectionEyebrow label="Triage" tag="AI-native" />
                        <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                            Clear the streets<br />in a single pass.
                        </h2>
                        <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
                            StreetVoice reads every report, understands intent, and routes the noise 
                            away from the signal. Focus on what moves your neighborhood forward — 
                            the rest handles itself.
                        </p>
                        {/* Chips Row */}
                        <div className="flex flex-wrap gap-2.5 mt-8 max-w-md">
                            {["Auto-categorize", "Escalate to authorities", "Silent notifications", "One-tap verifications"].map((chip) => (
                                <span 
                                    key={chip}
                                    className="text-xs text-white/70 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] font-semibold hover:border-white/20 transition-all"
                                >
                                    {chip}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className="liquid-glass rounded-2xl p-5 w-full flex flex-col gap-4 border border-white/10">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/40">
                            Today · 42 issues triaged
                        </span>
                        
                        {[
                            { title: "Priority (4)", color: "#ffffff", items: ["Sophia Chen — Water Main Break", "David Lim — Broken Traffic Light"] },
                            { title: "Verify (7)", color: "#e5e5e5", items: ["Marcus — Pothole", "Figma — Garbage Pile"] },
                            { title: "Updates (18)", color: "#a3a3a3", items: ["GHMC — Dispatch Ready", "Water Board — Pipeline Merged"] },
                            { title: "Resolved (13)", color: "#525252", items: ["Streetlight fixed · Footpath cleared · Drain covered"] },
                        ].map((category, idx) => (
                            <div 
                                key={idx}
                                className="liquid-glass rounded-xl p-4 flex flex-col gap-2 border border-white/5 bg-white/[0.01]"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                                    <span className="text-xs font-bold" style={{ color: category.color }}>{category.title}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 pl-4">
                                    {category.items.map((item, i) => (
                                        <p key={i} className="text-xs text-white/70 font-semibold">{item}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 6 — LOGO CLOUD */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
                <p className="text-xs uppercase tracking-widest text-white/40 font-extrabold">
                    Trusted by the world's most thoughtful municipalities
                </p>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 justify-center items-center">
                    {['Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Pune', 'Delhi', 'Kolkata', 'Kochi'].map((city, i) => (
                        <motion.span
                            key={city}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors cursor-pointer"
                        >
                            {city}
                        </motion.span>
                    ))}
                </div>
            </section>

            {/* SECTION 7 — TESTIMONIALS */}
            <section ref={testimonialsRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            quote: "StreetVoice gave our ward leadership team four hours of their week back. It reads like civic engagement from the future.",
                            name: "Parker Wilf",
                            role: "Ward Officer",
                            company: "MERCURY"
                        },
                        {
                            quote: "The command palette alone has changed how we process citizen complaints. I can't imagine going back to paper forms.",
                            name: "Andrew von Rosenbach",
                            role: "Deputy Commissioner",
                            company: "COHERE"
                        },
                        {
                            quote: "Triage that actually understands context. Our team stopped dreading Monday morning mailbags.",
                            name: "Mathies Christensen",
                            role: "City Engineer",
                            company: "LUNAR"
                        }
                    ].map((t, idx) => (
                        <figure 
                            key={idx}
                            className="liquid-glass rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
                        >
                            <blockquote className="text-sm text-white/80 leading-[1.6] font-medium">
                                "{t.quote}"
                            </blockquote>
                            <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-white">{t.name}</p>
                                    <p className="text-xs text-white/50 mt-0.5">{t.role}</p>
                                </div>
                                <span className="text-xs text-white font-extrabold tracking-wider uppercase">
                                    {t.company}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* SECTION 9 — FINAL CTA */}
            <section ref={contactRef} className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10"
                >
                    {/* Radial Glow Overlay */}
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-30"
                        style={{
                            background: "radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)"
                        }}
                    />

                    <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02] text-white">
                        Close the tickets.<br />Open your city.
                    </h2>
                    
                    <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
                        Join thousands of builders, citizens, and ward officers who treat civic 
                        action like a tool — not an obligation.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <AppleButton label="Continue to StreetVoice" onClick={() => navigate('/login?portal=citizen')} />
                        <button 
                            onClick={() => navigate('/login?portal=authority')}
                            className="rounded-full border border-white/15 text-white text-sm font-semibold px-5 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            <span>Talk to authorities</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
