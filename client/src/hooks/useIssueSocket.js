import { useEffect } from 'react'
import { useSocket } from './useSocket'
import toast from 'react-hot-toast'

export const useIssueSocket = ({ issueId, onStatusUpdate, onNewComment }) => {
    const socketRef = useSocket()

    useEffect(() => {
        const socket = socketRef.current
        if (!socket || !issueId) return

        // Join the issue room
        socket.emit('join_issue', issueId)

        socket.on('issue_updated', (data) => {
            if (data.issueId === issueId) {
                toast(`Status updated to: ${data.status}`, { icon: '🔄' })
                onStatusUpdate?.(data)
            }
        })

        socket.on('new_comment', (comment) => {
            onNewComment?.(comment)
        })

        return () => {
            socket.off('issue_updated')
            socket.off('new_comment')
        }
    }, [issueId])
}