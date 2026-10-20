import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    ArrowRight,
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    User, 
    MapPin, 
    Check, 
    Phone, 
    KeyRound, 
    ShieldCheck, 
    Building2,
    Users,
    Wrench,
    Truck,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { signInWithGoogle } from '../config/firebase';

// Authentic Google Logo SVG
const GoogleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
);

// Apple Logo SVG
const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z"/>
    </svg>
);

// Microsoft Quad-Color Logo SVG
const MicrosoftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#f25022" d="M1 1h10v10H1z"/>
        <path fill="#7fba00" d="M13 1h10v10H13z"/>
        <path fill="#00a4ef" d="M1 13h10v10H1z"/>
        <path fill="#ffb900" d="M13 13h10v10H13z"/>
    </svg>
);

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const portal = searchParams.get('portal') || 'citizen'; // 'citizen' | 'authority'
    const isAuthority = portal === 'authority';

    // Auth Modes: 'signin' | 'signup' | 'otp'
    const [mode, setMode] = useState('signin');
    
    // Form fields
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState(searchParams.get('email') || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ward, setWard] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // OTP fallback fields
    const [otpPhone, setOtpPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDemoModal, setShowDemoModal] = useState(false);

    const { loginWithCredentials, register, loginWithGoogle, loginWithOtp } = useAuth();
    const navigate = useNavigate();

    // Palette tokens tailored to reference
    const theme = isAuthority ? {
        cardBg: '#0f172a',
        leftBg: 'linear-gradient(145deg, #090e17 0%, #131c2e 100%)',
        outerBg: '#090e17',
        brandColor: '#ffffff',
        sparkColor: '#38bdf8',
        taglineColor: '#94a3b8',
        titleColor: '#ffffff',
        subColor: '#94a3b8',
        inputBg: '#1e293b',
        inputBorder: '1px solid rgba(148, 163, 184, 0.2)',
        inputIconColor: '#94a3b8',
        inputTextColor: '#ffffff',
        buttonBg: '#2563eb',
        buttonHover: '#1d4ed8',
        buttonColor: '#ffffff',
        buttonShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
        checkboxColor: '#2563eb',
        dividerLine: 'rgba(148, 163, 184, 0.2)',
        dividerText: '#94a3b8',
        socialCardBg: '#1e293b',
        socialCardShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        footerLinkColor: '#38bdf8'
    } : {
        // Pixel-accurate reference mint/sage palette
        cardBg: '#ffffff',
        leftBg: '#e9f3ec',
        outerBg: '#eaf4ee',
        brandColor: '#173b25',
        sparkColor: '#eab308',
        taglineColor: '#6c8975',
        titleColor: '#183a24',
        subColor: '#5c7a67',
        inputBg: '#e1eee4',
        inputBorder: 'none',
        inputIconColor: '#2b5037',
        inputTextColor: '#163820',
        buttonBg: '#2b5636',
        buttonHover: '#22462b',
        buttonColor: '#ffffff',
        buttonShadow: '0 6px 20px rgba(43, 86, 54, 0.3)',
        checkboxColor: '#2b5636',
        dividerLine: 'rgba(43, 86, 54, 0.22)',
        dividerText: '#50705c',
        socialCardBg: '#ffffff',
        socialCardShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        footerLinkColor: '#183a24'
    };

    const togglePortal = (target) => {
        setSearchParams({ portal: target });
        setError('');
        if (target === 'authority' && mode === 'signup') {
            setMode('signin');
        }
    };

    const handleAuthRedirect = (user) => {
        if (user.role === 'authority' || user.role === 'moderator') {
            toast.success(`Welcome, Officer ${user.name || ''}!`);
            navigate('/authority');
        } else if (user.isNewUser) {
            toast.success('Welcome! Please complete your profile');
            navigate('/setup-profile');
        } else {
            toast.success(`Welcome back, ${user.name || 'Citizen'}!`);
            navigate('/home');
        }
    };

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            const result = await signInWithGoogle();
            const idToken = await result.user.getIdToken();
            
            const googleUser = await loginWithGoogle({
                email: result.user.email,
                name: result.user.displayName,
                googleId: result.user.uid,
                avatar: result.user.photoURL,
                token: idToken
            });

            handleAuthRedirect(googleUser);
        } catch (err) {
            console.error('Google Auth error:', err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Google sign-in popup was closed before completing.');
            } else if (err.code === 'auth/unauthorized-domain') {
                const domain = window.location.hostname;
                setError(`Domain "${domain}" is not authorized. Add "${domain}" in Firebase Console > Authentication > Settings > Authorized domains.`);
                toast.error(`Authorize "${domain}" in Firebase Console`, { duration: 6000 });
            } else {
                setError(err.message || 'Google sign-in failed. Please try again.');
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    // Email or Phone Login
    const handleSignIn = async (e) => {
        e?.preventDefault();
        setError('');

        if (!identifier.trim()) {
            setError(isAuthority ? 'Please enter Officer Email or Department ID' : 'Please enter your email or phone number');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }

        try {
            setLoading(true);
            const user = await loginWithCredentials(identifier.trim(), password);
            handleAuthRedirect(user);
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email/phone or password. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Registration
    const handleSignUp = async (e) => {
        e?.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!identifier.trim()) {
            setError('Please enter an email address or 10-digit phone number');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            const user = await register({
                name: name.trim(),
                identifier: identifier.trim(),
                password,
                role: isAuthority ? 'authority' : 'citizen',
                ward: ward.trim()
            });
            handleAuthRedirect(user);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Phone OTP Flow
    const handleSendOTP = async () => {
        setError('');
        if (!otpPhone || otpPhone.length < 10) {
            setError('Enter a valid 10-digit phone number');
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/auth/send-otp', { phone: otpPhone });
            if (res.data.otp) {
                setOtpCode(res.data.otp);
                toast.success(`OTP: ${res.data.otp} (Auto-filled)`);
            } else {
                toast.success('Mock OTP sent! Use 123456');
            }
            setOtpSent(true);
        } catch (err) {
            setError('Failed to send verification OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setError('');
        if (!otpCode || otpCode.length !== 6) {
            setError('Please enter the 6-digit OTP code');
            return;
        }
        try {
            setLoading(true);
            const user = await loginWithOtp(otpPhone, otpCode);
            handleAuthRedirect(user);
        } catch (err) {
            setError('Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (id, pwd, p) => {
        setMode('signin');
        setIdentifier(id);
        setPassword(pwd);
        setError('');
        setShowDemoModal(false);
        if (p && p !== portal) {
            setSearchParams({ portal: p });
        }
        toast.success(`Loaded credentials for ${id}`);
    };

    return (
        <div style={{ ...styles.pageWrapper, background: theme.outerBg }}>
            {/* Top Gateway Back & Portal Switcher */}
            <header style={styles.topNav}>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ ...styles.backBtn, color: isAuthority ? '#f8fafc' : '#183a24' }}
                >
                    <ArrowLeft size={16} /> Back to Gateway
                </button>

                <div style={styles.portalToggle}>
                    <button
                        type="button"
                        onClick={() => togglePortal('citizen')}
                        style={{
                            ...styles.portalBtn,
                            background: !isAuthority ? '#ffffff' : 'transparent',
                            color: !isAuthority ? '#183a24' : '#64748b',
                            boxShadow: !isAuthority ? '0 2px 10px rgba(0,0,0,0.08)' : 'none',
                            fontWeight: !isAuthority ? '700' : '500'
                        }}
                    >
                        <Users size={14} />
                        <span>Citizen</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => togglePortal('authority')}
                        style={{
                            ...styles.portalBtn,
                            background: isAuthority ? '#2563eb' : 'transparent',
                            color: isAuthority ? '#ffffff' : '#4a6d57',
                            boxShadow: isAuthority ? '0 2px 10px rgba(37,99,235,0.4)' : 'none',
                            fontWeight: isAuthority ? '700' : '500'
                        }}
                    >
                        <Building2 size={14} />
                        <span>Authority</span>
                    </button>
                </div>
            </header>

            {/* Main Split-Screen Container Card */}
            <main style={styles.mainCard}>
                
                {/* ================= LEFT SIDE: CIVIC POSTER & HERO ================= */}
                <div style={{ ...styles.leftPane, background: theme.leftBg }}>
                    {!isAuthority ? (
                        /* CITIZEN POSTER: Exact extracted artwork from reference */
                        <div style={styles.posterContainer}>
                            <img 
                                src="/civic-hero.jpg" 
                                alt="Put Civics into Action - Get involved in your community" 
                                style={styles.heroPosterImg}
                            />
                        </div>
                    ) : (
                        /* AUTHORITY DASHBOARD HERO */
                        <div style={styles.authorityHero}>
                            <div style={styles.authorityBadgeIcon}>
                                <ShieldCheck size={40} color="#38bdf8" />
                            </div>
                            <h2 style={styles.authorityTitle}>
                                PUT CIVIC GOVERNANCE INTO ACTION
                            </h2>
                            <p style={styles.authorityTagline}>
                                RAPID MUNICIPAL TRIAGE • FIELD DISPATCH • 100% TRANSPARENCY
                            </p>

                            <div style={styles.dutyCardsGrid}>
                                <div style={styles.dutyItem}>
                                    <Wrench size={22} color="#38bdf8" />
                                    <h4 style={styles.dutyItemTitle}>Pothole & Roads</h4>
                                    <p style={styles.dutyItemDesc}>Inspect severity & dispatch GHMC road squads</p>
                                </div>
                                <div style={styles.dutyItem}>
                                    <Truck size={22} color="#facc15" />
                                    <h4 style={styles.dutyItemTitle}>Sanitation & Waste</h4>
                                    <p style={styles.dutyItemDesc}>Clear garbage overflow & public sanitation</p>
                                </div>
                                <div style={styles.dutyItem}>
                                    <Clock size={22} color="#c084fc" />
                                    <h4 style={styles.dutyItemTitle}>72-Hour SLA</h4>
                                    <p style={styles.dutyItemDesc}>Guaranteed prompt action tracked live</p>
                                </div>
                                <div style={styles.dutyItem}>
                                    <CheckCircle2 size={22} color="#4ade80" />
                                    <h4 style={styles.dutyItemTitle}>Citizen Proof</h4>
                                    <p style={styles.dutyItemDesc}>Geospatial verification submitted by locals</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDE: AUTHENTICATION FORM ================= */}
                <div style={{ ...styles.rightPane, background: theme.cardBg }}>
                    <div style={styles.formContent}>
                        
                        {/* StreetVoice Brand Header */}
                        <div style={styles.brandHeader}>
                            <div style={styles.logoRow}>
                                <h2 style={{ ...styles.logoText, color: theme.brandColor }}>
                                    StreetVoice
                                </h2>
                                <span style={{ ...styles.logoSpark, color: theme.sparkColor }}>✦</span>
                            </div>
                            <p style={{ ...styles.logoTagline, color: theme.taglineColor }}>
                                {isAuthority 
                                    ? 'Municipal Administration • Departmental Triage' 
                                    : 'Report • Participate • Create Change'
                                }
                            </p>
                        </div>

                        {/* Welcome Greeting */}
                        <div style={styles.greetingHeader}>
                            <h3 style={{ ...styles.greetingTitle, color: theme.titleColor }}>
                                {mode === 'signup' 
                                    ? (isAuthority ? 'Authority Register' : 'Create an Account') 
                                    : (mode === 'otp' ? 'Phone OTP Sign-In' : (isAuthority ? 'Officer Login' : 'Welcome Back'))
                                }
                            </h3>
                            <p style={{ ...styles.greetingSub, color: theme.subColor }}>
                                {mode === 'signup'
                                    ? 'Join thousands of citizens making their city better.'
                                    : (mode === 'otp'
                                        ? 'Enter your mobile number for instant verification code.'
                                        : (isAuthority 
                                            ? 'Enter departmental credentials to access triage desk.' 
                                            : 'Login to continue and make your community better.'
                                          )
                                      )
                                }
                            </p>
                        </div>

                        {/* Error Notice */}
                        {error && (
                            <div style={{
                                ...styles.errorBanner,
                                background: isAuthority ? 'rgba(239, 68, 68, 0.15)' : 'rgba(220, 38, 38, 0.1)',
                                color: isAuthority ? '#fca5a5' : '#b91c1c',
                                borderColor: isAuthority ? 'rgba(239, 68, 68, 0.3)' : 'rgba(220, 38, 38, 0.25)'
                            }}>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* 1. SIGN IN FORM */}
                        {mode === 'signin' && (
                            <form onSubmit={handleSignIn} style={styles.form}>
                                {/* Email / Phone Field */}
                                <div style={styles.inputField}>
                                    <Mail size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type="text"
                                        placeholder={isAuthority ? "officer@ghmc.gov.in" : "Enter your email or phone"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor
                                        }}
                                        required
                                        autoComplete="username"
                                    />
                                </div>

                                {/* Password Field */}
                                <div style={styles.inputField}>
                                    <Lock size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor,
                                            paddingRight: '48px'
                                        }}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.fieldIconRight}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={19} color={theme.subColor} /> : <Eye size={19} color={theme.subColor} />}
                                    </button>
                                </div>

                                {/* Remember me & Forgot password Row */}
                                <div style={styles.helperRow}>
                                    <label style={styles.rememberRow}>
                                        <div 
                                            onClick={() => setRememberMe(!rememberMe)}
                                            style={{
                                                ...styles.checkboxBox,
                                                background: rememberMe ? theme.checkboxColor : 'transparent',
                                                borderColor: rememberMe ? theme.checkboxColor : theme.subColor
                                            }}
                                        >
                                            {rememberMe && <Check size={12} color="#ffffff" strokeWidth={3} />}
                                        </div>
                                        <span onClick={() => setRememberMe(!rememberMe)} style={{ color: theme.subColor }}>
                                            Remember me
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => toast('Demo accounts password is: password123', { icon: '🔑' })}
                                        style={{ ...styles.forgotLink, color: isAuthority ? '#38bdf8' : '#183a24' }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Primary Pill Button: "Login →" */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.primaryPillBtn,
                                        background: theme.buttonBg,
                                        color: theme.buttonColor,
                                        boxShadow: theme.buttonShadow
                                    }}
                                >
                                    <span>{loading ? 'Logging in...' : (isAuthority ? 'Access Authority Desk' : 'Login')}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* 2. REGISTER / CREATE ACCOUNT FORM */}
                        {mode === 'signup' && (
                            <form onSubmit={handleSignUp} style={styles.form}>
                                <div style={styles.inputField}>
                                    <User size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor
                                        }}
                                        required
                                    />
                                </div>

                                <div style={styles.inputField}>
                                    <Mail size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type="text"
                                        placeholder="Email address or 10-digit phone"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor
                                        }}
                                        required
                                    />
                                </div>

                                <div style={styles.inputField}>
                                    <MapPin size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type="text"
                                        placeholder="Ward / Residential Area (e.g. Ward 12)"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor
                                        }}
                                    />
                                </div>

                                <div style={styles.inputField}>
                                    <Lock size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password (min 6 chars)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor,
                                            paddingRight: '48px'
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.fieldIconRight}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={19} color={theme.subColor} /> : <Eye size={19} color={theme.subColor} />}
                                    </button>
                                </div>

                                <div style={styles.inputField}>
                                    <Lock size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputTextColor
                                        }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.primaryPillBtn,
                                        background: theme.buttonBg,
                                        color: theme.buttonColor,
                                        boxShadow: theme.buttonShadow
                                    }}
                                >
                                    <span>{loading ? 'Creating...' : 'Register'}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* 3. PHONE OTP FALLBACK */}
                        {mode === 'otp' && (
                            <div style={styles.form}>
                                {!otpSent ? (
                                    <>
                                        <div style={styles.inputField}>
                                            <Phone size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                            <input
                                                type="tel"
                                                maxLength={10}
                                                placeholder="10-digit mobile number"
                                                value={otpPhone}
                                                onChange={(e) => setOtpPhone(e.target.value)}
                                                style={{
                                                    ...styles.pillInput,
                                                    background: theme.inputBg,
                                                    border: theme.inputBorder,
                                                    color: theme.inputTextColor
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={loading}
                                            style={{
                                                ...styles.primaryPillBtn,
                                                background: theme.buttonBg,
                                                color: theme.buttonColor,
                                                boxShadow: theme.buttonShadow
                                            }}
                                        >
                                            <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.inputField}>
                                            <input
                                                type="number"
                                                maxLength={6}
                                                placeholder="6-digit OTP code"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                style={{
                                                    ...styles.pillInput,
                                                    background: theme.inputBg,
                                                    border: theme.inputBorder,
                                                    color: theme.inputTextColor,
                                                    textAlign: 'center',
                                                    letterSpacing: '4px',
                                                    paddingLeft: '20px'
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOTP}
                                            disabled={loading}
                                            style={{
                                                ...styles.primaryPillBtn,
                                                background: theme.buttonBg,
                                                color: theme.buttonColor,
                                                boxShadow: theme.buttonShadow
                                            }}
                                        >
                                            <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setMode('signin'); setError(''); }}
                                    style={{ ...styles.forgotLink, textAlign: 'center', marginTop: '12px', color: theme.subColor }}
                                >
                                    ← Back to standard login
                                </button>
                            </div>
                        )}

                        {/* Divider: "Or continue with" */}
                        {mode !== 'otp' && (
                            <>
                                <div style={styles.dividerBox}>
                                    <div style={{ ...styles.dividerBar, background: theme.dividerLine }} />
                                    <span style={{ ...styles.dividerCaption, color: theme.dividerText }}>
                                        Or continue with
                                    </span>
                                    <div style={{ ...styles.dividerBar, background: theme.dividerLine }} />
                                </div>

                                {/* Floating Social Circles (Matching Mockup: Google, Apple, Microsoft/Demo) */}
                                <div style={styles.socialButtonsRow}>
                                    {/* Circle 1: Google */}
                                    <button
                                        type="button"
                                        title="Continue with Google"
                                        onClick={handleGoogleSignIn}
                                        disabled={googleLoading || loading}
                                        style={{
                                            ...styles.circleButton,
                                            background: theme.socialCardBg,
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <GoogleIcon />
                                    </button>

                                    {/* Circle 2: Apple or SMS OTP */}
                                    <button
                                        type="button"
                                        title="Sign in with Apple / Phone OTP"
                                        onClick={() => { setMode('otp'); setError(''); }}
                                        style={{
                                            ...styles.circleButton,
                                            background: theme.socialCardBg,
                                            color: isAuthority ? '#ffffff' : '#000000',
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <AppleIcon />
                                    </button>

                                    {/* Circle 3: Microsoft / Demo Key */}
                                    <button
                                        type="button"
                                        title="Instant Demo Credentials"
                                        onClick={() => setShowDemoModal(!showDemoModal)}
                                        style={{
                                            ...styles.circleButton,
                                            background: theme.socialCardBg,
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <MicrosoftIcon />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Demo Credentials Drawer */}
                        {showDemoModal && (
                            <div style={{
                                ...styles.demoBox,
                                background: isAuthority ? '#1e293b' : '#f4faf5',
                                borderColor: isAuthority ? 'rgba(255,255,255,0.1)' : 'rgba(43,86,54,0.15)'
                            }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: theme.titleColor }}>
                                    Select Demo Account (Password: password123):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('vaibhav@streetvoice.org', 'password123', 'citizen')}
                                        style={styles.demoAccountBtn}
                                    >
                                        <span>👤 Sai Vaibhav (Citizen Demo)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('officer@ghmc.gov.in', 'password123', 'authority')}
                                        style={styles.demoAccountBtn}
                                    >
                                        <span>🏛️ GHMC Authority Officer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('moderator@streetvoice.org', 'password123', 'authority')}
                                        style={styles.demoAccountBtn}
                                    >
                                        <span>🛡️ Chief Moderator</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Footer Switcher */}
                        <div style={styles.footerRow}>
                            {mode === 'signup' ? (
                                <p style={{ ...styles.footerCaption, color: theme.subColor }}>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signin'); setError(''); }}
                                        style={{ ...styles.footerLinkBold, color: theme.footerLinkColor }}
                                    >
                                        Login
                                    </button>
                                </p>
                            ) : (
                                <p style={{ ...styles.footerCaption, color: theme.subColor }}>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signup'); setError(''); }}
                                        style={{ ...styles.footerLinkBold, color: theme.footerLinkColor }}
                                    >
                                        Register
                                    </button>
                                </p>
                            )}
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    },
    topNav: {
        width: '100%',
        maxWidth: '1080px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        zIndex: 10
    },
    backBtn: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.55rem 1rem',
        borderRadius: '999px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    },
    portalToggle: {
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '9999px',
        padding: '4px',
        gap: '4px'
    },
    portalBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '9999px',
        fontSize: '0.82rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    },
    mainCard: {
        width: '100%',
        maxWidth: '1080px',
        minHeight: '680px',
        background: '#ffffff',
        borderRadius: '36px',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(25, 60, 35, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    // Left Pane
    leftPane: {
        flex: '1 1 50%',
        minWidth: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
    },
    posterContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    heroPosterImg: {
        width: '100%',
        height: '100%',
        maxHeight: '740px',
        objectFit: 'cover',
        display: 'block'
    },
    authorityHero: {
        padding: '3rem 2rem',
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box'
    },
    authorityBadgeIcon: {
        width: '74px',
        height: '74px',
        borderRadius: '50%',
        background: 'rgba(56, 189, 248, 0.12)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
    },
    authorityTitle: {
        fontSize: '1.65rem',
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: '-0.02em',
        margin: '0 0 0.5rem',
        lineHeight: 1.2
    },
    authorityTagline: {
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#38bdf8',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin: '0 0 2rem'
    },
    dutyCardsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        width: '100%',
        textAlign: 'left'
    },
    dutyItem: {
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    dutyItemTitle: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#ffffff',
        margin: '4px 0 2px'
    },
    dutyItemDesc: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        margin: 0,
        lineHeight: 1.3
    },
    // Right Pane
    rightPane: {
        flex: '1 1 50%',
        minWidth: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2.5rem',
        boxSizing: 'border-box'
    },
    formContent: {
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    brandHeader: {
        marginBottom: '1.5rem',
        width: '100%'
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px'
    },
    logoText: {
        fontSize: '2rem',
        fontWeight: '800',
        margin: 0,
        letterSpacing: '-0.03em'
    },
    logoSpark: {
        fontSize: '1.25rem',
        fontWeight: '700'
    },
    logoTagline: {
        fontSize: '0.82rem',
        fontWeight: '500',
        margin: '4px 0 0',
        letterSpacing: '0.01em'
    },
    greetingHeader: {
        marginBottom: '1.8rem',
        width: '100%'
    },
    greetingTitle: {
        fontSize: '1.85rem',
        fontWeight: '700',
        margin: '0 0 0.35rem',
        letterSpacing: '-0.02em'
    },
    greetingSub: {
        fontSize: '0.9rem',
        margin: 0,
        fontWeight: '400',
        lineHeight: 1.4
    },
    errorBanner: {
        width: '100%',
        padding: '0.7rem 1rem',
        borderRadius: '14px',
        border: '1px solid',
        fontSize: '0.82rem',
        marginBottom: '1.25rem',
        lineHeight: 1.4,
        boxSizing: 'border-box'
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    inputField: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    fieldIconLeft: {
        position: 'absolute',
        left: '20px',
        pointerEvents: 'none'
    },
    fieldIconRight: {
        position: 'absolute',
        right: '18px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
    },
    pillInput: {
        width: '100%',
        height: '52px',
        borderRadius: '9999px',
        padding: '0 20px 0 52px',
        fontSize: '0.94rem',
        fontWeight: '500',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'box-shadow 0.2s ease, transform 0.15s ease'
    },
    helperRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        padding: '0 4px',
        marginTop: '-0.1rem'
    },
    rememberRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        cursor: 'pointer',
        userSelect: 'none'
    },
    checkboxBox: {
        width: '18px',
        height: '18px',
        borderRadius: '5px',
        border: '1.5px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease'
    },
    forgotLink: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '600',
        padding: 0
    },
    primaryPillBtn: {
        width: '100%',
        height: '52px',
        borderRadius: '9999px',
        border: 'none',
        fontSize: '1.02rem',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '0.4rem',
        transition: 'transform 0.15s ease, opacity 0.15s ease'
    },
    dividerBox: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '1.75rem 0 1.25rem'
    },
    dividerBar: {
        flex: 1,
        height: '1px'
    },
    dividerCaption: {
        fontSize: '0.82rem',
        fontWeight: '500',
        whiteSpace: 'nowrap'
    },
    socialButtonsRow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.25rem',
        width: '100%'
    },
    circleButton: {
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        padding: 0
    },
    demoBox: {
        marginTop: '1.25rem',
        width: '100%',
        borderRadius: '16px',
        padding: '0.85rem',
        border: '1px solid',
        textAlign: 'left',
        boxSizing: 'border-box'
    },
    demoAccountBtn: {
        background: 'rgba(0,0,0,0.04)',
        border: 'none',
        borderRadius: '8px',
        padding: '7px 10px',
        textAlign: 'left',
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        color: 'inherit'
    },
    footerRow: {
        marginTop: '2rem',
        width: '100%',
        textAlign: 'center'
    },
    footerCaption: {
        fontSize: '0.88rem',
        margin: 0,
        fontWeight: '400'
    },
    footerLinkBold: {
        background: 'none',
        border: 'none',
        fontWeight: '700',
        fontSize: '0.88rem',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0 2px'
    }
};