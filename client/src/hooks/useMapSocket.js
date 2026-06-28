import { useEffect } from 'react'
import { useSocket } from './useSocket'
import toast from 'react-hot-toast'

export const useMapSocket = ({ onNewIssue }) => {
    const socketRef = useSocket()

    useEffect(() => {
        const socket = socketRef.current
        if (!socket) return

        socket.on('new_issue', (issue) => {
            toast(`New issue reported: ${issue.title}`, { icon: '📍' })
            onNewIssue?.(issue)
        })

        return () => {
            socket.off('new_issue')
        }
    }, [])
}