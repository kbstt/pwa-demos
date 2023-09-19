const randomUserId = function(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}();

async function createPasskey(){
  if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get){
    return alert("Your browser does not support the Web Authentication API");
  }
  
  let credentials = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([43, 55, 91, 123, 09, 181, 181, 78]),
        rp: { name: "Progressier", id: window.location.hostname },
        user: { id: new Uint8Array(16), name: randomUserId, displayName: randomUserId},
        pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
        ],
      }
  });
  console.log(credentials);
}

async function verifyPasskey(){
  

}
