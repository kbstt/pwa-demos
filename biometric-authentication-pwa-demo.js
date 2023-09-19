async function createPasskey(){
  if (!navigator.credentials || !navigator.credentials.create || !navigator.credentials.get){
    return alert("Your browser does not support the Web Authentication API");
  }
  
  let credentials = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([43, 55, 91, 123, 09, 181, 181, 78]),
        rp: { name: "Progressier", id: window.location.hostname },
        user: { id: new Uint8Array(16), name: "demo@progressier.com", displayName: "demo@progressier.com"},
        pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
        ],
      }
  });
  //in a real app, you'll store the credentials in your database against the user's profile
  window.currentPasskey = credentials;
  console.log(credentials);
  document.getElementById('authenticate-btn').innerHTML = "Authenticated";
  document.getElementById('authenticate-btn').classList.add('disabled'); 
  document.getElementById('verify-btn').classList.remove('disabled');
}

async function verifyPasskey(){
  

}
