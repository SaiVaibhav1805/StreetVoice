import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

let socketInstance = null

export const useSocket = () => {
    const socketRef = useRef(null)

    useEffect(() => {
        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, { transports: ['websocket'] })
        }
        socketRef.current = socketInstance
        return () => { }
    }, [])

    return socketRef
}