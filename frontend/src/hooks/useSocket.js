import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (token, onCreated, onUpdated, onDeleted) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(process.env.REACT_APP_API_URL, { auth: { token } });
    socketRef.current.on('connect',      () => console.log('⚡ Real-time connected!'));
    socketRef.current.on('task:created', (task) => onCreated && onCreated(task));
    socketRef.current.on('task:updated', (task) => onUpdated && onUpdated(task));
    socketRef.current.on('task:deleted', ({ id }) => onDeleted && onDeleted(id));

    return () => socketRef.current?.disconnect();
  }, [token]);

  return socketRef;
};