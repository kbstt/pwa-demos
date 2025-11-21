window.p2pConnection = null;

function initP2P() {
  window.rtcVideoElement = document.getElementById('rtc-demo-video');
  window.p2pConnection = new RTCPeerConnection();
  window.p2pConnection.ontrack = e => window.rtcVideoElement.srcObject = e.streams[0];
}

// --- SENDER FUNCTION ---
async function startStreaming() {
  initP2P();
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  window.rtcVideoElement.srcObject = stream;
  stream.getTracks().forEach(track => window.p2pConnection.addTrack(track, stream));

  // Wait for ICE gathering to complete before showing the code
  window.p2pConnection.onicecandidate = e => {
    if (e.candidate === null) {
      document.getElementById('offer-box').value = JSON.stringify(window.p2pConnection.localDescription);
    }
  };

  const offer = await window.p2pConnection.createOffer();
  await window.p2pConnection.setLocalDescription(offer);
}

// --- RECEIVER FUNCTION ---
async function answerAndConnect() {
  initP2P();
  const offerData = JSON.parse(document.getElementById('offer-box').value);
  
  window.p2pConnection.addTransceiver('video', { direction: 'recvonly' });
  window.p2pConnection.addTransceiver('audio', { direction: 'recvonly' });
  await window.p2pConnection.setRemoteDescription(offerData);

  // Wait for ICE gathering to complete before showing the code
  window.p2pConnection.onicecandidate = e => {
    if (e.candidate === null) {
      document.getElementById('answer-box').value = JSON.stringify(window.p2pConnection.localDescription);
    }
  };

  const answer = await window.p2pConnection.createAnswer();
  await window.p2pConnection.setLocalDescription(answer);
}

// --- SENDER FINAL STEP ---
async function finalizeConnection() {
  const answerData = JSON.parse(document.getElementById('answer-box').value);
  await window.p2pConnection.setRemoteDescription(answerData);
  alert("Connection Established!");
}

function copyFromTextarea(event){
  let element = event.currentTarget;
  let content = element.value;
  if (!content){return;}
  element.select();
  navigator.clipboard.writeText(content);
}
