'use strict';

const STUN_URL = 'stun:stun1.l.google.com:19302';

let pc, sessionId;
const serverUrl = 'https://cctv.udoncop.com/api/';
let idpserver = 'https://cctv.udoncop.com/';
const username = 'udoncop_api';
const password = 'P@ssw0rd@udoncop';
let cameraId = '';
let token = '';
const candidates = [];

export const start = async (sourceCameraId = '', msToken = '') => {
  cameraId = sourceCameraId;
  token = msToken;
  if (pc != null) await pc.close();
  pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });

  pc.ontrack = (evt) => (document.querySelector('#videoCtl').srcObject = evt.streams[0]);
  pc.onicecandidate = (evt) => evt.candidate && sendIceCandidate(JSON.stringify(evt.candidate));
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected') {
      console.log('Peers connected');
    } else {
      console.log('Connection state changed: ' + pc.connectionState);
    }
  };

  // Diagnostics
  pc.onicegatheringstatechange = () => console.log('onicegatheringstatechange: ' + pc.iceGatheringState);
  pc.oniceconnectionstatechange = () => console.log('oniceconnectionstatechange: ' + pc.iceConnectionState);
  pc.onsignalingstatechange = () => console.log('onsignalingstatechange: ' + pc.signalingState);

  initiateWebRTCSession();
};

export const closePeer = async () => {
  await pc.close();
};

export const initiateWebRTCSession = async () => {
  try {
    // Initiate WebRTC session on the server
    const body = { cameraId, resolution: 'notInUse' };
    const response = await fetch(serverUrl + '/WebRTC/v1/WebRTCSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    sessionId = json.sessionId;

    // Update answerSDP value on the server
    await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(json.offerSDP)));
    console.log('remote sdp:\n' + pc.remoteDescription.sdp);
    pc.createAnswer()
      .then((answer) => pc.setLocalDescription(answer))
      .then(() => updateAnswerSDP(json, JSON.stringify(pc.localDescription)));
    console.log('local description:\n' + pc.setLocalDescription);

    // Add server Ice candidates
    addServerIceCandidates();

    console.log('InitiateWebRTCSession end');
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateAnswerSDP = async (data, localDescription) => {
  try {
    data.answerSDP = localDescription;
    const response = await fetch(serverUrl + '/WebRTC/v1/WebRTCSession', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    });

    if (await response.ok) {
      console.log('AnswerSDP updated sucessfully');
    }

    const json = response.json();
    console.log('Updated WebRTC session object: ' + json);
    return json;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addServerIceCandidates = async () => {
  try {
    const response = await fetch(serverUrl + '/WebRTC/v1/IceCandidates/' + sessionId, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    const json = await response.json();
    for (const element of json.candidates) {
      if (!candidates.includes(element)) {
        console.log('Ice candidate data: ' + element);
        candidates.push(element);
        const obj = JSON.parse(element);
        await pc.addIceCandidate(obj);
      }
    }

    if (pc.iceConnectionState === 'new' || pc.iceConnectionState === 'checking') {
      setTimeout(addServerIceCandidates, 20);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const sendIceCandidate = async (candidate) => {
  try {
    const body = { sessionId, candidates: [candidate] };
    const response = await fetch(serverUrl + '/WebRTC/v1/IceCandidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    });

    if (await response.ok) {
      console.log('Client candidates sent successfully');
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const login = async () => {
  if (pc != null) await pc.close();

  try {
    const lastchar = idpserver.substr(idpserver.length - 1);
    if (lastchar !== '/') {
      idpserver += '/';
    }
    const final = idpserver + 'IDP/connect/token';

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'password');
    urlencoded.append('username', username);
    urlencoded.append('password', password);
    urlencoded.append('client_id', 'GrantValidatorClient');

    const response = await fetch(final, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlencoded,
    });
    const json = await response.json();
    return Promise.resolve(json.access_token);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
