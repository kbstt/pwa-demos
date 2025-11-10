window.p2pConnection = new RTCPeerConnection();
window.rtcVideoElement = document.getElementById('rtc-demo-video');
window.p2pConnection.ontrack = e => window.rtcVideoElement.srcObject = e.streams[0];
window.p2pConnection.onicecandidate = e => {
  if (e.candidate) {console.log('ICE candidate:', e.candidate);}
};

async function startStreaming() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  window.rtcVideoElement.srcObject = stream;
  stream.getTracks().forEach(track => window.p2pConnection.addTrack(track, stream));
  let offer = await window.p2pConnection.createOffer();
  await window.p2pConnection.setLocalDescription(offer);
  document.getElementById('local').value = JSON.stringify(window.p2pConnection.localDescription);
}

async function answerAndConnect() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  window.rtcVideoElement.srcObject = stream;
  stream.getTracks().forEach(track => window.p2pConnection.addTrack(track, stream));
  let offer = JSON.parse(document.getElementById('remote').value);
  await window.p2pConnection.setRemoteDescription(offer);
  let answer = await window.p2pConnection.createAnswer();
  await window.p2pConnection.setLocalDescription(answer);
  document.getElementById('local').value = JSON.stringify(window.p2pConnection.localDescription);
}
