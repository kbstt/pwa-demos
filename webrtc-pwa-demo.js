window.rtcConnectionInstance = new RTCPeerConnection();
window.rtcConnectionInstance.ontrack = e => video.srcObject = e.streams[0];

async function startStreaming() {
  let video = document.getElementById('rtc-demo-video');
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(t => window.rtcConnectionInstance.addTrack(t, stream));
  video.srcObject = stream;
}

async function createOffer() {
  let offer = await window.rtcConnectionInstance.createOffer();
  await window.rtcConnectionInstance.setLocalDescription(offer);
  document.getElementById('local').value = JSON.stringify(offer);
}

async function createAnswer() {
  let offer = JSON.parse(document.getElementById('remote').value);
  await window.rtcConnectionInstance.setRemoteDescription(offer);
  let answer = await window.rtcConnectionInstance.createAnswer();
  await window.rtcConnectionInstance.setLocalDescription(answer);
  document.getElementById('local').value = JSON.stringify(answer);
}

async function setRemote() {
  let answer = JSON.parse(document.getElementById('remote').value);
  await window.rtcConnectionInstance.setRemoteDescription(answer);
}
