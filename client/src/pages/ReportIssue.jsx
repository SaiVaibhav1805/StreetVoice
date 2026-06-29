import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, MapPin, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import ResponsiveLayout from '../components/layout/ResponsiveLayout'

const CATEGORIES = [
    { value: 'pothole', label: '🕳️ Pothole' },
    { value: 'water_leakage', label: '💧 Water Leakage' },
    { value: 'streetlight', label: '💡 Streetlight' },
    { value: 'garbage', label: '🗑️ Garbage' },
    { value: 'sewage', label: '🚧 Sewage' },
    { value: 'road_damage', label: '🛣️ Road Damage' },
    { value: 'encroachment', label: '🏗️ Encroachment' },
    { value: 'other', label: '📌 Other' },
]

const SEVERITIES = [
    { value: 'low', label: 'Low', color: '#22c55e' },
    { value: 'medium', label: 'Medium', color: '#eab308' },
    { value: 'high', label: 'High', color: '#f97316' },
    { value: 'critical', label: 'Critical', color: '#ef4444' },
]

export default function ReportIssue() {
    const [step, setStep] = useState(1) // 1: photo, 2: ai result, 3: details, 4: confirm
    const [image, setImage] = useState(null)
    const [imageBase64, setImageBase64] = useState(null)
    const [aiAnalysis, setAiAnalysis] = useState(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [location, setLocation] = useState(null)
    const [locating, setLocating] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState({
        title: '', description: '', category: '', severity: 'medium', address: '', ward: ''
    })

    const fileRef = useRef(null)
    const navigate = useNavigate()

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImage(file)
        const preview = URL.createObjectURL(file)

        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            setImageBase64(base64)
        }
        reader.readAsDataURL(file)

        getLocation()

        setAnalyzing(true)
        setStep(2)

        try {
            const reader2 = new FileReader()
            reader2.onload = async () => {
                const base64 = reader2.result.split(',')[1]
                const res = await api.post('/ai/analyze', {
                    imageBase64: base64,
                    mimeType: file.type,
                    description: ''
                })
                const analysis = res.data.analysis
                setAiAnalysis(analysis)
                setForm(f => ({
                    ...f,
                    title: analysis.title || '',
                    category: analysis.category || '',
                    severity: analysis.severity || 'medium'
                }))
            }
            reader2.readAsDataURL(file)
        } catch {
            toast.error('AI analysis failed, fill details manually')
        } finally {
            setAnalyzing(false)
        }
    }

    const getLocation = () => {
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            pos => {
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                })
                setLocating(false)
            },
            () => {
                toast.error('GPS unavailable. Using default Hyderabad coordinates.')
                setLocation({
                    latitude: 17.385,
                    longitude: 78.4867
                })
                setLocating(false)
            }
        )
    }

    const handleSubmit = async () => {
        if (!location) { toast.error('Location is required'); return }
        if (!form.title.trim()) { toast.error('Title is required'); return }
        if (!form.category) { toast.error('Category is required'); return }
        if (!image) { toast.error('Photo is required'); return }

        try {
            setSubmitting(true)
            const formData = new FormData()
            formData.append('image', image)
            formData.append('title', form.title)
            formData.append('description', form.description)
            formData.append('category', form.category)
            formData.append('severity', form.severity)
            formData.append('latitude', location.latitude)
            formData.append('longitude', location.longitude)
            formData.append('address', form.address)
            formData.append('ward', form.ward)

            const res = await api.post('/issues', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (res.data.isDuplicate) {
                toast.success('Similar issue found nearby — your upvote was added!')
            } else {
                toast.success('Issue reported! +10 XP earned 🎉')
            }

            navigate('/home')
        } catch {
            toast.error('Failed to submit issue')
        } finally {
            setSubmitting(false)
        }
    }

    const accentColor = '#0066FF';
    const secondaryAccent = '#FF9500';

    const sharedShellStyle = {
        background: '#FFFFFF',
        borderRadius: 24,
        boxShadow: `10px 10px 22px rgba(15, 23, 42, 0.14), -10px -10px 22px rgba(255, 255, 255, 0.9)`,
        border: `1px solid rgba(255,255,255,0.7)`,
        width: '100%',
        maxWidth: 820,
        padding: 22,
        boxSizing: 'border-box'
    }

    return (
        <ResponsiveLayout>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '12px 0' }}>
                <article style={sharedShellStyle}>
                    <div style={styles.header}>
                        <button onClick={() => navigate('/home')} style={styles.back}>←</button>
                        <h2 style={styles.headerTitle}>Report Issue</h2>
                        <div style={{ width: 32 }} />
                    </div>

                    {/* Progress bar */}
                    <div style={styles.progressBar}>
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} style={{
                                ...styles.progressStep,
                                background: s <= step ? accentColor : 'rgba(15, 23, 42, 0.08)'
                            }} />
                        ))}
                    </div>

                    <div style={styles.body}>

                        {/* Step 1 — Take Photo */}
                        {step === 1 && (
                            <div style={styles.stepContainer}>
                                <h3 style={styles.stepHeading}>📸 Take a Photo</h3>
                                <p style={styles.sub}>Take a clear photo of the issue</p>
                                <div
                                    style={styles.photoBox}
                                    onClick={() => fileRef.current.click()}
                                >
                                    <Camera size={44} color={accentColor} />
                                    <p style={{ color: '#64748b', marginTop: '0.75rem', fontWeight: '700', fontSize: '0.9rem' }}>
                                        Tap to capture or upload
                                    </p>
                                </div>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </div>
                        )}

                        {/* Step 2 — AI Analysis */}
                        {step === 2 && (
                            <div style={styles.stepContainer}>
                                <h3 style={styles.stepHeading}>🤖 AI Analysis</h3>

                                {image && (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Issue"
                                        style={styles.preview}
                                    />
                                )}

                                {analyzing ? (
                                    <div style={styles.analyzing}>
                                        <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} color={accentColor} />
                                        <p style={{ fontWeight: '600', color: '#475569' }}>Gemini AI is analyzing your image...</p>
                                    </div>
                                ) : aiAnalysis ? (
                                    <div style={styles.aiCard}>
                                        <div style={styles.aiRow}>
                                            <CheckCircle size={18} color="#22c55e" />
                                            <span style={{ color: '#1e293b' }}><strong>Category:</strong> {aiAnalysis.category?.replace('_', ' ')}</span>
                                        </div>
                                        <div style={styles.aiRow}>
                                            <CheckCircle size={18} color="#22c55e" />
                                            <span style={{ color: '#1e293b' }}><strong>Severity:</strong> {aiAnalysis.severity}</span>
                                        </div>
                                        <div style={styles.aiRow}>
                                            <CheckCircle size={18} color="#22c55e" />
                                            <span style={{ color: '#1e293b' }}><strong>Summary:</strong> {aiAnalysis.summary}</span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: '600' }}>
                                            Confidence: {Math.round((aiAnalysis.confidence || 0) * 100)}%
                                        </p>
                                    </div>
                                ) : (
                                    <div style={styles.aiCardError}>
                                        <AlertCircle size={18} color={secondaryAccent} />
                                        <span style={{ marginLeft: 8, color: '#c2410c', fontWeight: '700' }}>AI analysis failed, fill details manually</span>
                                    </div>
                                )}

                                <button
                                    style={{ ...styles.button, background: accentColor }}
                                    onClick={() => setStep(3)}
                                    disabled={analyzing}
                                >
                                    {analyzing ? 'Analyzing...' : 'Continue →'}
                                </button>
                            </div>
                        )}

                        {/* Step 3 — Details */}
                        {step === 3 && (
                            <div style={styles.stepContainer}>
                                <h3 style={styles.stepHeading}>📝 Issue Details</h3>

                                <label style={styles.label}>Title</label>
                                <input
                                    style={styles.input}
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Brief title of the issue"
                                />

                                <label style={styles.label}>Description (optional)</label>
                                <textarea
                                    style={{ ...styles.input, height: '120px', resize: 'none' }}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Any additional details..."
                                />

                                <label style={styles.label}>Category</label>
                                <div style={styles.grid}>
                                    {CATEGORIES.map(c => {
                                        const active = form.category === c.value;
                                        return (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, category: c.value }))}
                                                style={{
                                                    ...styles.gridBtn,
                                                    border: active ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.7)',
                                                    background: active ? 'rgba(0, 102, 255, 0.06)' : 'rgba(255,255,255,0.6)',
                                                    color: active ? accentColor : '#475569',
                                                    boxShadow: active 
                                                        ? 'inset 2px 2px 5px rgba(0,102,255,0.1)' 
                                                        : 'inset 2px 2px 5px rgba(15,23,42,0.04), inset -2px -2px 5px rgba(255,255,255,0.9)'
                                                }}
                                            >
                                                {c.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <label style={styles.label}>Severity</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {SEVERITIES.map(s => {
                                        const active = form.severity === s.value;
                                        return (
                                            <button
                                                key={s.value}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, severity: s.value }))}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem 0.5rem',
                                                    borderRadius: '12px',
                                                    border: active ? `2px solid ${s.color}` : '1px solid rgba(255,255,255,0.7)',
                                                    background: active ? `${s.color}15` : 'rgba(255,255,255,0.6)',
                                                    color: s.color,
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    fontSize: '0.82rem',
                                                    boxShadow: active ? 'none' : 'inset 2px 2px 5px rgba(15,23,42,0.04), inset -2px -2px 5px rgba(255,255,255,0.9)'
                                                }}
                                            >
                                                {s.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <label style={{ ...styles.label, marginTop: '0.5rem' }}>Ward / Area</label>
                                <input
                                    style={styles.input}
                                    value={form.ward}
                                    onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                                    placeholder="e.g. Ward 12, Banjara Hills"
                                />

                                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        style={{ ...styles.actionBtn, background: secondaryAccent }}
                                    >
                                        Upload Photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(4)}
                                        style={{ ...styles.actionBtn, background: accentColor, flex: 1.5 }}
                                    >
                                        Review & Submit →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 4 — Confirm */}
                        {step === 4 && (
                            <div style={styles.stepContainer}>
                                <h3 style={styles.stepHeading}>Confirm Report</h3>

                                {image && (
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Issue"
                                        style={styles.preview}
                                    />
                                )}

                                <div style={styles.confirmCard}>
                                    <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#64748b' }}>Title:</strong> {form.title}</p>
                                    <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#64748b' }}>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{form.category?.replace('_', ' ')}</span></p>
                                    <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#64748b' }}>Severity:</strong> <span style={{ textTransform: 'capitalize' }}>{form.severity}</span></p>
                                    <p style={{ margin: '0 0 6px' }}><strong style={{ color: '#64748b' }}>Ward:</strong> {form.ward || 'Not specified'}</p>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                                        <MapPin size={14} color={accentColor} />
                                        <strong style={{ color: '#64748b' }}>Location:</strong>&nbsp;
                                        {location
                                            ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                                            : locating ? 'Getting location...' : 'Not found'
                                        }
                                    </p>
                                </div>

                                <button
                                    style={{ ...styles.actionBtn, background: accentColor }}
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : '🚀 Submit Report'}
                                </button>

                                <button
                                    style={{ ...styles.actionBtn, background: 'rgba(255,255,255,0.6)', color: '#475569', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '4px 4px 10px rgba(15,23,42,0.05)', marginTop: '0.5rem' }}
                                    onClick={() => setStep(3)}
                                >
                                    ← Edit Details
                                </button>
                            </div>
                        )}
                    </div>
                    <style>{`
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    `}</style>
                </article>
            </div>
        </ResponsiveLayout>
    )
}

const styles = {
    container: { minHeight: '100%', background: '#fff' },
    header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)'
    },
    headerTitle: { margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em', fontFamily: 'Clash Display, Satoshi, sans-serif' },
    back: { background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', fontWeight: '900', color: '#64748b' },
    progressBar: { display: 'flex', gap: '8px', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' },
    progressStep: { flex: 1, height: '6px', borderRadius: '3px', transition: 'background 0.3s' },
    body: { padding: '1.5rem 0 0' },
    stepContainer: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    stepHeading: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.01em', fontFamily: 'Clash Display, Satoshi, sans-serif' },
    sub: { color: '#64748b', margin: 0, fontSize: '0.85rem', fontWeight: '600' },
    photoBox: {
        borderRadius: '16px',
        padding: '4rem 1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        cursor: 'pointer', 
        background: 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: 'inset 6px 6px 12px rgba(15,23,42,0.12), inset -6px -6px 12px rgba(255,255,255,0.95)'
    },
    preview: { width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '220px', border: '1px solid rgba(255, 255, 255, 0.7)', boxShadow: '4px 4px 10px rgba(0,0,0,0.02)' },
    analyzing: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem' },
    aiCard: {
        background: 'rgba(34,197,94,0.06)', border: '1px solid #bbf7d0',
        borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    },
    aiCardError: {
        background: 'rgba(249,115,22,0.06)', border: '1px solid #fed7aa',
        borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
    },
    aiRow: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' },
    label: { fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px', display: 'block', color: '#0f172a' },
    input: {
        width: '100%', padding: '12px', borderRadius: '14px',
        border: 'none', fontSize: '0.92rem',
        boxSizing: 'border-box', background: 'rgba(255,255,255,0.65)',
        boxShadow: 'inset 6px 6px 12px rgba(15, 23, 42, 0.12), inset -6px -6px 12px rgba(255, 255, 255, 0.95)', outline: 'none',
        color: '#0f172a', fontWeight: '500'
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
    gridBtn: {
        padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
        fontSize: '0.88rem', textAlign: 'left', fontWeight: '700', transition: 'all 0.15s'
    },
    button: {
        width: '100%', padding: '0.85rem',
        color: '#fff', border: 'none', borderRadius: '14px',
        fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', marginTop: '0.5rem',
        boxShadow: '0 8px 24px rgba(0, 102, 255, 0.25)'
    },
    actionBtn: {
        border: "none",
        borderRadius: 12,
        padding: "10px 14px",
        color: "#FFFFFF",
        cursor: "pointer",
        fontWeight: '700',
        fontSize: '0.9rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    confirmCard: {
        background: 'rgba(255,255,255,0.65)', borderRadius: '16px', padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        boxShadow: 'inset 6px 6px 12px rgba(15,23,42,0.12), inset -6px -6px 12px rgba(255, 255, 255, 0.95)'
    }
}