function updateViewportMetaTag(newResizing){
  let meta = document.querySelector('meta[name="viewport"]');
  let content = meta.getAttribute('content') || "";
  let parts = content.split(',').map(p => p.trim()).filter(Boolean);
  let filtered = parts.filter(p => !p.startsWith('interactive-widget'));
  filtered.push("interactive-widget="+newResizing);
  let newContent = filtered.join(",");
  meta.setAttribute('content', newContent);
}

function setResizesVisual(){
   updateViewportMetaTag("resizes-visual");
}

function setResizeContent(){
   updateViewportMetaTag("resizes-content");
}

function setOverlaysContent(){
  updateViewportMetaTag("overlays-content");
}
