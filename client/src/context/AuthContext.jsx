import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { logoutFirebase } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('sv_token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchMe();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.user);
        } catch {
            localStorage.removeItem('sv_token');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Store auth session helper
    const handleAuthSuccess = (token, userData) => {
        localStorage.setItem('sv_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    // Login with Email or Phone + Password
    const loginWithCredentials = async (identifier, password) => {
        const res = await api.post('/auth/login', { identifier, password });
        return handleAuthSuccess(res.data.token, res.data.user);
    };

    // Register with Email or Phone + Password
    const register = async ({ name, identifier, password, role, ward }) => {
        const res = await api.post('/auth/register', { name, identifier, password, role, ward });
        return handleAuthSuccess(res.data.token, res.data.user);
    };

    // Login or Sign up with Google
    const loginWithGoogle = async ({ email, name, googleId, avatar, token }) => {
        const res = await api.post('/auth/google', { email, name, googleId, avatar, token });
        return handleAuthSuccess(res.data.token, res.data.user);
    };

    // Simulated Phone OTP Login (backward compatible)
    const loginWithOtp = async (phone, otp) => {
        const res = await api.post('/auth/verify', { phone, otp });
        return handleAuthSuccess(res.data.token, res.data.user);
    };

    // Universal login function (supports credentials or otp)
    const login = async (identifier, secret) => {
        // If secret is 6 digits and identifier is all numbers, check if it's OTP or password
        return await loginWithCredentials(identifier, secret);
    };

    const logout = async () => {
        localStorage.removeItem('sv_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        await logoutFirebase();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            login, 
            loginWithCredentials, 
            register, 
            loginWithGoogle, 
            loginWithOtp, 
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;