import { useNavigate } from 'react-router-dom'
import { MapPin, ThumbsUp, CheckCheck, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import IssueStatusBadge from './IssueStatusBadge'
import CategoryIcon from './CategoryIcon'
import { formatDistanceToNow } from '../../../utils/formatters'

export default function IssueCard({ issue }) {
    const navigate = useNavigate()

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
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
                        <CategoryIcon category={issue.category} size="1.8rem" />
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
                        <ThumbsUp size={13} color="#64748b" /> {issue.upvoteCount || 0}
                    </span>
                    <span style={styles.stat}>
                        <CheckCheck size={13} color="#64748b" /> {issue.verificationCount || 0}
                    </span>
                    <span style={styles.stat}>
                        <MessageCircle size={13} color="#64748b" /> {issue.commentCount || 0}
                    </span>
                    <span style={styles.category}>
                        {issue.category?.replace('_', ' ')}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

const styles = {
    card: {
        display: 'flex',
        gap: '0.75rem',
        background: '#fff',
        borderRadius: '16px',
        padding: '0.85rem',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '6px 6px 14px rgba(15, 23, 42, 0.12), -6px -6px 14px rgba(255, 255, 255, 0.96)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box'
    },
    left: { flexShrink: 0 },
    thumbnail: {
        width: '74px',
        height: '74px',
        borderRadius: '12px',
        objectFit: 'cover'
    },
    iconBox: {
        width: '74px',
        height: '74px',
        borderRadius: '12px',
        background: '#f0f3f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 2px 2px 5px rgba(15,23,42,0.05), inset -2px -2px 5px rgba(255,255,255,0.9)'
    },
    right: { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0 },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    time: { fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' },
    title: {
        margin: 0,
        fontSize: '0.95rem',
        fontWeight: '700',
        color: '#0f172a',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    location: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        color: '#64748b',
        fontWeight: '500'
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
        color: '#64748b',
        fontWeight: '600'
    },
    category: {
        marginLeft: 'auto',
        fontSize: '0.72rem',
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'capitalize'
    }
}