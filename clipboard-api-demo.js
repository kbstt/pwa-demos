async function copyToClipboard() {
  let text = "Hello from Clipboard API!"
  await navigator.clipboard.writeText(text);
  alert("Copied text: "+text);
}

async function pasteFromClipboard() {
  try {
    let text = await navigator.clipboard.readText();
    alert("Pasted text: " + text);
  }
  catch(err){
    alert(err);
  }
}
