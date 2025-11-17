function updateViewportMetaTag(newResizing){
  let meta = document.querySelector('meta[name="viewport"]');
  let content = meta.getAttribute('content') || "";
  let parts = content.split(',').map(p => p.trim()).filter(Boolean);
  let filtered = parts.filter(p => !p.startsWith('interactive-widget'));
  filtered.push("interactive-widget="+newResizing);
  let newContent = filtered.join(",");
  meta.setAttribute('content', newContent);
}

function setResizesVisual(e){
   updateBtn(e);
   updateViewportMetaTag("resizes-visual");
}

function setResizeContent(e){
   updateBtn(e);
   updateViewportMetaTag("resizes-content");
}

function setOverlaysContent(e){
  updateBtn(e);
  updateViewportMetaTag("overlays-content");
}

function updateBtn(e){
  let element = e.currentTarget;
  document.querySelectorAll(".resizing-btn").forEach(function(btn){
    if (btn === element){
      btn.classList.remove("btn2");
      btn.classList.add("btn1");
    }
    else {
      btn.classList.remove("btn2");
      btn.classList.add("btn2");
    }
  });
}
