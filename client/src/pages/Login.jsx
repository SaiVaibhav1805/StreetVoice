import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Phone, KeyRound, HelpCircle } from 'lucide-react';

export default function Login() {
    const [searchParams] = useSearchParams();
    const portal = searchParams.get('portal') || 'citizen'; // 'citizen' | 'authority'
    
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const isAuthority = portal === 'authority';
    const mainColor = isAuthority ? '#7c3aed' : '#2563eb';
    const hoverColor = isAuthority ? '#6d28d9' : '#1d4ed8';

    const sendOTP = async () => {
        setError('');
        if (!phone || phone.length < 10) {
            setError('Enter a valid 10-digit phone number');
            return;
        }
        try {
            setLoading(true);
            const res = await api.post('/auth/send-otp', { phone });
            
            if (res.data.otp) {
                setOtp(res.data.otp);
                toast.success(`Mock OTP: ${res.data.otp} (Auto-filled)`, { duration: 4000 });
            } else {
                toast.success('Mock OTP sent! Use 123456');
            }
            setStep('otp');
        } catch (err) {
            setError('Failed to send OTP. Try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        setError('');
        if (!otp || otp.length !== 6) {
            setError('Enter the 6-digit OTP');
            return;
        }
        try {
            setLoading(true);
            const user = await login(phone, otp);
            
            if (user.role === 'authority' || user.role === 'moderator') {
                toast.success(`Logged in as Authority: ${user.name || 'Officer'}`);
                navigate('/authority');
            } else if (user.isNewUser) {
                toast.success('Welcome! Please complete your profile');
                navigate('/setup-profile');
            } else {
                toast.success(`Logged in as ${user.name || 'Citizen'}`);
                navigate('/home');
            }
        } catch (err) {
            setError('Invalid OTP. Try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ ...styles.container, background: isAuthority ? '#0a0910' : '#090d16' }}>
            {/* Back to landing */}
            <button onClick={() => navigate('/')} style={styles.backBtn}>
                <ArrowLeft size={16} /> Back to Gateway
            </button>

            <div style={styles.card}>
                {/* Title Icon */}
                <div style={{ 
                    ...styles.iconWrapper, 
                    background: isAuthority ? 'rgba(124,58,237,0.1)' : 'rgba(37,99,235,0.1)',
                    border: isAuthority ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(37,99,235,0.2)'
                }}>
                    <span style={{ fontSize: '1.8rem' }}>{isAuthority ? '🏛️' : '📍'}</span>
                </div>

                <h1 style={styles.title}>{isAuthority ? 'Authority Login' : 'Citizen Login'}</h1>
                <p style={styles.subtitle}>
                    {isAuthority 
                        ? 'Access department tickets, update status, and manage resolutions.' 
                        : 'Report civic issues, upvote reports, and track fixes.'
                    }
                </p>

                {step === 'phone' && (
                    <div style={styles.form}>
                        <label style={styles.label}>Phone Number</label>
                        <div style={styles.inputContainer}>
                            <Phone size={18} color="#475569" style={styles.inputIcon} />
                            <span style={styles.countryCode}>+91</span>
                            <input
                                type="tel"
                                maxLength={10}
                                placeholder="9876543210"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        
                        <button 
                            onClick={sendOTP} 
                            disabled={loading}
                            style={{ ...styles.submitBtn, background: mainColor }}
                        >
                            {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                        </button>
                    </div>
                )}

                {step === 'otp' && (
                    <div style={styles.form}>
                        <label style={styles.label}>Enter 6-Digit OTP</label>
                        <div style={styles.inputContainer}>
                            <KeyRound size={18} color="#475569" style={styles.inputIcon} />
                            <input
                                type="number"
                                maxLength={6}
                                placeholder="------"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                style={styles.inputOtp}
                            />
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        
                        <button 
                            onClick={verifyOTP} 
                            disabled={loading}
                            style={{ ...styles.submitBtn, background: mainColor }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>

                        <button style={styles.textBtn} onClick={() => setStep('phone')}>
                            Change Phone Number
                        </button>
                    </div>
                )}

                {/* Helper credentials box */}
                <div style={styles.helperBox}>
                    <div style={styles.helperHeader}>
                        <HelpCircle size={14} color="#64748b" />
                        <span>Development Mock Access</span>
                    </div>
                    <p style={styles.helperText}>
                        {isAuthority
                            ? 'Authority Demo: Use 8888888888\nModerator Demo: Use 9999999999'
                            : 'Citizen Demo: Use 9876543210'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        color: '#fff',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        boxSizing: 'border-box',
        position: 'relative'
    },
    backBtn: {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem',
        borderRadius: '8px',
        transition: 'color 0.2s'
    },
    card: {
        background: 'rgba(30, 41, 59, 0.45)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        boxSizing: 'border-box'
    },
    iconWrapper: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem'
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '900',
        margin: '0 0 0.5rem',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '0.88rem',
        color: '#94a3b8',
        margin: '0 0 2rem',
        lineHeight: '1.5'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'left'
    },
    label: {
        fontSize: '0.82rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '0.75rem',
        gap: '0.5rem'
    },
    inputIcon: {
        flexShrink: 0
    },
    countryCode: {
        fontSize: '0.95rem',
        color: '#64748b',
        fontWeight: '600',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        paddingRight: '0.5rem'
    },
    input: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '0.95rem',
        outline: 'none',
        flex: 1,
        width: '100%'
    },
    inputOtp: {
        background: 'none',
        border: 'none',
        color: '#fff',
        fontSize: '1.2rem',
        fontWeight: '800',
        letterSpacing: '0.2em',
        textAlign: 'center',
        outline: 'none',
        flex: 1,
        width: '100%'
    },
    error: {
        color: '#ef4444',
        fontSize: '0.82rem',
        margin: '0 0 0.25rem',
        fontWeight: '600'
    },
    submitBtn: {
        padding: '0.85rem',
        borderRadius: '10px',
        color: '#fff',
        border: 'none',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0.5rem'
    },
    textBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: '600',
        textAlign: 'center',
        textDecoration: 'underline',
        marginTop: '0.5rem',
        outline: 'none'
    },
    helperBox: {
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '0.75rem',
        marginTop: '1.5rem',
        textAlign: 'left'
    },
    helperHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.78rem',
        fontWeight: '700',
        color: '#64748b',
        marginBottom: '0.35rem'
    },
    helperText: {
        fontSize: '0.75rem',
        color: '#475569',
        margin: 0,
        whiteSpace: 'pre-line',
        lineHeight: '1.4'
    }
};