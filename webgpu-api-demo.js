async function initWebGPU2() {
  if (!navigator.gpu) {
    alert("WebGPU is not supported in this browser.");
    return;
  }

  const canvas = document.getElementById("gpuCanvas");
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: format,
  });

  // Vertex data for a single triangle
  const vertexData = new Float32Array([
    0.0,  0.5,  // top vertex
   -0.5, -0.5,  // bottom left
    0.5, -0.5,  // bottom right
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertexData.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertexData);

  // Shaders
  const shaderModule = device.createShaderModule({
    code: `
      @vertex
      fn vs_main(@location(0) position: vec2<f32>) -> @builtin(position) vec4<f32> {
        return vec4<f32>(position, 0.0, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4<f32> {
        return vec4<f32>(1.0, 0.0, 0.0, 1.0); // red color
      }
    `,
  });

  // Pipeline
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [{
        arrayStride: 2 * 4, // 2 floats per vertex
        attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }],
      }],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }],
    },
    primitive: {
      topology: 'triangle-list',
    },
  });

  // Encode commands
  const commandEncoder = device.createCommandEncoder();
  const renderPassDescriptor = {
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(3, 1, 0, 0); // 3 vertices, 1 instance
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}

async function initWebGPU() {
  if (!navigator.gpu) return alert("WebGPU not supported.");

  const canvas = document.getElementById("gpuCanvas");
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format });

  // Cube vertex positions
  const vertices = new Float32Array([
    -1,-1,-1,  1,-1,-1,  1,1,-1,  -1,1,-1,
    -1,-1, 1,  1,-1, 1,  1,1, 1,  -1,1, 1
  ]);

  // Cube indices
  const indices = new Uint16Array([
    0,1,2, 2,3,0,
    4,5,6, 6,7,4,
    0,1,5, 5,4,0,
    2,3,7, 7,6,2,
    0,3,7, 7,4,0,
    1,2,6, 6,5,1
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const indexBuffer = device.createBuffer({
    size: indices.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(indexBuffer, 0, indices);

  // Uniform buffer for MVP matrix
  const uniformBuffer = device.createBuffer({
    size: 16*4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [{ binding:0, visibility: GPUShaderStage.VERTEX, buffer:{ type:'uniform' } }]
  });

  const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [{ binding:0, resource:{ buffer: uniformBuffer } }]
  });

  // Shader
  const shaderModule = device.createShaderModule({
    code: `
      struct Uniforms { mvp : mat4x4<f32>; };
      @binding(0) @group(0) var<uniform> uniforms : Uniforms;

      @vertex
      fn vs_main(@location(0) pos : vec3<f32>) -> @builtin(position) vec4<f32> {
        return uniforms.mvp * vec4<f32>(pos, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4<f32> {
        return vec4<f32>(0.0, 0.7, 1.0, 1.0);
      }
    `
  });

  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [{ arrayStride: 3*4, attributes:[{ shaderLocation:0, offset:0, format:'float32x3' }] }]
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }]
    },
    primitive: { topology:'triangle-list', cullMode:'back' },
    depthStencil: { format:'depth24plus', depthWriteEnabled:true, depthCompare:'less' }
  });

  // Depth texture
  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  });

  // Simple matrix helpers
  function identity() { return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; }
  function multiply(a,b) {
    const out = new Array(16).fill(0);
    for(let i=0;i<4;i++)
      for(let j=0;j<4;j++)
        for(let k=0;k<4;k++)
          out[i*4+j] += a[i*4+k]*b[k*4+j];
    return out;
  }
  function perspective(fovy, aspect, near, far) {
    const f = 1/Math.tan(fovy/2), nf = 1/(near-far);
    return [
      f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0
    ];
  }
  function translate(m, v) {
    const out = m.slice();
    out[12] = m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12];
    out[13] = m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13];
    out[14] = m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14];
    out[15] = m[3]*v[0]+m[7]*v[1]+m[11]*v[2]+m[15];
    return out;
  }
  function rotateX(m, rad) {
    const c=Math.cos(rad), s=Math.sin(rad);
    const r=[1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1];
    return multiply(m,r);
  }
  function rotateY(m, rad) {
    const c=Math.cos(rad), s=Math.sin(rad);
    const r=[c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1];
    return multiply(m,r);
  }

  function render(time) {
    const aspect = canvas.width/canvas.height;
    let proj = perspective(Math.PI/4, aspect, 0.1, 100);
    let mv = identity();
    mv = translate(mv, [0,0,-6]);
    mv = rotateY(mv, time*0.001);
    mv = rotateX(mv, time*0.0007);
    const mvp = multiply(proj, mv);
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array(mvp));

    const commandEncoder = device.createCommandEncoder();
    const pass = commandEncoder.beginRenderPass({
      colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue:{r:0.2,g:0.2,b:0.3,a:1}, loadOp:'clear', storeOp:'store' }],
      depthStencilAttachment: { view: depthTexture.createView(), depthLoadOp:'clear', depthClearValue:1, depthStoreOp:'store' }
    });
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setIndexBuffer(indexBuffer, 'uint16');
    pass.setBindGroup(0, bindGroup);
    pass.drawIndexed(indices.length);
    pass.end();
    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
