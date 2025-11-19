async function initWebGPU() {
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
