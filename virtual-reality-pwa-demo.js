let script = document.createElement('script');
script.setAttribute('src', 'https://aframe.io/releases/1.2.0/aframe.min.js');
script.onload = function(){
  AFRAME.registerComponent('play-video-once', {
    init: function () {
      this.el.addEventListener('loadeddata', () => {
        this.el.components.material.material.map = this.el.components.material.videoTexture;
        this.el.components.material.material.map.needsUpdate = true;
        this.el.components.material.material.needsUpdate = true;
      });
    }
  });
};

async function startVR() {
    if (!navigator.xr) {
        return alert ('WebXR is not supported in this browser.');
    }

    const videoElement = document.getElementById('vr-video');
    videoElement.src = 'https://github.com/kbstt/pwa-demos/raw/main/demo-vr-video.mp4';
    videoElement.play();

    // Enter WebXR when the button is clicked
    const session = await navigator.xr.requestSession('immersive-vr');
    const scene = document.querySelector('a-scene');
    session.updateRenderState({ baseLayer: new XRWebGLLayer(session, scene.renderer) });
    const referenceSpace = await session.requestReferenceSpace('local');
    const xrElement = scene.querySelector('[xr-webgl]');
    xrElement.setAttribute('xr-webgl', { session: session, space: referenceSpace });
}

