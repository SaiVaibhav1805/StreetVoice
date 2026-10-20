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
    Building2,
    Users
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z"/>
    </svg>
);

// Microsoft Logo SVG
const MicrosoftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#f25022" d="M1 1h10v10H1z"/>
        <path fill="#7fba00" d="M13 1h10v10H13z"/>
        <path fill="#00a4ef" d="M1 13h10v10H1z"/>
        <path fill="#ffb900" d="M13 13h10v10H13z"/>
    </svg>
);

// Illustrated Municipal Capitol Icon for Authority Login
const MunicipalBuildingBadge = () => (
    <div style={styles.municipalBadge}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#235032" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M4 18h16M4 10h16M12 2l8 5H4l8-5zM6 10v8M10 10v8M14 10v8M18 10v8"/>
        </svg>
    </div>
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

    // Both Citizen and Authority share the clean organic sage / celadon theme
    const theme = {
        cardBg: '#ffffff',
        leftBg: '#e9f3ec',
        outerBg: '#eaf4ee',
        brandColor: '#173b25',
        sparkColor: '#eab308',
        taglineColor: '#6c8975',
        titleColor: '#183a24',
        subColor: '#5c7a67',
        inputBg: '#dceee2',
        inputBorder: 'none',
        inputIconColor: '#2b5037',
        inputTextColor: '#163820',
        buttonBg: '#2c5839',
        buttonHover: '#22462c',
        buttonColor: '#ffffff',
        buttonShadow: '0 6px 20px rgba(44, 88, 57, 0.28)',
        checkboxColor: '#2c5839',
        dividerLine: 'rgba(44, 88, 57, 0.22)',
        dividerText: '#50705c',
        socialCardBg: '#ffffff',
        socialCardShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
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
            setError(isAuthority ? 'Please enter your email address' : 'Please enter your email address or phone');
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

    // Registration (Citizen only)
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
                role: 'citizen',
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
        toast.success(`Loaded demo credentials for ${id}`);
    };

    return (
        <div style={{ ...styles.pageWrapper, background: theme.outerBg }}>
            {/* Top Navigation Bar: Back & Portal Switcher */}
            <header style={styles.topNav}>
                <button 
                    onClick={() => navigate('/')} 
                    style={styles.backBtn}
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
                            background: isAuthority ? '#2c5839' : 'transparent',
                            color: isAuthority ? '#ffffff' : '#4a6d57',
                            boxShadow: isAuthority ? '0 2px 10px rgba(44,88,57,0.3)' : 'none',
                            fontWeight: isAuthority ? '700' : '500'
                        }}
                    >
                        <Building2 size={14} />
                        <span>Authority</span>
                    </button>
                </div>
            </header>

            {/* Main Split-Screen Card */}
            <main style={styles.mainCard}>
                
                {/* ================= LEFT SIDE: HERO ARTWORK ================= */}
                <div style={{ ...styles.leftPane, background: theme.leftBg }}>
                    {isAuthority ? (
                        /* AUTHORITY POSTER: Officer at Desktop with Live Civic Map */
                        <div style={styles.posterContainer}>
                            <img 
                                src="/authority-hero.jpg" 
                                alt="StreetVoice Authority - Cleaner Streets, Brighter Communities" 
                                style={styles.heroPosterImg}
                            />
                        </div>
                    ) : (
                        /* CITIZEN POSTER: Put Civics into Action Sneaker */
                        <div style={styles.posterContainer}>
                            <img 
                                src="/civic-hero.jpg" 
                                alt="Put Civics into Action - Get involved in your community" 
                                style={styles.heroPosterImg}
                            />
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDE: AUTHENTICATION FORM ================= */}
                <div style={{ ...styles.rightPane, background: theme.cardBg }}>
                    <div style={styles.formContent}>
                        
                        {/* AUTHORITY MODE: Municipal Badge & Header */}
                        {isAuthority ? (
                            <>
                                <MunicipalBuildingBadge />
                                <div style={styles.greetingHeader}>
                                    <h3 style={{ ...styles.greetingTitle, color: theme.titleColor }}>
                                        Authority Login
                                    </h3>
                                    <p style={{ ...styles.greetingSub, color: theme.subColor }}>
                                        Access the dashboard to manage and resolve community reports.
                                    </p>
                                </div>
                            </>
                        ) : (
                            /* CITIZEN MODE: StreetVoice Logo & Welcome Greeting */
                            <>
                                <div style={styles.brandHeader}>
                                    <div style={styles.logoRow}>
                                        <h2 style={{ ...styles.logoText, color: theme.brandColor }}>
                                            StreetVoice
                                        </h2>
                                        <span style={{ ...styles.logoSpark, color: theme.sparkColor }}>✦</span>
                                    </div>
                                    <p style={{ ...styles.logoTagline, color: theme.taglineColor }}>
                                        Report • Participate • Create Change
                                    </p>
                                </div>

                                <div style={styles.greetingHeader}>
                                    <h3 style={{ ...styles.greetingTitle, color: theme.titleColor }}>
                                        {mode === 'signup' 
                                            ? 'Create an Account' 
                                            : (mode === 'otp' ? 'Phone OTP Sign-In' : 'Welcome Back')
                                        }
                                    </h3>
                                    <p style={{ ...styles.greetingSub, color: theme.subColor }}>
                                        {mode === 'signup'
                                            ? 'Join thousands of citizens making their city better.'
                                            : (mode === 'otp'
                                                ? 'Enter your mobile number for instant verification code.'
                                                : 'Login to continue and make your community better.'
                                              )
                                        }
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Error Notice */}
                        {error && (
                            <div style={styles.errorBanner}>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* 1. SIGN IN FORM */}
                        {mode === 'signin' && (
                            <form onSubmit={handleSignIn} style={styles.form}>
                                {/* Identifier Field */}
                                <div style={styles.inputField}>
                                    <Mail size={19} color={theme.inputIconColor} style={styles.fieldIconLeft} />
                                    <input
                                        type="text"
                                        placeholder={isAuthority ? "Email address" : "Enter your email"}
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
                                        placeholder="Password"
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
                                        style={{ ...styles.forgotLink, color: theme.titleColor }}
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
                                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        )}

                        {/* 2. CITIZEN REGISTER FORM */}
                        {mode === 'signup' && !isAuthority && (
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

                                {/* Floating Social Circles (Exact Order: Google, Microsoft, Apple) */}
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

                                    {/* Circle 2: Microsoft / Quick Demo */}
                                    <button
                                        type="button"
                                        title="Demo Credentials or Microsoft"
                                        onClick={() => setShowDemoModal(!showDemoModal)}
                                        style={{
                                            ...styles.circleButton,
                                            background: theme.socialCardBg,
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <MicrosoftIcon />
                                    </button>

                                    {/* Circle 3: Apple / Phone OTP */}
                                    <button
                                        type="button"
                                        title="Apple Sign-In / SMS OTP"
                                        onClick={() => { setMode('otp'); setError(''); }}
                                        style={{
                                            ...styles.circleButton,
                                            background: theme.socialCardBg,
                                            color: '#000000',
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <AppleIcon />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Demo Credentials Drawer */}
                        {showDemoModal && (
                            <div style={styles.demoBox}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', color: theme.titleColor }}>
                                    Select Demo Account (Password: password123):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {isAuthority ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fillDemo('officer@ghmc.gov.in', 'password123', 'authority')}
                                                style={styles.demoAccountBtn}
                                            >
                                                <span>🏛️ GHMC Authority Officer (officer@ghmc.gov.in)</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => fillDemo('moderator@streetvoice.org', 'password123', 'authority')}
                                                style={styles.demoAccountBtn}
                                            >
                                                <span>🛡️ Chief Moderator (moderator@streetvoice.org)</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fillDemo('vaibhav@streetvoice.org', 'password123', 'citizen')}
                                            style={styles.demoAccountBtn}
                                        >
                                            <span>👤 Sai Vaibhav (vaibhav@streetvoice.org)</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Bottom Footer Switcher */}
                        <div style={styles.footerRow}>
                            {isAuthority ? (
                                /* Authority Footer: "Don't have an account? Contact Administrator" */
                                <p style={{ ...styles.footerCaption, color: theme.subColor }}>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toast('Officer registration is managed by GHMC municipal IT. Use demo officer login to test.', { icon: 'ℹ️' });
                                            setShowDemoModal(true);
                                        }}
                                        style={{ ...styles.footerLinkBold, color: theme.footerLinkColor }}
                                    >
                                        Contact Administrator
                                    </button>
                                </p>
                            ) : (
                                /* Citizen Footer: "Don't have an account? Register" / "Already have an account? Login" */
                                mode === 'signup' ? (
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
                                )
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
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        color: '#183a24'
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
    municipalBadge: {
        width: '68px',
        height: '68px',
        borderRadius: '50%',
        background: '#dceee2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        border: '1px solid rgba(44, 88, 57, 0.15)',
        boxShadow: '0 4px 14px rgba(44, 88, 57, 0.08)'
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
        border: '1px solid rgba(220, 38, 38, 0.25)',
        background: 'rgba(220, 38, 38, 0.1)',
        color: '#b91c1c',
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
        border: '1px solid rgba(44, 88, 57, 0.15)',
        background: '#f4faf5',
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
        color: '#183a24'
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