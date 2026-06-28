import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function SetupProfile() {
    const [name, setName] = useState('')
    const [ward, setWard] = useState('')
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async () => {
        if (!name.trim()) { toast.error('Name is required'); return }
        if (!ward.trim()) { toast.error('Ward/Area is required'); return }

        try {
            setLoading(true)
            const res = await api.put('/auth/profile', { name, ward })
            setUser(res.data.user)
            toast.success('Profile saved!')
            navigate('/home')
        } catch {
            toast.error('Failed to save profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome to StreetVoice 👋</h2>
                <p style={styles.sub}>Tell us a bit about yourself</p>

                <label style={styles.label}>Your Name</label>
                <input
                    style={styles.input}
                    placeholder="e.g. Ravi Kumar"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label style={styles.label}>Ward / Area</label>
                <input
                    style={styles.input}
                    placeholder="e.g. Ward 12, Banjara Hills"
                    value={ward}
                    onChange={e => setWard(e.target.value)}
                />

                <button
                    style={styles.button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Get Started →'}
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f6f9',
        padding: '1rem'
    },
    card: {
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
    },
    title: { margin: '0 0 0.25rem', fontSize: '1.5rem' },
    sub: { margin: '0 0 1.5rem', color: '#666' },
    label: { display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.9rem' },
    input: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '1rem',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '0.85rem',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer'
    }
}