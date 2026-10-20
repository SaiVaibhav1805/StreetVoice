import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    Phone, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    Check, 
    KeyRound,
    Building2,
    Users,
    Wrench,
    CheckCircle2,
    Clock,
    Truck,
    MapPin
} from 'lucide-react';
import { signInWithGoogle } from '../config/firebase';

// Authentic Multicolor Google Logo
const GoogleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
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

    // Visual theme palette
    const theme = isAuthority ? {
        leftBg: '#090e17',
        rightBg: '#0f172a',
        textColor: '#f8fafc',
        titleColor: '#ffffff',
        subColor: '#94a3b8',
        inputBg: '#1e293b',
        inputBorder: '1px solid rgba(148, 163, 184, 0.25)',
        inputColor: '#ffffff',
        buttonBg: '#2563eb',
        buttonColor: '#ffffff',
        buttonShadow: '0 4px 18px rgba(37, 99, 235, 0.35)',
        dividerLine: 'rgba(148, 163, 184, 0.2)',
        dividerText: '#94a3b8',
        socialCardBg: '#1e293b',
        socialCardBorder: '1px solid rgba(255, 255, 255, 0.08)',
        socialCardShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        accent: '#38bdf8'
    } : {
        // Exact reference sage / mint palette
        leftBg: '#f6f9f7',
        rightBg: '#d8ece0',
        textColor: '#1e3d27',
        titleColor: '#20452d',
        subColor: '#4f725a',
        inputBg: '#8ea896',
        inputBorder: 'none',
        inputColor: '#173620',
        buttonBg: '#2c5936',
        buttonColor: '#ffffff',
        buttonShadow: '0 4px 16px rgba(44, 89, 54, 0.28)',
        dividerLine: 'rgba(44, 89, 54, 0.25)',
        dividerText: '#375d43',
        socialCardBg: '#ffffff',
        socialCardBorder: 'none',
        socialCardShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
        accent: '#2c5936'
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

    // 1. Google Sign-in
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

    // 2. Email or Phone Login
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
            const msg = err.response?.data?.message || 'Invalid credentials. Please verify and try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // 3. Registration
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

    // 4. Phone OTP
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
        toast.success(`Autofilled demo credentials for ${id}`);
    };

    return (
        <div style={styles.splitPage}>
            {/* Top Navigation Bar: Back & Portal Switcher */}
            <div style={styles.topBar}>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ ...styles.backBtn, color: isAuthority ? '#ffffff' : '#20452d' }}
                >
                    <ArrowLeft size={16} /> Back to Gateway
                </button>

                <div style={styles.portalPill}>
                    <button
                        type="button"
                        onClick={() => togglePortal('citizen')}
                        style={{
                            ...styles.portalPillBtn,
                            background: !isAuthority ? '#ffffff' : 'transparent',
                            color: !isAuthority ? '#20452d' : '#94a3b8',
                            boxShadow: !isAuthority ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
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
                            ...styles.portalPillBtn,
                            background: isAuthority ? '#2563eb' : 'transparent',
                            color: isAuthority ? '#ffffff' : '#4f725a',
                            boxShadow: isAuthority ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
                            fontWeight: isAuthority ? '700' : '500'
                        }}
                    >
                        <Building2 size={14} />
                        <span>Authority</span>
                    </button>
                </div>
            </div>

            {/* Split Screen Container */}
            <div style={styles.splitWrapper}>
                
                {/* ================= LEFT SIDE: ARTWORK & EDITORIAL PANEL ================= */}
                <div style={{ ...styles.leftPane, background: theme.leftBg }}>
                    {!isAuthority ? (
                        /* CITIZEN POSTER PANEL */
                        <div style={styles.posterWrapper}>
                            <img 
                                src="/civic-action-poster.jpg" 
                                alt="Put Civics into Action Poster" 
                                style={styles.posterImage}
                            />
                        </div>
                    ) : (
                        /* AUTHORITY CIVIC CONTROL PANEL */
                        <div style={styles.authorityVisualWrapper}>
                            <div style={styles.authorityVisualContent}>
                                <div style={styles.authoritySealBadge}>
                                    <ShieldCheck size={36} color="#38bdf8" />
                                </div>
                                <h2 style={styles.authorityHeroTitle}>
                                    PUT CIVIC GOVERNANCE INTO ACTION
                                </h2>
                                <p style={styles.authorityHeroSubtitle}>
                                    RAPID MUNICIPAL TRIAGE • FIELD DISPATCH • 100% TRANSPARENCY
                                </p>

                                <div style={styles.authorityDutyGrid}>
                                    <div style={styles.dutyCard}>
                                        <Wrench size={22} color="#38bdf8" />
                                        <h4>Pothole & Road Patching</h4>
                                        <p>Inspect severity & dispatch GHMC engineering squads</p>
                                    </div>
                                    <div style={styles.dutyCard}>
                                        <Truck size={22} color="#eab308" />
                                        <h4>Sanitation & Waste</h4>
                                        <p>Rapid clearing of illegal dumps & overflowing bins</p>
                                    </div>
                                    <div style={styles.dutyCard}>
                                        <Clock size={22} color="#a855f7" />
                                        <h4>72-Hour SLA Resolution</h4>
                                        <p>Guaranteed prompt action tracked on public dashboards</p>
                                    </div>
                                    <div style={styles.dutyCard}>
                                        <CheckCircle2 size={22} color="#10b981" />
                                        <h4>Geospatial Verification</h4>
                                        <p>Crowdsourced photo proof submitted by citizens</p>
                                    </div>
                                </div>

                                <div style={styles.liveMetricsStrip}>
                                    <div style={styles.metricItem}>
                                        <span style={styles.metricVal}>15 Wards</span>
                                        <span style={styles.metricLbl}>Active Coverage</span>
                                    </div>
                                    <div style={styles.metricDivider} />
                                    <div style={styles.metricItem}>
                                        <span style={styles.metricVal}>94.2%</span>
                                        <span style={styles.metricLbl}>SLA Compliance</span>
                                    </div>
                                    <div style={styles.metricDivider} />
                                    <div style={styles.metricItem}>
                                        <span style={styles.metricVal}>24 mins</span>
                                        <span style={styles.metricLbl}>Avg First Triage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ================= RIGHT SIDE: AUTHENTICATION FORM ================= */}
                <div style={{ ...styles.rightPane, background: theme.rightBg }}>
                    <div style={styles.formCard}>
                        {/* Header */}
                        <div style={styles.header}>
                            <h1 style={{ ...styles.title, color: theme.titleColor }}>
                                {mode === 'signup' 
                                    ? (isAuthority ? 'Authority Register' : 'Register')
                                    : (mode === 'otp' ? 'Phone OTP' : (isAuthority ? 'Officer Login' : 'Login'))
                                }
                            </h1>
                            <p style={{ ...styles.subTitle, color: theme.subColor }}>
                                {mode === 'signup' 
                                    ? 'Create new account' 
                                    : (mode === 'otp' 
                                        ? 'Enter 10-digit mobile number' 
                                        : (isAuthority 
                                            ? 'Municipal Corporation & Departmental Triage' 
                                            : 'Welcome back! Enter credentials to continue'
                                          )
                                      )
                                }
                            </p>
                        </div>

                        {/* Inline Error Notice */}
                        {error && (
                            <div style={{
                                ...styles.errorBox,
                                background: isAuthority ? 'rgba(239, 68, 68, 0.15)' : 'rgba(185, 28, 28, 0.12)',
                                color: isAuthority ? '#fca5a5' : '#991b1b',
                                borderColor: isAuthority ? 'rgba(239,68,68,0.3)' : 'rgba(185,28,28,0.25)'
                            }}>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* 1. SIGN IN FORM */}
                        {mode === 'signin' && (
                            <form onSubmit={handleSignIn} style={styles.form}>
                                <div style={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder={isAuthority ? "officer@ghmc.gov.in" : "username@mail.com"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor
                                        }}
                                        required
                                        autoComplete="username"
                                    />
                                </div>

                                <div style={styles.inputWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor,
                                            paddingRight: '50px'
                                        }}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            ...styles.inputEyeBtn,
                                            color: isAuthority ? '#94a3b8' : '#2b5037'
                                        }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.pillButton,
                                        background: theme.buttonBg,
                                        color: theme.buttonColor,
                                        boxShadow: theme.buttonShadow
                                    }}
                                >
                                    {loading ? 'Authenticating...' : (isAuthority ? 'Access Authority Desk' : 'Login')}
                                </button>

                                <div style={{ ...styles.helperRow, color: theme.subColor }}>
                                    <label style={styles.rememberMeLabel}>
                                        <div 
                                            onClick={() => setRememberMe(!rememberMe)}
                                            style={{
                                                ...styles.checkboxCircle,
                                                background: rememberMe ? (isAuthority ? '#2563eb' : '#264e32') : 'transparent',
                                                borderColor: rememberMe ? (isAuthority ? '#2563eb' : '#264e32') : theme.subColor
                                            }}
                                        >
                                            {rememberMe && <Check size={11} color="#ffffff" strokeWidth={3} />}
                                        </div>
                                        <span onClick={() => setRememberMe(!rememberMe)}>Remember me</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => toast('For all demo accounts, the password is: password123', { icon: 'ℹ️' })}
                                        style={{ ...styles.forgotBtn, color: theme.subColor }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* 2. REGISTER / CREATE ACCOUNT FORM */}
                        {mode === 'signup' && (
                            <form onSubmit={handleSignUp} style={styles.form}>
                                <div style={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor
                                        }}
                                        required
                                    />
                                </div>

                                <div style={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="username@mail.com"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor
                                        }}
                                        required
                                    />
                                </div>

                                <div style={styles.inputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Ward / Residential Area (e.g. Ward 12, Gachibowli)"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor
                                        }}
                                    />
                                </div>

                                <div style={styles.inputWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password (min 6 characters)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor,
                                            paddingRight: '50px'
                                        }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            ...styles.inputEyeBtn,
                                            color: isAuthority ? '#94a3b8' : '#2b5037'
                                        }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div style={styles.inputWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{
                                            ...styles.pillInput,
                                            background: theme.inputBg,
                                            border: theme.inputBorder,
                                            color: theme.inputColor
                                        }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        ...styles.pillButton,
                                        background: theme.buttonBg,
                                        color: theme.buttonColor,
                                        boxShadow: theme.buttonShadow
                                    }}
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </button>
                            </form>
                        )}

                        {/* 3. PHONE OTP FALLBACK */}
                        {mode === 'otp' && (
                            <div style={styles.form}>
                                {!otpSent ? (
                                    <>
                                        <div style={styles.inputWrapper}>
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
                                                    color: theme.inputColor
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={loading}
                                            style={{
                                                ...styles.pillButton,
                                                background: theme.buttonBg,
                                                color: theme.buttonColor,
                                                boxShadow: theme.buttonShadow
                                            }}
                                        >
                                            {loading ? 'Sending Code...' : 'Send Verification OTP'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.inputWrapper}>
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
                                                    color: theme.inputColor,
                                                    textAlign: 'center',
                                                    letterSpacing: '4px'
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOTP}
                                            disabled={loading}
                                            style={{
                                                ...styles.pillButton,
                                                background: theme.buttonBg,
                                                color: theme.buttonColor,
                                                boxShadow: theme.buttonShadow
                                            }}
                                        >
                                            {loading ? 'Verifying...' : 'Verify & Continue'}
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setMode('signin'); setError(''); }}
                                    style={{ ...styles.forgotBtn, textAlign: 'center', marginTop: '12px', color: theme.subColor }}
                                >
                                    ← Back to standard login
                                </button>
                            </div>
                        )}

                        {/* Divider: "Or continue with" */}
                        {mode !== 'otp' && (
                            <>
                                <div style={styles.dividerRow}>
                                    <div style={{ ...styles.dividerLine, background: theme.dividerLine }} />
                                    <span style={{ ...styles.dividerText, color: theme.dividerText }}>
                                        Or continue with
                                    </span>
                                    <div style={{ ...styles.dividerLine, background: theme.dividerLine }} />
                                </div>

                                {/* Floating Social Circles (Matching Mockup) */}
                                <div style={styles.socialCirclesContainer}>
                                    {/* Circle 1: SMS / Phone OTP */}
                                    <button
                                        type="button"
                                        title="Sign in with SMS OTP"
                                        onClick={() => { setMode('otp'); setError(''); }}
                                        style={{
                                            ...styles.socialCircle,
                                            background: theme.socialCardBg,
                                            border: theme.socialCardBorder,
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <Phone size={20} color={isAuthority ? '#38bdf8' : '#264e32'} />
                                    </button>

                                    {/* Circle 2: Google Sign-in */}
                                    <button
                                        type="button"
                                        title="Continue with Google"
                                        onClick={handleGoogleSignIn}
                                        disabled={googleLoading || loading}
                                        style={{
                                            ...styles.socialCircle,
                                            background: theme.socialCardBg,
                                            border: theme.socialCardBorder,
                                            boxShadow: theme.socialCardShadow,
                                            transform: 'scale(1.06)'
                                        }}
                                    >
                                        <GoogleIcon />
                                    </button>

                                    {/* Circle 3: Demo Fast-Track */}
                                    <button
                                        type="button"
                                        title="Quick Demo Accounts"
                                        onClick={() => setShowDemoModal(!showDemoModal)}
                                        style={{
                                            ...styles.socialCircle,
                                            background: theme.socialCardBg,
                                            border: theme.socialCardBorder,
                                            boxShadow: theme.socialCardShadow
                                        }}
                                    >
                                        <KeyRound size={20} color={isAuthority ? '#38bdf8' : '#264e32'} />
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Demo Fast-Track Drawer */}
                        {showDemoModal && (
                            <div style={{
                                ...styles.demoDropdown,
                                background: isAuthority ? '#1e293b' : '#ffffff',
                                borderColor: isAuthority ? 'rgba(255,255,255,0.1)' : 'rgba(44,89,54,0.15)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                            }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px', color: theme.titleColor }}>
                                    Select Demo Account (Password: password123):
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('vaibhav@streetvoice.org', 'password123', 'citizen')}
                                        style={styles.demoOptionBtn}
                                    >
                                        <span>👤 Sai Vaibhav (Citizen)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('officer@ghmc.gov.in', 'password123', 'authority')}
                                        style={styles.demoOptionBtn}
                                    >
                                        <span>🏛️ GHMC Authority Officer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fillDemo('moderator@streetvoice.org', 'password123', 'authority')}
                                        style={styles.demoOptionBtn}
                                    >
                                        <span>🛡️ Chief Moderator</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom Switcher */}
                        <div style={styles.bottomFooter}>
                            {mode === 'signup' ? (
                                <p style={{ ...styles.footerText, color: theme.subColor }}>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signin'); setError(''); }}
                                        style={{ ...styles.footerLink, color: theme.titleColor }}
                                    >
                                        Sign in
                                    </button>
                                </p>
                            ) : (
                                <p style={{ ...styles.footerText, color: theme.subColor }}>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { setMode('signup'); setError(''); }}
                                        style={{ ...styles.footerLink, color: theme.titleColor }}
                                    >
                                        Sign up
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const styles = {
    splitPage: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        overflowX: 'hidden'
    },
    topBar: {
        position: 'absolute',
        top: '1rem',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.5rem',
        zIndex: 20,
        pointerEvents: 'none'
    },
    backBtn: {
        background: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.55rem 0.95rem',
        borderRadius: '999px',
        transition: 'opacity 0.2s',
        pointerEvents: 'auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
    },
    portalPill: {
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '9999px',
        padding: '4px',
        gap: '4px',
        pointerEvents: 'auto'
    },
    portalPillBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 15px',
        borderRadius: '9999px',
        fontSize: '0.82rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    },
    splitWrapper: {
        flex: 1,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    // Left Pane
    leftPane: {
        flex: '1 1 50%',
        minWidth: '340px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem 2rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
    },
    posterWrapper: {
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        maxHeight: '840px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)'
    },
    posterImage: {
        width: '100%',
        height: '100%',
        maxHeight: '840px',
        objectFit: 'contain',
        display: 'block'
    },
    // Authority Visual Pane
    authorityVisualWrapper: {
        width: '100%',
        maxWidth: '520px',
        padding: '2.5rem 2rem',
        borderRadius: '28px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        boxSizing: 'border-box',
        textAlign: 'center'
    },
    authorityVisualContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    authoritySealBadge: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'rgba(56, 189, 248, 0.12)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
    },
    authorityHeroTitle: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: '-0.02em',
        margin: '0 0 0.5rem',
        lineHeight: 1.2
    },
    authorityHeroSubtitle: {
        fontSize: '0.82rem',
        fontWeight: '700',
        color: '#38bdf8',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin: '0 0 2rem'
    },
    authorityDutyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        width: '100%',
        textAlign: 'left',
        marginBottom: '2rem'
    },
    dutyCard: {
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    liveMetricsStrip: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '0.85rem'
    },
    metricItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    metricVal: {
        fontSize: '1.15rem',
        fontWeight: '800',
        color: '#38bdf8'
    },
    metricLbl: {
        fontSize: '0.72rem',
        color: '#94a3b8',
        textTransform: 'uppercase'
    },
    metricDivider: {
        width: '1px',
        height: '28px',
        background: 'rgba(255, 255, 255, 0.1)'
    },
    // Right Pane (Form)
    rightPane: {
        flex: '1 1 50%',
        minWidth: '340px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem 2.5rem',
        boxSizing: 'border-box'
    },
    formCard: {
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },
    header: {
        marginBottom: '2rem',
        width: '100%'
    },
    title: {
        fontSize: '2.6rem',
        fontWeight: '700',
        margin: '0 0 0.4rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.15
    },
    subTitle: {
        fontSize: '0.98rem',
        margin: 0,
        fontWeight: '500'
    },
    errorBox: {
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '16px',
        border: '1px solid',
        fontSize: '0.84rem',
        marginBottom: '1.25rem',
        textAlign: 'center',
        lineHeight: 1.4,
        boxSizing: 'border-box'
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem'
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    pillInput: {
        width: '100%',
        height: '52px',
        borderRadius: '9999px',
        padding: '0 24px',
        fontSize: '0.96rem',
        fontWeight: '500',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
    },
    inputEyeBtn: {
        position: 'absolute',
        right: '18px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: 0
    },
    pillButton: {
        width: '100%',
        height: '52px',
        borderRadius: '9999px',
        border: 'none',
        fontSize: '1.05rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '0.3rem',
        transition: 'transform 0.15s ease, opacity 0.15s ease'
    },
    helperRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.82rem',
        fontWeight: '500',
        padding: '0 6px',
        marginTop: '-0.2rem'
    },
    rememberMeLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        userSelect: 'none'
    },
    checkboxCircle: {
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '1.5px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease'
    },
    forgotBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '500',
        padding: 0
    },
    dividerRow: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '2rem 0 1.5rem'
    },
    dividerLine: {
        flex: 1,
        height: '1px'
    },
    dividerText: {
        fontSize: '0.84rem',
        fontWeight: '500',
        whiteSpace: 'nowrap'
    },
    socialCirclesContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        width: '100%'
    },
    socialCircle: {
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        padding: 0
    },
    demoDropdown: {
        marginTop: '1.25rem',
        width: '100%',
        borderRadius: '18px',
        padding: '1rem',
        border: '1px solid',
        textAlign: 'left',
        boxSizing: 'border-box'
    },
    demoOptionBtn: {
        background: 'rgba(0,0,0,0.04)',
        border: 'none',
        borderRadius: '10px',
        padding: '8px 12px',
        textAlign: 'left',
        fontSize: '0.82rem',
        fontWeight: '600',
        cursor: 'pointer',
        color: 'inherit'
    },
    bottomFooter: {
        marginTop: '2.5rem',
        width: '100%',
        textAlign: 'center'
    },
    footerText: {
        fontSize: '0.9rem',
        margin: 0,
        fontWeight: '500'
    },
    footerLink: {
        background: 'none',
        border: 'none',
        fontWeight: '700',
        fontSize: '0.9rem',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '0 2px'
    }
};