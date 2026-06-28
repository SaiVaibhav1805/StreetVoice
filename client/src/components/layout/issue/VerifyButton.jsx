import { useState } from 'react'
import { CheckCheck, Loader } from 'lucide-react'
import api from '../../../services/api'
import toast from 'react-hot-toast'

export default function VerifyButton({ issueId, verificationCount, onVerified }) {
    const [loading, setLoading] = useState(false)
    const [verified, setVerified] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [comment, setComment] = useState('')

    const handleVerify = async () => {
        try {
            setLoading(true)
            const res = await api.post(`/issues/${issueId}/verifications`, { comment })
            setVerified(true)
            setShowModal(false)
            toast.success(res.data.message)
            onVerified?.(res.data.verificationCount, res.data.status)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => !verified && setShowModal(true)}
                style={{
                    ...styles.btn,
                    background: verified ? '#dcfce7' : '#f0fdf4',
                    color: verified ? '#16a34a' : '#15803d',
                    border: verified ? '1px solid #86efac' : '1px solid #bbf7d0',
                    cursor: verified ? 'default' : 'pointer'
                }}
                disabled={verified}
            >
                <CheckCheck size={16} />
                <span>{verified ? 'Verified ✓' : `Verify (${verificationCount})`}</span>
            </button>

            {/* Verify Modal */}
            {showModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={{ margin: '0 0 0.5rem' }}>Verify this issue?</h3>
                        <p style={styles.modalSub}>
                            Confirm you have seen this issue in person.
                            3 verifications will escalate it to authorities.
                        </p>

                        <label style={styles.label}>Add a comment (optional)</label>
                        <textarea
                            style={styles.textarea}
                            placeholder="e.g. Confirmed, still not fixed as of today"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />

                        <div style={styles.modalBtns}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.confirmBtn}
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading
                                    ? <><Loader size={14} /> Verifying...</>
                                    : <><CheckCheck size={14} /> Confirm Verify</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const styles = {
    btn: {
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.5rem 1rem', borderRadius: '8px',
        fontSize: '0.85rem', fontWeight: '600'
    },
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '1.5rem', width: '100%', maxWidth: '500px'
    },
    modalSub: { color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem' },
    label: { display: 'block', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem' },
    textarea: {
        width: '100%', padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #e2e8f0', fontSize: '0.9rem',
        height: '80px', resize: 'none', boxSizing: 'border-box',
        marginBottom: '1rem'
    },
    modalBtns: { display: 'flex', gap: '0.75rem' },
    cancelBtn: {
        flex: 1, padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #e2e8f0', background: '#f8fafc',
        cursor: 'pointer', fontWeight: '600'
    },
    confirmBtn: {
        flex: 1, padding: '0.75rem', borderRadius: '8px',
        border: 'none', background: '#16a34a', color: '#fff',
        cursor: 'pointer', fontWeight: '600',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
    }
}