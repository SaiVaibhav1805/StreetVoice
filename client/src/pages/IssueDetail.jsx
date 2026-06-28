import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ThumbsUp, CheckCheck, Share2, Flag, ArrowLeft, Send, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import IssueStatusBadge from '../components/layout/issue/IssueStatusBadge';
import CategoryIcon from '../components/layout/issue/CategoryIcon';
import IssueTimeline from '../components/layout/issue/IssueTimeline';
import { formatDate } from '../utils/formatters';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import { useAuth } from '../context/AuthContext';
import VerifyButton from '../components/layout/issue/VerifyButton';
import { formatDistanceToNow } from '../utils/formatters';
import StatusUpdateModal from '../components/layout/issue/StatusUpdateModal';

const severityColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e'
};

export default function IssueDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upvoted, setUpvoted] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commenting, setCommenting] = useState(false);
    const commentEndRef = useRef(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        fetchIssue();
        
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    const fetchIssue = async () => {
        try {
            const [issueRes, commentRes] = await Promise.all([
                api.get(`/issues/${id}`),
                api.get(`/issues/${id}/comments`)
            ]);
            setIssue(issueRes.data.issue);
            setComments(commentRes.data.comments);
            setUpvoted(issueRes.data.issue.upvotes?.includes(user?._id));
        } catch {
            toast.error('Failed to load issue');
        } finally {
            setLoading(false);
        }
    };

    const handleVerified = (count, status) => {
        setIssue(i => ({ ...i, verificationCount: count, status: status || i.status }));
    };

    const handleComment = async () => {
        if (!newComment.trim()) return;
        try {
            setCommenting(true);
            const res = await api.post(`/issues/${id}/comments`, { text: newComment });
            setComments(c => [...c, res.data.comment]);
            setNewComment('');
            setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch {
            toast.error('Could not post comment');
        } finally {
            setCommenting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/issues/${id}/comments/${commentId}`);
            setComments(c => c.filter(item => item._id !== commentId));
            toast.success('Comment deleted');
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleUpvote = async () => {
        try {
            const res = await api.post(`/issues/${id}/upvote`);
            setUpvoted(res.data.upvoted);
            setIssue(i => ({ ...i, upvoteCount: res.data.upvoteCount }));
            if (res.data.upvoted) {
                toast.success('Issue upvoted!');
            }
        } catch {
            toast.error('Upvote failed');
        }
    };

    if (loading) return (
        <div style={styles.centered}><p>Loading report details...</p></div>
    );

    if (!issue) return (
        <div style={styles.centered}><p>Report not found</p></div>
    );

    const mainDetailsElement = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image (if any) */}
            {issue.media && issue.media.length > 0 && (
                <div style={styles.imageContainer}>
                    <img
                        src={issue.media[0].url}
                        alt={issue.title}
                        style={styles.image}
                    />
                </div>
            )}

            {/* Title & badging */}
            <div style={styles.section}>
                <div style={styles.badgeRow}>
                    <IssueStatusBadge status={issue.status} />
                    <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: `${severityColors[issue.severity]}15`,
                        color: severityColors[issue.severity]
                    }}>
                        {issue.severity?.toUpperCase()}
                    </span>
                </div>

                <h2 style={styles.title}>{issue.title}</h2>

                <div style={styles.metaRow}>
                    <CategoryIcon category={issue.category} size="1rem" />
                    <span style={styles.meta}>
                        {issue.category?.replace('_', ' ')}
                    </span>
                    <span style={styles.dot}>•</span>
                    <span style={styles.meta}>{formatDate(issue.createdAt)}</span>
                </div>

                <div style={styles.locationRow}>
                    <MapPin size={14} color="#94a3b8" />
                    <span style={styles.meta}>
                        {issue.location?.ward || issue.location?.address || 'Location not specified'}
                    </span>
                </div>
            </div>

            {/* Description */}
            {issue.description && (
                <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Description</h4>
                    <p style={styles.descriptionText}>{issue.description}</p>
                </div>
            )}

            {/* Upvoting and verifications */}
            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Community Endorsement</h4>
                <div style={styles.statsButtonsRow}>
                    <button
                        onClick={handleUpvote}
                        style={{
                            ...styles.statBtn,
                            background: upvoted ? '#e6f0ff' : '#f8fafc',
                            color: upvoted ? '#0066FF' : '#64748b',
                            border: upvoted ? '1px solid #bfe4ff' : '1px solid #e2e8f0'
                        }}
                    >
                        <ThumbsUp size={16} />
                        <span>Upvote ({issue.upvoteCount || 0})</span>
                    </button>

                    <VerifyButton
                        issueId={id}
                        verificationCount={issue.verificationCount || 0}
                        onVerified={handleVerified}
                    />
                </div>
            </div>

            {/* Reporter Profile Box */}
            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Reported By</h4>
                <div style={styles.reporterRow}>
                    <div style={styles.avatar}>
                        {issue.reportedBy?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>
                            {issue.reportedBy?.name || 'Anonymous'}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                            {issue.reportedBy?.ward || 'Citizen Contributor'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Authority Action updates */}
            {(user?.role === 'authority' || user?.role === 'moderator') && (
                <div style={{ ...styles.section, border: '1px dashed #7c3aed', background: 'rgba(124, 58, 237, 0.02)' }}>
                    <h4 style={{ ...styles.sectionTitle, color: '#7c3aed' }}>Authority Actions</h4>
                    <button
                        onClick={() => setShowStatusModal(true)}
                        style={{
                            width: '100%', padding: '0.75rem', borderRadius: '10px',
                            background: '#7c3aed', color: '#fff', border: 'none',
                            fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        🔧 Update Case Status
                    </button>
                </div>
            )}
        </div>
    );

    const sidePanelElement = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* AI analysis */}
            {issue.aiAnalysis?.summary && (
                <div style={{ ...styles.section, ...styles.aiBox }}>
                    <h4 style={{ ...styles.sectionTitle, color: '#0066FF', borderBottom: '1px solid rgba(0,102,255,0.1)', paddingBottom: '0.4rem' }}>
                        🤖 AI Diagnosis
                    </h4>
                    <p style={styles.descriptionText}>{issue.aiAnalysis.summary}</p>
                    {issue.aiAnalysis.confidence && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, fontWeight: '600' }}>
                            Gemini Confidence Score: {Math.round(issue.aiAnalysis.confidence * 100)}%
                        </p>
                    )}
                </div>
            )}

            {/* Timeline */}
            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Status Timeline</h4>
                <IssueTimeline
                    currentStatus={issue.status}
                    createdAt={issue.createdAt}
                    resolvedAt={issue.resolvedAt}
                />
            </div>

            {/* Comments and Notes */}
            <div style={styles.section}>
                <h4 style={styles.sectionTitle}>Comments & Notes ({comments.length})</h4>

                {/* Comment scrollbox */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: isMobile ? 'none' : '300px', overflowY: 'auto', paddingRight: '4px' }}>
                    {comments.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No comments yet. Add one below!</p>
                    ) : (
                        comments.map(c => (
                            <div
                                key={c._id}
                                style={{
                                    ...styles.commentCard,
                                    background: c.isAuthorityUpdate ? '#f5f3ff' : '#f8fafc',
                                    border: c.isAuthorityUpdate ? '1px solid #ddd6fe' : '1px solid #f1f5f9'
                                }}
                            >
                                <div style={styles.commentHeader}>
                                    <div style={{ ...styles.avatarMini, background: c.isAuthorityUpdate ? '#7c3aed' : '#0066FF' }}>
                                        {c.author?.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            <span style={styles.commentName}>
                                                {c.author?.name || 'Anonymous'}
                                                {c.isAuthorityUpdate && (
                                                    <span style={styles.authorityTag}>Official</span>
                                                )}
                                            </span>
                                            <span style={styles.commentTime}>
                                                {formatDistanceToNow(c.createdAt)}
                                            </span>
                                        </div>
                                        <p style={styles.commentText}>{c.text}</p>
                                    </div>
                                    {c.author?._id === user?._id && (
                                        <button
                                            onClick={() => handleDeleteComment(c._id)}
                                            style={styles.deleteBtn}
                                        >
                                            <Trash2 size={13} color="#ef4444" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={commentEndRef} />
                </div>

                {/* Post comment input */}
                <div style={styles.commentInput}>
                    <input
                        style={styles.commentField}
                        placeholder="Add your note or question..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleComment()}
                    />
                    <button
                        onClick={handleComment}
                        disabled={commenting || !newComment.trim()}
                        style={{ ...styles.sendBtn, background: commenting || !newComment.trim() ? '#cbd5e1' : '#0066FF' }}
                    >
                        <Send size={14} color="#fff" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <ResponsiveLayout>
            <div style={{ width: '100%' }}>
                {/* Header Back button */}
                <div style={styles.pageHeader}>
                    <button onClick={() => navigate('/home')} style={styles.backBtn}>
                        <ArrowLeft size={16} /> Back to Map
                    </button>
                    <div style={styles.pageMetaHeader}>
                        <span>Case Reference: #{issue._id?.slice(-6)}</span>
                    </div>
                </div>

                {isMobile ? (
                    // Mobile single column layout
                    <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {mainDetailsElement}
                        {sidePanelElement}
                    </div>
                ) : (
                    // Desktop side-by-side double column layout
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', margin: '1rem 0 2rem' }}>
                        {/* Left column details */}
                        <div style={{ flex: 1.3, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                            {mainDetailsElement}
                        </div>

                        {/* Right column details */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {sidePanelElement}
                        </div>
                    </div>
                )}

                {/* Status Update Modal popup */}
                {showStatusModal && (
                    <StatusUpdateModal
                        issue={issue}
                        onClose={() => setShowStatusModal(false)}
                        onUpdated={() => { setShowStatusModal(false); fetchIssue(); }}
                    />
                )}
            </div>
        </ResponsiveLayout>
    );
}

const styles = {
    centered: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e2e8f0',
        marginBottom: '1rem'
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        outline: 'none'
    },
    pageMetaHeader: {
        fontSize: '0.8rem',
        fontWeight: '700',
        color: '#94a3b8'
    },
    imageContainer: {
        width: '100%',
        maxHeight: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
    },
    section: {
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '1.25rem',
        textAlign: 'left'
    },
    badgeRow: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginBottom: '0.75rem'
    },
    title: {
        fontSize: '1.45rem',
        fontWeight: '900',
        color: '#0f172a',
        margin: '0 0 0.75rem',
        letterSpacing: '-0.02em',
        lineHeight: '1.25'
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        marginBottom: '0.5rem',
        color: '#64748b'
    },
    meta: {
        fontSize: '0.82rem',
        fontWeight: '700',
        textTransform: 'capitalize'
    },
    dot: {
        color: '#cbd5e1'
    },
    locationRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        color: '#64748b'
    },
    sectionTitle: {
        fontSize: '0.98rem',
        fontWeight: '800',
        margin: '0 0 0.85rem',
        color: '#1e293b',
        textTransform: 'uppercase',
        letterSpacing: '0.03em'
    },
    descriptionText: {
        fontSize: '0.92rem',
        color: '#475569',
        lineHeight: '1.6',
        margin: 0
    },
    statsButtonsRow: {
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
    },
    statBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.65rem 1.25rem',
        borderRadius: '10px',
        fontSize: '0.85rem',
        fontWeight: '800',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s'
    },
    reporterRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    avatar: {
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        background: '#0066FF',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '1rem',
        flexShrink: 0
    },
    aiBox: {
        background: 'rgba(0,102,255,0.02)',
        border: '1px solid rgba(0,102,255,0.1)',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: 'none'
    },
    commentCard: {
        padding: '0.85rem',
        borderRadius: '12px',
        marginBottom: '0.25rem'
    },
    commentHeader: {
        display: 'flex',
        gap: '0.65rem',
        alignItems: 'flex-start'
    },
    avatarMini: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '0.82rem',
        flexShrink: 0
    },
    commentName: {
        fontWeight: '800',
        fontSize: '0.82rem',
        color: '#1e293b',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem'
    },
    authorityTag: {
        fontSize: '0.62rem',
        fontWeight: '800',
        padding: '0.15rem 0.4rem',
        borderRadius: '10px',
        background: 'rgba(124, 58, 237, 0.1)',
        color: '#7c3aed',
        textTransform: 'uppercase'
    },
    commentTime: {
        fontSize: '0.7rem',
        color: '#94a3b8',
        fontWeight: '600'
    },
    commentText: {
        margin: '0.2rem 0 0',
        fontSize: '0.85rem',
        color: '#334155',
        lineHeight: '1.4',
        textAlign: 'left'
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentInput: {
        display: 'flex',
        gap: '0.5rem',
        background: '#fff',
        border: '1px solid #e2e8f0',
        padding: '0.4rem',
        borderRadius: '10px'
    },
    commentField: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '0.85rem',
        padding: '0.4rem 0.5rem',
        background: 'none',
        color: '#1e293b'
    },
    sendBtn: {
        border: 'none',
        borderRadius: '8px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    }
};