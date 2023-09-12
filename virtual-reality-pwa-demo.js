let scriptsToAddToThePage = [
  "https://cdn.jsdelivr.net/npm/webxr-polyfill",
  "https://threejs.org/build/three.js",
  "https://cdn.rawgit.com/mrdoob/three.js/r128/examples/js/loaders/GLTFLoader.js"
  "https://cdn.rawgit.com/mrdoob/three.js/r128/examples/js/loaders/DRACOLoader.js",
  "https://cdn.rawgit.com/mrdoob/three.js/r128/examples/js/loaders/AnimationLoader.js",
  "https://cdn.rawgit.com/mrdoob/three.js/r128/examples/js/loaders/AnimationClipCreator.js",
  "https://immersive-web.github.io/webxr-samples/build/webxr.js"
];

scriptsToAddToThePage.forEach(function(url){
  let script = document.creatElement('script');
  script.setAttribute('src', url);
  document.querySelector('head').appendChild(script);
});

function getVideoElement(){
  return document.getElementById('vr-video');
}

async function startVR() {
    if (!navigator.xr) {
        return alert ('WebXR is not supported in this browser.');
    }

    try {
        window.vrSession = await navigator.xr.requestSession('immersive-vr');
        const xrReferenceSpace = await vrSession.requestReferenceSpace('local');
        const viewerReferenceSpace = await vrSession.requestReferenceSpace('viewer');
        vrSession.updateRenderState({ baseLayer: new XRWebGLLayer(vrSession, new THREE.WebGLRenderer()) });
        vrSession.requestAnimationFrame(onVRFrame);

        const vrVideoElement = getVideoElement();
        vrVideoElement.src = 'https://github.com/kbstt/pwa-demos/raw/main/demo-vr-video.mp4;
        vrVideoElement.play();

        await vrSession.requestReferenceSpace('local');
        vrSession.requestAnimationFrame(onVRFrame);
      
    } catch (error) {
        console.error('Error initializing XR:', error);
    }
}

function onVRFrame(time, frame) {
    const pose = frame.getViewerPose(viewerReferenceSpace);
    if (!pose) {return;}

    const vrVideoElement = getVideoElement();
  
    const glLayer = vrSession.renderState.baseLayer;
    const gl = glLayer.context;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    vrVideoElement.play();
    vrVideoElement.currentTime = time / 1000;
    vrVideoElement.updateTexture();
    vrVideoElement.needsUpdate = true;

    const videoTexture = new THREE.VideoTexture(vrVideoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    // Create a mesh and apply the video texture
    const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ map: videoTexture });
    const mesh = new THREE.Mesh(geometry, material);

    // Set the position of the video sphere
    const camera = frame.getViewerPose(viewerReferenceSpace).views[0].transform;
    const position = new THREE.Vector3();
    camera.position.add(position);

    // Render the video sphere
    const xrLayer = new XRWebGLLayer(vrSession, gl);
    vrSession.updateRenderState({ baseLayer: xrLayer });
    gl.bindFramebuffer(gl.FRAMEBUFFER, xrLayer.framebuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.render(mesh, camera);
    vrSession.requestAnimationFrame(onXRFrame);
}
