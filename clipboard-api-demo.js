async function copyToClipboard() {
  let text = "Hello from Clipboard API!"
  await navigator.clipboard.writeText();
  alert("Copied text: "+text);
}

async function pasteFromClipboard() {
  let text = await navigator.clipboard.readText();
  alert("Pasted text: " + text);
}
