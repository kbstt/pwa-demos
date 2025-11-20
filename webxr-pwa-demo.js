let xrSession = null;
let xrRefSpace = null;
let gl = null;
let shaderProgram = null;
let programInfo = null;
let buffers = null;

async function startVRDemo() {
  if (!navigator.xr) { alert("Your browser does not support the WebXR API"); return; }
  let arSupported = await navigator.xr.isSessionSupported('immersive-ar');
  if (!arSupported) { alert("Your browser does not support AR"); return; }
  startSession('immersive-vr');
}

function startARDemo() {
  if (!navigator.xr) { alert("Your browser does not support the WebXR API"); return; }
  let vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
  if (!vrSupported) { alert("Your browser does not support VR"); return; }
  startSession('immersive-ar');
}

async function startSession(mode) {
  const sessionOptions = {
    optionalFeatures: ['local-floor', 'bounded-floor']
  };

  // If AR, ask for DOM Overlay
  if (mode === 'immersive-ar') {
     sessionOptions.optionalFeatures.push('dom-overlay');
     sessionOptions.domOverlay = {
        root: document.body
     };
  }
  
  try {
    xrSession = await navigator.xr.requestSession(mode, sessionOptions);
    xrSession.addEventListener('end', onSessionEnd);

    // Initialize WebGL context compatible with XR
    const canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl', { xrCompatible: true });

    // Set up the XRGL binding
    const layer = new XRWebGLLayer(xrSession, gl);
    xrSession.updateRenderState({ baseLayer: layer });

    // Get a reference space (local is usually good for simple demos)
    // 'local' means 0,0,0 is where the session started (head level usually)
    xrRefSpace = await xrSession.requestReferenceSpace('local');

    // Init Shaders & Buffers (One time setup)
    if (!shaderProgram) { initGLResources();}

     // Start the loop  
    xrSession.requestAnimationFrame(onXRFrame);

  } catch (e) {
      alert("Failed to start session: " + e.message);
  }
}

function onSessionEnd() {
  xrSession = null;
  gl = null;
}

function onXRFrame(t, frame) {
  const session = frame.session;
  session.requestAnimationFrame(onXRFrame);

  const pose = frame.getViewerPose(xrRefSpace);

  if (pose) {
    const glLayer = session.renderState.baseLayer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glLayer.framebuffer);

    // Clear Screen
    // For AR, we must clear alpha to 0 to see the camera.
    // For VR, we can clear to a color (sky color).
    if (session.mode === 'immersive-ar') {
      gl.clearColor(0, 0, 0, 0); // Transparent for camera
    } 
    else {
      gl.clearColor(0.1, 0.1, 0.2, 1.0); // Dark Blue Sky for VR
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Render each eye (view)
    for (const view of pose.views) {
      const viewport = glLayer.getViewport(view);
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

      // Draw the scene
      drawScene(view.projectionMatrix, view.transform.inverse.matrix);
    }
  }
}

function drawScene(projectionMatrix, viewMatrix) {
    gl.useProgram(shaderProgram);

    // Create a Model Matrix (Identity - cube stays at 0,0,0)
    // For a panorama effect in VR, we draw a giant cube around the user.
    // For AR, we draw a small cube in front of the user.
    const modelMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -2, 1, // Translate Z -2 (2 meters in front)
    ]);

    // Pass Uniforms
    gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniforms.viewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(programInfo.uniforms.modelMatrix, false, modelMatrix);

    // Bind Attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribs.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribs.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(programInfo.attribs.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribs.vertexColor);

    // Draw
    gl.enable(gl.DEPTH_TEST);
    gl.drawArrays(gl.TRIANGLES, 0, 36); // 36 vertices for a cube
}


function initGLResources() {
    // Vertex Shader: Standard Matrix transform
    const vsSource = `
                attribute vec4 aVertexPosition;
                attribute vec4 aVertexColor;
                uniform mat4 uModelMatrix;
                uniform mat4 uViewMatrix;
                uniform mat4 uProjectionMatrix;
                varying lowp vec4 vColor;
                void main(void) {
                    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aVertexPosition;
                    vColor = aVertexColor;
                }
            `;

    // Fragment Shader: Just display the color
    const fsSource = `
                varying lowp vec4 vColor;
                void main(void) {
                    gl_FragColor = vColor;
                }
            `;

    shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    programInfo = {
        attribs: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniforms: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            viewMatrix: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
        },
    };

    // Create a Cube (Simple Geometry)
    // Positions
    const positions = [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];

    // Indices logic expanded to raw triangles for simplicity
    // This is verbose, but dependency-free. 
    // We map the 4 points of a face to 2 triangles.
    const cubeVertices = [];
    const cubeColors = [];
    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front: White
        [1.0, 0.0, 0.0, 1.0], // Back: Red
        [0.0, 1.0, 0.0, 1.0], // Top: Green
        [0.0, 0.0, 1.0, 1.0], // Bottom: Blue
        [1.0, 1.0, 0.0, 1.0], // Right: Yellow
        [1.0, 0.0, 1.0, 1.0], // Left: Purple
    ];

    for (let i = 0; i < 6; i++) { // 6 faces
        // Triangle 1
        const idx = i * 12;
        cubeVertices.push(positions[idx], positions[idx + 1], positions[idx + 2]);
        cubeVertices.push(positions[idx + 3], positions[idx + 4], positions[idx + 5]);
        cubeVertices.push(positions[idx + 6], positions[idx + 7], positions[idx + 8]);
        // Triangle 2
        cubeVertices.push(positions[idx], positions[idx + 1], positions[idx + 2]);
        cubeVertices.push(positions[idx + 6], positions[idx + 7], positions[idx + 8]);
        cubeVertices.push(positions[idx + 9], positions[idx + 10], positions[idx + 11]);

        // Push colors for all 6 vertices of this face
        for (let j = 0; j < 6; j++) {
            cubeColors.push(...faceColors[i]);
        }
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);

    buffers = {
        position: positionBuffer,
        color: colorBuffer
    };
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

