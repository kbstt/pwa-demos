function sendCode(){ 
  let otp = await navigator.credentials.get({otp: {transport: ["sms"]});
  document.getElementById('#code-field').value = otp.code;
}
