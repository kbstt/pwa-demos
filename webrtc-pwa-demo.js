function initP2P(){
  window.p2pConnection = new RTCPeerConnection();
  window.rtcVideoElement = document.getElementById('rtc-demo-video');
  window.p2pConnection.ontrack = e => window.rtcVideoElement.srcObject = e.streams[0];
  window.iceCandidates = [];
  window.p2pConnection.onicecandidate = e => {
    if (e.candidate) {
      window.iceCandidates.push(e.candidate);
      console.log('ICE candidate:', e.candidate);
    }
  };
}

async function startStreaming() {
  initP2P();
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  window.rtcVideoElement.srcObject = stream;
  stream.getTracks().forEach(track => window.p2pConnection.addTrack(track, stream));
  let offer = await window.p2pConnection.createOffer();
  await window.p2pConnection.setLocalDescription(offer);
  let fullOffer = {
    sdp: window.p2pConnection.localDescription.sdp,
    type: window.p2pConnection.localDescription.type,
    candidates: window.iceCandidates
  };
  document.getElementById('webrtc-offer-answer').value = JSON.stringify(fullOffer);
}

async function answerAndConnect() {
  initP2P();
  let offer = JSON.parse(document.getElementById('webrtc-offer-answer').value);  
  window.p2pConnection.addTransceiver('video', { direction: 'recvonly' });
  window.p2pConnection.addTransceiver('audio', { direction: 'recvonly' });
  await window.p2pConnection.setRemoteDescription({ type: offer.type, sdp: offer.sdp });
  if (offer.candidates) {
    for (let c of offer.candidates) {
      await window.p2pConnection.addIceCandidate(c);
    }
  }
  let answer = await window.p2pConnection.createAnswer();
  await window.p2pConnection.setLocalDescription(answer);
}
