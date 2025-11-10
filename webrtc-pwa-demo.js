let pc = new RTCPeerConnection();
let video = document.getElementById('rtc-demo-video');

pc.ontrack = e => video.srcObject = e.streams[0];

async function start() {
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  stream.getTracks().forEach(t => pc.addTrack(t, stream));
  video.srcObject = stream;
}

async function createOffer() {
  let offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  document.getElementById('local').value = JSON.stringify(offer);
}

async function createAnswer() {
  let offer = JSON.parse(document.getElementById('remote').value);
  await pc.setRemoteDescription(offer);
  let answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  document.getElementById('local').value = JSON.stringify(answer);
}

async function setRemote() {
  let answer = JSON.parse(document.getElementById('remote').value);
  await pc.setRemoteDescription(answer);
}
