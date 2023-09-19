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
        rp: { name: "Progressier", id: window.location.hostname },
        user: { id: new Uint8Array(16), name: randomUserId, displayName: randomUserId},
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      }
  });
  console.log(credentials);
}

async function verifyPasskey(){
  

}
