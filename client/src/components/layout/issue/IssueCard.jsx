import { useNavigate } from 'react-router-dom'
import { MapPin, ThumbsUp, CheckCheck, MessageCircle } from 'lucide-react'
import IssueStatusBadge from './IssueStatusBadge'
import CategoryIcon from './CategoryIcon'
import { formatDistanceToNow } from '../../../utils/formatters'

export default function IssueCard({ issue }) {
    const navigate = useNavigate()

    return (
        <div
            style={styles.card}
            onClick={() => navigate(`/issue/${issue._id}`)}
        >
            {/* Left — image or icon */}
            <div style={styles.left}>
                {issue.media?.[0]?.url ? (
                    <img
                        src={issue.media[0].url}
                        alt={issue.title}
                        style={styles.thumbnail}
                    />
                ) : (
                    <div style={styles.iconBox}>
                        <CategoryIcon category={issue.category} size="2rem" />
                    </div>
                )}
            </div>

            {/* Right — content */}
            <div style={styles.right}>
                <div style={styles.topRow}>
                    <IssueStatusBadge status={issue.status} />
                    <span style={styles.time}>
                        {formatDistanceToNow(issue.createdAt)}
                    </span>
                </div>

                <h4 style={styles.title}>{issue.title}</h4>

                <div style={styles.location}>
                    <MapPin size={12} color="#94a3b8" />
                    <span>{issue.location?.ward || issue.location?.address || 'Location not specified'}</span>
                </div>

                <div style={styles.footer}>
                    <span style={styles.stat}>
                        <ThumbsUp size={13} /> {issue.upvoteCount || 0}
                    </span>
                    <span style={styles.stat}>
                        <CheckCheck size={13} /> {issue.verificationCount || 0}
                    </span>
                    <span style={styles.stat}>
                        <MessageCircle size={13} /> {issue.commentCount || 0}
                    </span>
                    <span style={styles.category}>
                        {issue.category?.replace('_', ' ')}
                    </span>
                </div>
            </div>
        </div>
    )
}

const styles = {
    card: {
        display: 'flex',
        gap: '0.75rem',
        background: '#fff',
        borderRadius: '12px',
        padding: '0.75rem',
        cursor: 'pointer',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s'
    },
    left: { flexShrink: 0 },
    thumbnail: {
        width: '72px',
        height: '72px',
        borderRadius: '8px',
        objectFit: 'cover'
    },
    iconBox: {
        width: '72px',
        height: '72px',
        borderRadius: '8px',
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0 },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    time: { fontSize: '0.7rem', color: '#94a3b8' },
    title: {
        margin: 0,
        fontSize: '0.95rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    location: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        color: '#94a3b8'
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginTop: '0.25rem'
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        fontSize: '0.78rem',
        color: '#64748b'
    },
    category: {
        marginLeft: 'auto',
        fontSize: '0.7rem',
        color: '#94a3b8',
        textTransform: 'capitalize'
    }
}