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

    // Step 1 — Photo capture
    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setImage(file)
        const preview = URL.createObjectURL(file)

        // Convert to base64 for AI
        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            setImageBase64(base64)
        }
        reader.readAsDataURL(file)

        // Auto get location
        getLocation()

        // Run AI analysis
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

    return (
        <ResponsiveLayout>
            <div style={styles.cardContainer}>
                <div style={styles.container}>
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
                        background: s <= step ? '#2563eb' : '#e2e8f0'
                    }} />
                ))}
            </div>

            <div style={styles.body}>

                {/* Step 1 — Take Photo */}
                {step === 1 && (
                    <div style={styles.stepContainer}>
                        <h3>📸 Take a Photo</h3>
                        <p style={styles.sub}>Take a clear photo of the issue</p>
                        <div
                            style={styles.photoBox}
                            onClick={() => fileRef.current.click()}
                        >
                            <Camera size={48} color="#94a3b8" />
                            <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
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
                        <h3>🤖 AI Analysis</h3>

                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Issue"
                                style={styles.preview}
                            />
                        )}

                        {analyzing ? (
                            <div style={styles.analyzing}>
                                <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} color="#2563eb" />
                                <p>Gemini AI is analyzing your image...</p>
                            </div>
                        ) : aiAnalysis ? (
                            <div style={styles.aiCard}>
                                <div style={styles.aiRow}>
                                    <CheckCircle size={18} color="#22c55e" />
                                    <span><strong>Category:</strong> {aiAnalysis.category?.replace('_', ' ')}</span>
                                </div>
                                <div style={styles.aiRow}>
                                    <CheckCircle size={18} color="#22c55e" />
                                    <span><strong>Severity:</strong> {aiAnalysis.severity}</span>
                                </div>
                                <div style={styles.aiRow}>
                                    <CheckCircle size={18} color="#22c55e" />
                                    <span><strong>Summary:</strong> {aiAnalysis.summary}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    Confidence: {Math.round((aiAnalysis.confidence || 0) * 100)}%
                                </p>
                            </div>
                        ) : (
                            <div style={styles.aiCard}>
                                <AlertCircle size={18} color="#f97316" />
                                <span style={{ marginLeft: 8 }}>AI unavailable — fill details manually</span>
                            </div>
                        )}

                        <button
                            style={styles.button}
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
                        <h3>📝 Issue Details</h3>

                        <label style={styles.label}>Title</label>
                        <input
                            style={styles.input}
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Brief title of the issue"
                        />

                        <label style={styles.label}>Description (optional)</label>
                        <textarea
                            style={{ ...styles.input, height: '80px', resize: 'none' }}
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Any additional details..."
                        />

                        <label style={styles.label}>Category</label>
                        <div style={styles.grid}>
                            {CATEGORIES.map(c => (
                                <button
                                    key={c.value}
                                    onClick={() => setForm(f => ({ ...f, category: c.value }))}
                                    style={{
                                        ...styles.gridBtn,
                                        border: form.category === c.value
                                            ? '2px solid #2563eb'
                                            : '2px solid #e2e8f0',
                                        background: form.category === c.value ? '#eff6ff' : '#fff'
                                    }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>

                        <label style={styles.label}>Severity</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {SEVERITIES.map(s => (
                                <button
                                    key={s.value}
                                    onClick={() => setForm(f => ({ ...f, severity: s.value }))}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: form.severity === s.value
                                            ? `2px solid ${s.color}`
                                            : '2px solid #e2e8f0',
                                        background: form.severity === s.value ? `${s.color}20` : '#fff',
                                        color: s.color,
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        <label style={{ ...styles.label, marginTop: '1rem' }}>Ward / Area</label>
                        <input
                            style={styles.input}
                            value={form.ward}
                            onChange={e => setForm(f => ({ ...f, ward: e.target.value }))}
                            placeholder="e.g. Ward 12, Banjara Hills"
                        />

                        <button style={styles.button} onClick={() => setStep(4)}>
                            Review & Submit →
                        </button>
                    </div>
                )}

                {/* Step 4 — Confirm */}
                {step === 4 && (
                    <div style={styles.stepContainer}>
                        <h3>✅ Confirm Report</h3>

                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Issue"
                                style={styles.preview}
                            />
                        )}

                        <div style={styles.confirmCard}>
                            <p><strong>Title:</strong> {form.title}</p>
                            <p><strong>Category:</strong> {form.category?.replace('_', ' ')}</p>
                            <p><strong>Severity:</strong> {form.severity}</p>
                            <p><strong>Ward:</strong> {form.ward || 'Not specified'}</p>
                            <p style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <MapPin size={14} />
                                <strong>Location:</strong>&nbsp;
                                {location
                                    ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                                    : locating ? 'Getting location...' : 'Not found'
                                }
                            </p>
                        </div>

                        <button
                            style={styles.button}
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : '🚀 Submit Report'}
                        </button>

                        <button
                            style={{ ...styles.button, background: '#f1f5f9', color: '#333', marginTop: '0.5rem' }}
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
            </div>
            </div>
        </ResponsiveLayout>
    )
}

const styles = {
    cardContainer: {
        maxWidth: '550px',
        margin: '2rem auto',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        boxSizing: 'border-box'
    },
    container: { minHeight: '100%', background: '#fff' },
    header: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 1.5rem', background: '#fff', borderBottom: '1px solid #f1f5f9'
    },
    headerTitle: { margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.01em' },
    back: { background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', fontWeight: '900', color: '#64748b' },
    progressBar: { display: 'flex', gap: '8px', padding: '1rem', background: '#fff', borderBottom: '1px solid #f1f5f9' },
    progressStep: { flex: 1, height: '6px', borderRadius: '3px', transition: 'background 0.3s' },
    body: { padding: '1.5rem' },
    stepContainer: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    sub: { color: '#64748b', margin: 0, fontSize: '0.85rem', fontWeight: '600' },
    photoBox: {
        border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '20px',
        padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column',
        alignItems: 'center', cursor: 'pointer', background: '#f0f3f8',
        boxShadow: 'var(--shadow-concave)'
    },
    preview: { width: '100%', borderRadius: '16px', objectFit: 'cover', maxHeight: '220px', border: '1px solid #e2e8f0' },
    analyzing: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem' },
    aiCard: {
        background: '#f0fdf4', border: '1px solid #bbf7d0',
        borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    },
    aiRow: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' },
    label: { fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.25rem', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.02em' },
    input: {
        width: '100%', padding: '0.85rem', borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.4)', fontSize: '0.95rem',
        boxSizing: 'border-box', background: '#f0f3f8',
        boxShadow: 'var(--shadow-concave)', outline: 'none'
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
    gridBtn: {
        padding: '0.75rem', borderRadius: '12px', cursor: 'pointer',
        fontSize: '0.88rem', textAlign: 'left', fontWeight: '700'
    },
    button: {
        width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #0066FF 0%, #0052cc 100%)',
        color: '#fff', border: 'none', borderRadius: '12px',
        fontSize: '0.95rem', fontWeight: '800', cursor: 'pointer', marginTop: '0.5rem',
        boxShadow: '0 4px 15px rgba(0, 102, 255, 0.2)'
    },
    confirmCard: {
        background: '#f8fafc', borderRadius: '16px', padding: '1.25rem',
        border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }
}