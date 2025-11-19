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
  if (!navigator.gpu) {
    alert("WebGPU is not supported in this browser.");
    return;
  }

  const canvas = document.getElementById('gpuCanvas');
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const context = canvas.getContext('webgpu');
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format });

  // Cube vertex positions
  const vertices = new Float32Array([
    -1,-1,-1,  1,-1,-1,  1,1,-1,  -1,1,-1,
    -1,-1, 1,  1,-1, 1,  1,1, 1,  -1,1, 1,
  ]);

  // Cube indices
  const indices = new Uint16Array([
    0,1,2,  2,3,0,
    4,5,6,  6,7,4,
    0,1,5,  5,4,0,
    2,3,7,  7,6,2,
    0,3,7,  7,4,0,
    1,2,6,  6,5,1
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

  // Uniform buffer for transformation matrix
  const uniformBuffer = device.createBuffer({
    size: 16 * 4, // 4x4 matrix
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [{ binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }],
  });

  const pipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  const shaderModule = device.createShaderModule({
    code: `
      struct Uniforms { modelViewProjectionMatrix : mat4x4<f32>; };
      @binding(0) @group(0) var<uniform> uniforms : Uniforms;

      @vertex
      fn vs_main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
        return uniforms.modelViewProjectionMatrix * vec4<f32>(position, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4<f32> {
        return vec4<f32>(0.0, 0.7, 1.0, 1.0);
      }
    `,
  });

  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: 'vs_main',
      buffers: [{ arrayStride: 3 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }] }],
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fs_main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list', cullMode: 'back' },
    depthStencil: { format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less' },
  });

  // Depth buffer
  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  function render(time) {
    const aspect = canvas.width / canvas.height;
    const projection = mat4.create();
    mat4.perspective(projection, Math.PI/4, aspect, 0.1, 100.0);

    const modelView = mat4.create();
    mat4.translate(modelView, modelView, [0,0,-6]);
    mat4.rotateY(modelView, modelView, time * 0.001);
    mat4.rotateX(modelView, modelView, time * 0.0007);

    const mvp = mat4.create();
    mat4.multiply(mvp, projection, modelView);

    device.queue.writeBuffer(uniformBuffer, 0, mvp);

    const commandEncoder = device.createCommandEncoder();
    const pass = commandEncoder.beginRenderPass({
      colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r:0.2,g:0.2,b:0.3,a:1 }, loadOp:'clear', storeOp:'store' }],
      depthStencilAttachment: { view: depthTexture.createView(), depthLoadOp:'clear', depthClearValue:1.0, depthStoreOp:'store' }
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
