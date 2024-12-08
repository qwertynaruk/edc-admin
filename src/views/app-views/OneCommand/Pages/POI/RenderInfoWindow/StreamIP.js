import { useEffect, useState } from 'react';
import 'video.js/dist/video-js.css';
import { login, start } from './MilestoneStream/main';

const StreamIP = ({ cctvId = '' }) => {
  const [msToken, setMsToken] = useState('');

  // api : https://udoncop-cctv.supakit.info/api/
  // server : https://udoncop-cctv.supakit.info/
  // username: udoncop_api
  // password: P@ssw0rd@udoncop

  useEffect(() => {
    login().then((_token) => setMsToken(_token));
  }, []);

  useEffect(() => {
    if (msToken) {
      start(cctvId, msToken);
    }
  }, [cctvId, msToken]);

  return <video className="video-js" controls autoPlay id="videoCtl" width="330" height="200"></video>;
};

export default StreamIP;
