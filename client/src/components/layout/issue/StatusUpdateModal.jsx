import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import api from '../../../services/api'
import toast from 'react-hot-toast'
import IssueStatusBadge from './IssueStatusBadge'

const STATUSES = [
    { value: 'reported', label: 'Reported', icon: '📍' },
    { value: 'verified', label: 'Verified', icon: '✅' },
    { value: 'assigned', label: 'Assigned', icon: '👷' },
    { value: 'in_progress', label: 'In Progress', icon: '🔧' },
    { value: 'resolved', label: 'Resolved', icon: '🎉' },
]

export default function StatusUpdateModal({ issue, onClose, onUpdated }) {
    const [status, setStatus] = useState(issue.status)
    const [note, setNote] = useState('')
    const [estDate, setEstDate] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (status === issue.status && !note.trim()) {
            toast.error('Change status or add a note')
            return
        }
        try {
            setLoading(true)
            await api.patch(`/authority/issues/${issue._id}/status`, {
                status,
                note,
                estimatedResolution: estDate || null
            })
            toast.success('Status updated successfully')
            onUpdated()
        } catch {
            toast.error('Failed to update status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.modalHeader}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Update Issue Status</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                {/* Issue info */}
                <div style={styles.issueInfo}>
                    <p style={styles.issueTitle}>{issue.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={styles.currentLabel}>Current:</span>
                        <IssueStatusBadge status={issue.status} />
                    </div>
                </div>

                {/* Status selector */}
                <label style={styles.label}>New Status</label>
                <div style={styles.statusGrid}>
                    {STATUSES.map(s => (
                        <button
                            key={s.value}
                            onClick={() => setStatus(s.value)}
                            style={{
                                ...styles.statusBtn,
                                border: status === s.value
                                    ? '2px solid #2563eb'
                                    : '2px solid #e2e8f0',
                                background: status === s.value ? '#eff6ff' : '#fff'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: '600' }}>{s.label}</span>
                        </button>
                    ))}
                </div>

                {/* Note */}
                <label style={styles.label}>Update Note</label>
                <textarea
                    style={styles.textarea}
                    placeholder="e.g. Team dispatched, will fix by tomorrow morning"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />

                {/* Estimated resolution — only if not resolved */}
                {status !== 'resolved' && (
                    <>
                        <label style={styles.label}>Estimated Resolution Date (optional)</label>
                        <input
                            type="date"
                            style={styles.input}
                            value={estDate}
                            onChange={e => setEstDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </>
                )}

                {/* Actions */}
                <div style={styles.actions}>
                    <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={styles.submitBtn}
                    >
                        {loading
                            ? <><Loader size={14} /> Updating...</>
                            : '✓ Update Status'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2000
    },
    modal: {
        background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '1.25rem', width: '100%', maxWidth: '500px',
        maxHeight: '90vh', overflowY: 'auto'
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1rem'
    },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
    issueInfo: {
        background: '#f8fafc', borderRadius: '8px',
        padding: '0.75rem', marginBottom: '1rem'
    },
    issueTitle: { margin: '0 0 0.35rem', fontWeight: '600', fontSize: '0.9rem' },
    currentLabel: { fontSize: '0.8rem', color: '#64748b' },
    label: { display: 'block', fontWeight: '600', fontSize: '0.85rem', margin: '0.75rem 0 0.4rem' },
    statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' },
    statusBtn: {
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '0.25rem', padding: '0.5rem 0.25rem', borderRadius: '8px', cursor: 'pointer'
    },
    textarea: {
        width: '100%', padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #e2e8f0', fontSize: '0.9rem',
        height: '80px', resize: 'none', boxSizing: 'border-box'
    },
    input: {
        width: '100%', padding: '0.65rem', borderRadius: '8px',
        border: '1px solid #e2e8f0', fontSize: '0.9rem', boxSizing: 'border-box'
    },
    actions: { display: 'flex', gap: '0.75rem', marginTop: '1.25rem' },
    cancelBtn: {
        flex: 1, padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #e2e8f0', background: '#f8fafc',
        cursor: 'pointer', fontWeight: '600'
    },
    submitBtn: {
        flex: 2, padding: '0.75rem', borderRadius: '8px',
        border: 'none', background: '#2563eb', color: '#fff',
        cursor: 'pointer', fontWeight: '600',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
    }
}