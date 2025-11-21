// Global variable to store the connection
window.p2pConnection = null;
window.rtcVideoElement = document.getElementById('rtc-demo-video');

function initP2P() {
  window.p2pConnection = new RTCPeerConnection();
  
  // Handle incoming video tracks
  window.p2pConnection.ontrack = e => {
    window.rtcVideoElement.srcObject = e.streams[0];
  };

  // Helper to detect when ICE gathering is complete
  window.p2pConnection.onicecandidate = e => {
    if (e.candidate === null) {
      // Gathering finished. The localDescription now contains all ICE candidates.
      console.log("ICE Gathering Complete");
      const jsonSDP = JSON.stringify(window.p2pConnection.localDescription);
      document.getElementById('webrtc-offer-answer').value = jsonSDP;
    }
  };
}

// --- STEP 1: SENDER SIDE ---
async function startStreaming() {
  initP2P();
  
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  window.rtcVideoElement.srcObject = stream;
  stream.getTracks().forEach(track => window.p2pConnection.addTrack(track, stream));

  const offer = await window.p2pConnection.createOffer();
  await window.p2pConnection.setLocalDescription(offer);
  
  console.log("Generating Offer... waiting for ICE candidates...");
  // The text box will automatically update when ICE gathering completes (see initP2P)
}

// --- STEP 2: RECEIVER SIDE ---
async function answerAndConnect() {
  initP2P();
  
  // 1. Get the Offer from the text box
  const offerData = JSON.parse(document.getElementById('webrtc-offer-answer').value);
  
  // 2. Setup transceivers to receive video/audio
  window.p2pConnection.addTransceiver('video', { direction: 'recvonly' });
  window.p2pConnection.addTransceiver('audio', { direction: 'recvonly' });

  // 3. Set the remote description (The Offer)
  await window.p2pConnection.setRemoteDescription(offerData);

  // 4. Create the Answer
  const answer = await window.p2pConnection.createAnswer();
  await window.p2pConnection.setLocalDescription(answer);
  
  console.log("Generating Answer... waiting for ICE candidates...");
  // The text box will update with the ANSWER when ICE gathering completes.
  // You must copy this NEW text back to the first tab!
}

// --- STEP 3: FINAL HANDSHAKE (Back on Sender Side) ---
async function finalizeConnection() {
  const answerData = JSON.parse(document.getElementById('webrtc-offer-answer').value);
  await window.p2pConnection.setRemoteDescription(answerData);
  console.log("Connection established!");
}
