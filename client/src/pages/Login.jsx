import { useState, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const confirmationRef = useRef(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                { size: 'invisible' }
            );
        }
    };

    const sendOTP = async () => {
        setError('');
        if (!phone || phone.length < 10) {
            setError('Enter a valid phone number');
            return;
        }
        try {
            setLoading(true);
            setupRecaptcha();
            const fullPhone = `+91${phone}`; // adjust country code as needed
            const confirmation = await signInWithPhoneNumber(
                auth, fullPhone, window.recaptchaVerifier
            );
            confirmationRef.current = confirmation;
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
            const result = await confirmationRef.current.confirm(otp);
            const idToken = await result.user.getIdToken();
            const isNewUser = await login(idToken);
            navigate(isNewUser ? '/setup-profile' : '/');
        } catch (err) {
            setError('Invalid OTP. Try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div id="recaptcha-container"></div>

            <h1>StreetVoice</h1>
            <p>Your community. Your voice.</p>

            {step === 'phone' && (
                <div className="form-group">
                    <label>Phone Number</label>
                    <div className="phone-input">
                        <span>+91</span>
                        <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button onClick={sendOTP} disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            )}

            {step === 'otp' && (
                <div className="form-group">
                    <label>Enter OTP sent to +91{phone}</label>
                    <input
                        type="number"
                        maxLength={6}
                        placeholder="------"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                    />
                    {error && <p className="error">{error}</p>}
                    <button onClick={verifyOTP} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button className="text-btn" onClick={() => setStep('phone')}>
                        Change Number
                    </button>
                </div>
            )}
        </div>
    );
}