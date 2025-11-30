import { useEffect, useRef } from 'react';
import { useNotifications } from '../state/notifications';
import { useToken } from '../state/token';
import { useAuth } from '../state/auth';
import { UserRole } from '../types/enums';

const API_URL = import.meta.env.VITE_API_URL;

export const useNotificationsStream = () => {
  const { addNotification, setConnected } = useNotifications();
  const token = useToken((state) => state.token);
  const currentUser = useAuth((state) => state.currentUser);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.PRODUCER || !token) {
      setConnected(false);
      return;
    }

    let isMounted = true;
    abortControllerRef.current = new AbortController();

    const connectToStream = async () => {
      try {
        const response = await fetch(`${API_URL}/notifications/stream`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        setConnected(true);

        while (isMounted) {
          const { done, value } = await reader.read();

          if (done) {
            if (isMounted) {
              console.log('SSE stream closed, reconnecting...');
              setTimeout(() => {
                if (isMounted) {
                  connectToStream();
                }
              }, 5000);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'ping') {
                  continue;
                }

                if (data.type === 'NEW_ORDER' || data.type === 'LOW_STOCK') {
                  addNotification({
                    type: data.type,
                    data: data,
                    timestamp: new Date().toISOString(),
                  });
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.error('Error connecting to notifications stream:', error);
        setConnected(false);
        
        setTimeout(() => {
          if (isMounted) {
            connectToStream();
          }
        }, 5000);
      }
    };

    connectToStream();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setConnected(false);
    };
  }, [currentUser, token, addNotification, setConnected]);
};

