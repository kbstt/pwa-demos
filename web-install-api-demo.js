async function installApp(){
  let el = document.getElementById("installResult");
  try {
    if ("install" in navigator){
      await navigator.install();
		  el.innerHTML = "Success: Install completed";
    }
    else {
      el.innerHTML = "Incompatible: navigator.install() is not supported in your current browser";
    }
  } 
  catch (err) {
    switch (err.name) {
		case "AbortError":
        	el.innerHTML = "AbortError: install was cancelled or could not be completed.";
        	break;
		case "DataError":
        	el.innerHTML = "DataError: manifest or manifest ID is invalid.";
        	break;
		case "InvalidStateError":
        	el.innerHTML = "InvalidStateError: install attempt made from sandboxed frame or cross-origin subframe";
        	break;
		case "NotAllowedError":
        	el.innerHTML = "NotAllowedError: install attempt lacking transient user activation or disallowed by browser policy.";
        	break;
		case "NotFoundError":
        	el.innerHTML = "NotFoundError: navigator no longer attached to a document";
        	break;
		case "TypeError":
        	el.innerHTML = "TypeError: argument with invalid type or URL.";
        	break;
		default:
        	el.innerHTML = "UnknownError: The install could not be completed for an unknown reason";
      }
  }
}
