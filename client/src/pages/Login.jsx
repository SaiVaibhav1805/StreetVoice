import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    Lock, 
    Eye, 
    EyeOff, 
    User, 
    MapPin, 
    KeyRound, 
    Sparkles, 
    ShieldCheck, 
    HelpCircle,
    CheckCircle2
} from 'lucide-react';
import { signInWithGoogle } from '../config/firebase';

// Google Multicolor SVG Icon
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    
    // OTP Mode fields
    const [otpPhone, setOtpPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const { loginWithCredentials, register, loginWithGoogle, loginWithOtp } = useAuth();
    const navigate = useNavigate();

    // Theming
    const primaryAccent = isAuthority ? '#8b5cf6' : '#3b82f6';
    const primaryGlow = isAuthority ? 'rgba(139, 92, 246, 0.25)' : 'rgba(59, 130, 246, 0.25)';

    // Switch portal between citizen and authority
    const togglePortal = (newPortal) => {
        setSearchParams({ portal: newPortal });
        setError('');
    };

    // Post-login redirect logic
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

    // 1. Google Sign-In
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
            } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
                setError('Google provider is not enabled in Firebase Console. Please use Email/Phone + Password or Demo Login below.');
                toast.error('Google Auth needs activation in Firebase Console');
            } else {
                setError(err.message || 'Google sign-in failed. Please try again.');
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    // 2. Email or Phone + Password Sign-In
    const handleSignIn = async (e) => {
        e?.preventDefault();
        setError('');

        if (!identifier.trim()) {
            setError('Please enter your email address or phone number');
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

    // 3. Create Account (Registration)
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

    // 4. Send Simulated Phone OTP
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

    // 5. Verify Phone OTP
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

    // Fill Demo Accounts
    const fillDemo = (id, pwd, portalType) => {
        setMode('signin');
        setIdentifier(id);
        setPassword(pwd);
        setError('');
        if (portalType && portalType !== portal) {
            setSearchParams({ portal: portalType });
        }
        toast.success(`Loaded credentials for ${id}`);
    };

    return (
        <div style={{ ...styles.page, background: isAuthority ? '#07060e' : '#060913' }}>
            {/* Background glowing gradients */}
            <div style={{
                ...styles.bgGlow,
                background: isAuthority 
                    ? 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)' 
                    : 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)'
            }} />

            {/* Back to landing */}
            <button onClick={() => navigate('/')} style={styles.backBtn}>
                <ArrowLeft size={16} /> Back to Gateway
            </button>

            <div style={styles.container}>
                {/* Portal Toggle Selector */}
                <div style={styles.portalToggleContainer}>
                    <button 
                        type="button"
                        onClick={() => togglePortal('citizen')}
                        style={{
                            ...styles.portalBtn,
                            ...(portal === 'citizen' ? styles.portalBtnActiveCitizen : styles.portalBtnInactive)
                        }}
                    >
                        <span>📍</span>
                        <span>Citizen Portal</span>
                    </button>
                    <button 
                        type="button"
                        onClick={() => togglePortal('authority')}
                        style={{
                            ...styles.portalBtn,
                            ...(portal === 'authority' ? styles.portalBtnActiveAuthority : styles.portalBtnInactive)
                        }}
                    >
                        <span>🏛️</span>
                        <span>Authority Desk</span>
                    </button>
                </div>

                {/* Main Card */}
                <div style={{ ...styles.card, borderColor: isAuthority ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)' }}>
                    
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={{
                            ...styles.badgeIcon,
                            background: isAuthority ? 'rgba(139, 92, 246, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                            color: primaryAccent,
                            border: `1px solid ${isAuthority ? 'rgba(139, 92, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                        }}>
                            {isAuthority ? <ShieldCheck size={26} /> : <Sparkles size={26} />}
                        </div>
                        <h1 style={styles.title}>
                            {isAuthority ? 'Authority Gateway' : 'Citizen Access'}
                        </h1>
                        <p style={styles.subtitle}>
                            {isAuthority 
                                ? 'Review departmental complaints, triage tasks, and dispatch resolutions' 
                                : 'Report civic issues, earn community badges, and track real-time fixes'}
                        </p>
                    </div>

                    {/* Mode Tabs (Sign In vs Create Account) */}
                    {mode !== 'otp' && (
                        <div style={styles.tabBar}>
                            <button 
                                type="button"
                                onClick={() => { setMode('signin'); setError(''); }}
                                style={{
                                    ...styles.tabBtn,
                                    ...(mode === 'signin' ? { ...styles.tabBtnActive, background: primaryAccent } : styles.tabBtnInactive)
                                }}
                            >
                                Sign In
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setMode('signup'); setError(''); }}
                                style={{
                                    ...styles.tabBtn,
                                    ...(mode === 'signup' ? { ...styles.tabBtnActive, background: primaryAccent } : styles.tabBtnInactive)
                                }}
                            >
                                Create Account
                            </button>
                        </div>
                    )}

                    {/* Error Notice */}
                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* 1. GOOGLE SIGN-IN BUTTON (Shown in Citizen Portal or standard auth) */}
                    {mode !== 'otp' && (
                        <>
                            <button 
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading || loading}
                                style={styles.googleBtn}
                            >
                                <GoogleIcon />
                                <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
                            </button>

                            <div style={styles.divider}>
                                <div style={styles.dividerLine} />
                                <span style={styles.dividerText}>or continue with email / phone</span>
                                <div style={styles.dividerLine} />
                            </div>
                        </>
                    )}

                    {/* 2. SIGN IN FORM */}
                    {mode === 'signin' && (
                        <form onSubmit={handleSignIn} style={styles.form}>
                            <div>
                                <label style={styles.inputLabel}>Email ID or Phone Number</label>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} style={styles.inputIcon} />
                                    <input 
                                        type="text"
                                        placeholder="e.g. vaibhav@streetvoice.org or 9876543210"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={styles.textInput}
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={styles.passwordHeader}>
                                    <label style={styles.inputLabel}>Password</label>
                                </div>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} style={styles.inputIcon} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your account password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={styles.textInput}
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.eyeBtn}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ ...styles.submitBtn, background: primaryAccent, boxShadow: `0 4px 20px ${primaryGlow}` }}
                            >
                                {loading ? 'Authenticating...' : `Sign In to ${isAuthority ? 'Authority Desk' : 'StreetVoice'}`}
                            </button>

                            <div style={styles.alternateOption}>
                                <button 
                                    type="button" 
                                    onClick={() => { setMode('otp'); setError(''); }}
                                    style={styles.textLink}
                                >
                                    Prefer SMS? Sign in with Phone OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 3. CREATE ACCOUNT FORM */}
                    {mode === 'signup' && (
                        <form onSubmit={handleSignUp} style={styles.form}>
                            <div>
                                <label style={styles.inputLabel}>Full Name</label>
                                <div style={styles.inputWrapper}>
                                    <User size={18} style={styles.inputIcon} />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Sai Vaibhav"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={styles.textInput}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={styles.inputLabel}>Email ID or 10-Digit Phone Number</label>
                                <div style={styles.inputWrapper}>
                                    <Mail size={18} style={styles.inputIcon} />
                                    <input 
                                        type="text"
                                        placeholder="you@domain.com or 9876543210"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        style={styles.textInput}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={styles.inputLabel}>Ward or Residential Area (Optional)</label>
                                <div style={styles.inputWrapper}>
                                    <MapPin size={18} style={styles.inputIcon} />
                                    <input 
                                        type="text"
                                        placeholder="e.g. Ward 12, Gachibowli"
                                        value={ward}
                                        onChange={(e) => setWard(e.target.value)}
                                        style={styles.textInput}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={styles.inputLabel}>Password (minimum 6 characters)</label>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} style={styles.inputIcon} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={styles.textInput}
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.eyeBtn}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label style={styles.inputLabel}>Confirm Password</label>
                                <div style={styles.inputWrapper}>
                                    <Lock size={18} style={styles.inputIcon} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={styles.textInput}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{ ...styles.submitBtn, background: primaryAccent, boxShadow: `0 4px 20px ${primaryGlow}` }}
                            >
                                {loading ? 'Creating Account...' : 'Register New Account'}
                            </button>
                        </form>
                    )}

                    {/* 4. PHONE OTP FALLBACK MODE */}
                    {mode === 'otp' && (
                        <div style={styles.form}>
                            {!otpSent ? (
                                <>
                                    <div>
                                        <label style={styles.inputLabel}>10-Digit Mobile Number</label>
                                        <div style={styles.inputWrapper}>
                                            <Phone size={18} style={styles.inputIcon} />
                                            <span style={styles.countryCode}>+91</span>
                                            <input 
                                                type="tel"
                                                maxLength={10}
                                                placeholder="9876543210"
                                                value={otpPhone}
                                                onChange={(e) => setOtpPhone(e.target.value)}
                                                style={styles.textInput}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={handleSendOTP} 
                                        disabled={loading}
                                        style={{ ...styles.submitBtn, background: primaryAccent }}
                                    >
                                        {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={styles.inputLabel}>Enter 6-Digit OTP Code</label>
                                        <div style={styles.inputWrapper}>
                                            <KeyRound size={18} style={styles.inputIcon} />
                                            <input 
                                                type="number"
                                                maxLength={6}
                                                placeholder="123456"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                style={{ ...styles.textInput, letterSpacing: '4px', textAlign: 'center' }}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={handleVerifyOTP} 
                                        disabled={loading}
                                        style={{ ...styles.submitBtn, background: primaryAccent }}
                                    >
                                        {loading ? 'Verifying OTP...' : 'Verify & Continue'}
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setOtpSent(false)}
                                        style={styles.textLink}
                                    >
                                        Change Phone Number
                                    </button>
                                </>
                            )}

                            <div style={styles.alternateOption}>
                                <button 
                                    type="button" 
                                    onClick={() => { setMode('signin'); setError(''); }}
                                    style={styles.textLink}
                                >
                                    ← Back to Email / Password Login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instant Demo Accounts Helper */}
                    <div style={styles.demoBox}>
                        <div style={styles.demoTitle}>
                            <HelpCircle size={14} color="#94a3b8" />
                            <span>Quick Demo Accounts (Password: password123)</span>
                        </div>
                        <div style={styles.demoChips}>
                            <button 
                                type="button"
                                onClick={() => fillDemo('vaibhav@streetvoice.org', 'password123', 'citizen')}
                                style={styles.demoChip}
                            >
                                <span>👤 Citizen (Vaibhav)</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => fillDemo('officer@ghmc.gov.in', 'password123', 'authority')}
                                style={styles.demoChip}
                            >
                                <span>🏛️ Authority (GHMC)</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => fillDemo('moderator@streetvoice.org', 'password123', 'authority')}
                                style={styles.demoChip}
                            >
                                <span>🛡️ Moderator</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        color: '#f8fafc',
        fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden'
    },
    bgGlow: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0
    },
    backBtn: {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.6rem 1rem',
        borderRadius: '999px',
        transition: 'all 0.2s ease',
        zIndex: 10
    },
    container: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
    },
    portalToggleContainer: {
        display: 'flex',
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        padding: '4px',
        gap: '4px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    },
    portalBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    },
    portalBtnActiveCitizen: {
        background: '#2563eb',
        color: '#ffffff',
        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)'
    },
    portalBtnActiveAuthority: {
        background: '#7c3aed',
        color: '#ffffff',
        boxShadow: '0 2px 10px rgba(124, 58, 237, 0.4)'
    },
    portalBtnInactive: {
        background: 'transparent',
        color: '#94a3b8'
    },
    card: {
        width: '100%',
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2.25rem 2rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        boxSizing: 'border-box'
    },
    header: {
        textAlign: 'center',
        marginBottom: '1.5rem'
    },
    badgeIcon: {
        width: '54px',
        height: '54px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
    },
    title: {
        fontSize: '1.65rem',
        fontWeight: '800',
        margin: '0 0 0.4rem',
        letterSpacing: '-0.025em',
        color: '#ffffff'
    },
    subtitle: {
        fontSize: '0.86rem',
        color: '#94a3b8',
        margin: 0,
        lineHeight: '1.5'
    },
    tabBar: {
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '12px',
        padding: '3px',
        marginBottom: '1.25rem',
        gap: '4px'
    },
    tabBtn: {
        flex: 1,
        padding: '9px 12px',
        borderRadius: '9px',
        fontSize: '0.85rem',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    tabBtnActive: {
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
    },
    tabBtnInactive: {
        background: 'transparent',
        color: '#64748b'
    },
    errorBox: {
        background: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        color: '#fca5a5',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        marginBottom: '1.25rem'
    },
    googleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '0.85rem',
        background: '#ffffff',
        color: '#0f172a',
        border: 'none',
        borderRadius: '14px',
        fontSize: '0.92rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        margin: '1.25rem 0',
        gap: '0.75rem'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255, 255, 255, 0.08)'
    },
    dividerText: {
        fontSize: '0.75rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    inputLabel: {
        display: 'block',
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '0.4rem'
    },
    passwordHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.4rem'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(2, 6, 23, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        transition: 'border-color 0.2s ease'
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        color: '#64748b',
        pointerEvents: 'none'
    },
    countryCode: {
        position: 'absolute',
        left: '42px',
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: '0.9rem'
    },
    textInput: {
        width: '100%',
        padding: '0.85rem 1rem 0.85rem 42px',
        background: 'transparent',
        border: 'none',
        color: '#ffffff',
        fontSize: '0.92rem',
        outline: 'none',
        boxSizing: 'border-box'
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center'
    },
    submitBtn: {
        width: '100%',
        padding: '0.95rem',
        borderRadius: '14px',
        border: 'none',
        color: '#ffffff',
        fontSize: '0.95rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        marginTop: '0.5rem'
    },
    alternateOption: {
        textAlign: 'center',
        marginTop: '0.25rem'
    },
    textLink: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        fontSize: '0.82rem',
        cursor: 'pointer',
        padding: '4px',
        textDecoration: 'underline'
    },
    demoBox: {
        marginTop: '1.75rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    },
    demoTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.78rem',
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: '0.75rem'
    },
    demoChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px'
    },
    demoChip: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#cbd5e1',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.76rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s ease'
    }
};