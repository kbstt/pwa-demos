const randomUserId = function(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}();
  
const signupSampleCredentials = {
  publicKey: {
    rp: { name: "Progressier", id: window.location.hostname },
    user: { id: new Uint8Array(16), name: randomUserId, displayName: randomUserId},
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
  },
};

// sample arguments for login
const loginSampleCredentials = {
  publicKey: {
    timeout: 60000,
    challenge: new Uint8Array([
      // must be a cryptographically random number sent from a server
      0x79, 0x50, 0x68, 0x71, 0xda, 0xee, 0xee, 0xb9, 0x94, 0xc3, 0xc2, 0x15, 0x67,
      0x65, 0x26, 0x22, 0xe3, 0xf3, 0xab, 0x3b, 0x78, 0x2e, 0xd5, 0x6f, 0x81, 0x26,
      0xe2, 0xa6, 0x01, 0x7d, 0x74, 0x50,
    ]).buffer,
  },
};

async function createPasskey(){
  if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get){
    return alert("Your browser does not support the Web Authentication API");
  }
  
  let credentials = await navigator.credentials.create(signupSampleCredentials);
  let idList = [{
    id: credential.rawId,
    transports: ["usb", "nfc", "ble"],
    type: "public-key",
  }];
  
  loginSampleCredentials.publicKey.allowCredentials = idList;
  return navigator.credentials.get(loginSampleCredentials);
}

async function verifyPasskey(){
  

}
