import { useCallback, useEffect, useState } from 'react';
import env from 'utils/EnvRoute';

const useReadCardWithWebSocket = (authId) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const connect = useCallback((url) => {
    const newWs = new WebSocket(url);
    newWs.onmessage = (e) => {
      setError(null);
      setData(JSON.parse(e.data));
    };
    newWs.onerror = (e) => {
      setError(e);
    };
    setWs(newWs);
  }, []);

  const disconnect = useCallback(() => {
    if (!ws) {
      return;
    }
    ws.close();
    setWs(null);
  }, [ws]);

  useEffect(() => {
    connect(`wss://${env.ROOT_READ_CARD}.execute-api.ap-southeast-1.amazonaws.com/v1?auth_id=${authId}`);
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authId]);

  return { data, error, connect, disconnect };
};
export default useReadCardWithWebSocket;
