function installApp(){
  if (!navigator.install) {return; } // API not supported
  try {
    //You can install your current domain or any other PWA with a manifest
    const installUrl = "https://progressier.com/login";
    await navigator.install(installUrl);
  } 
  catch (err) {
    if (err.name === "AbortError"){
      // The user dismissed the prompt
    }
    else if (err.name === "DataError"){
      // There was an issue with the manifest or the installation domain
    }
    else{
      //Other type of error
    }
  }
};
