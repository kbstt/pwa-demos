async function startListeningToSMS() {
  if (!window.OTPCredential){
    alert("Your current device does not support window.OTPCredential");  
    return;
  }

  let btn = document.getElementById("listening-button");
  
  try {
    btn.classList.add("listening");
    let ac = new AbortController();
    let content = await navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal: ac.signal
    });

    if (content && content.code) {
      alert("Code detected from your SMS: "+content.code);
    }
    else {
      alert("No code detected in your SMS");
    }
   } 
  catch (err) {
      btn.classList.remove("listening");
      console.error(err);
      if (err.name === 'AbortError') {
          alert("Listening stopped (Aborted).");
      } 
      else {
          alert(`Error: ${err.message}`);
      }
  }
}

function generateRandomCode(){
  window.randomCode = Math.floor(100000 + Math.random() * 900000);
}

function getSmsBody(){
  //The browser's background process scans incoming SMS messages specifically looking for the last line to match this exact pattern:
  //@ followed by your website's hostname (e.g., @my-app.com) # followed by the code (e.g., #123456)
  let currentDomain = window.location.hostname;
  let code = window.randomCode || generateRandomCode();
  let smsBody = 'Your verification code is ' + randomCode + '.\n\n@' + currentDomain + ' #' + randomCode;
  return smsBody;
}

function draftSms(){
  let body = getSmsBody();
  let link = "sms:?body=" + encodeURIComponent(body);
  window.open(link, "_blank");
}

async function copySmsBodyToClipboard(){
   await navigator.clipboard.writeText(getSmsBody());
   alert("SMS text copied. Now send it yourself");
}

function generateSmsTxt(){
  document.getElementById("plain-txt-sms").innerText = getSmsBody();
}

window.addEventListener("load", generateSmsTxt);
