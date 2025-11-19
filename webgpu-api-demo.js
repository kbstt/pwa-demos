async function initWebGPU() {
    const canvas = document.getElementById('gpuCanvas');

    if (!navigator.gpu) {
        alert('WebGPU is not supported in this browser.');
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        alert('Failed to get WebGPU adapter.');
        return;
    }
    const device = await adapter.requestDevice();

    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
    });

    const shaderCode = `
                struct Uniforms {
                    mvpMatrix : mat4x4<f32>,
                };
                @group(0) @binding(0) var<uniform> uniforms : Uniforms;

                struct VertexOutput {
                    @builtin(position) Position : vec4<f32>,
                    @location(0) fragColor : vec4<f32>,
                };

                @vertex
                fn vs_main(
                    @location(0) position : vec4<f32>,
                    @location(1) color : vec4<f32>
                ) -> VertexOutput {
                    var output : VertexOutput;
                    output.Position = uniforms.mvpMatrix * position;
                    output.fragColor = color;
                    return output;
                }

                @fragment
                fn fs_main(@location(0) fragColor : vec4<f32>) -> @location(0) vec4<f32> {
                    return fragColor;
                }
            `;

    const shaderModule = device.createShaderModule({
        code: shaderCode
    });

    // Cube Geometry (36 vertices, Position + Color)
    const cubeData = new Float32Array([
        // Front (Red)
        -0.5, -0.5, 0.5, 1.0, 0.2, 0.2,
        0.5, -0.5, 0.5, 1.0, 0.2, 0.2,
        0.5, 0.5, 0.5, 1.0, 0.2, 0.2,
        -0.5, -0.5, 0.5, 1.0, 0.2, 0.2,
        0.5, 0.5, 0.5, 1.0, 0.2, 0.2,
        -0.5, 0.5, 0.5, 1.0, 0.2, 0.2,

        // Back (Orange)
        -0.5, -0.5, -0.5, 1.0, 0.5, 0.0,
        -0.5, 0.5, -0.5, 1.0, 0.5, 0.0,
        0.5, 0.5, -0.5, 1.0, 0.5, 0.0,
        -0.5, -0.5, -0.5, 1.0, 0.5, 0.0,
        0.5, 0.5, -0.5, 1.0, 0.5, 0.0,
        0.5, -0.5, -0.5, 1.0, 0.5, 0.0,

        // Top (Blue)
        -0.5, 0.5, -0.5, 0.2, 0.2, 1.0,
        -0.5, 0.5, 0.5, 0.2, 0.2, 1.0,
        0.5, 0.5, 0.5, 0.2, 0.2, 1.0,
        -0.5, 0.5, -0.5, 0.2, 0.2, 1.0,
        0.5, 0.5, 0.5, 0.2, 0.2, 1.0,
        0.5, 0.5, -0.5, 0.2, 0.2, 1.0,

        // Bottom (Yellow)
        -0.5, -0.5, -0.5, 1.0, 1.0, 0.2,
        0.5, -0.5, -0.5, 1.0, 1.0, 0.2,
        0.5, -0.5, 0.5, 1.0, 1.0, 0.2,
        -0.5, -0.5, -0.5, 1.0, 1.0, 0.2,
        0.5, -0.5, 0.5, 1.0, 1.0, 0.2,
        -0.5, -0.5, 0.5, 1.0, 1.0, 0.2,

        // Right (Magenta)
        0.5, -0.5, -0.5, 1.0, 0.2, 1.0,
        0.5, 0.5, -0.5, 1.0, 0.2, 1.0,
        0.5, 0.5, 0.5, 1.0, 0.2, 1.0,
        0.5, -0.5, -0.5, 1.0, 0.2, 1.0,
        0.5, 0.5, 0.5, 1.0, 0.2, 1.0,
        0.5, -0.5, 0.5, 1.0, 0.2, 1.0,

        // Left (Cyan)
        -0.5, -0.5, -0.5, 0.2, 1.0, 1.0,
        -0.5, -0.5, 0.5, 0.2, 1.0, 1.0,
        -0.5, 0.5, 0.5, 0.2, 1.0, 1.0,
        -0.5, -0.5, -0.5, 0.2, 1.0, 1.0,
        -0.5, 0.5, 0.5, 0.2, 1.0, 1.0,
        -0.5, 0.5, -0.5, 0.2, 1.0, 1.0,
    ]);

    const vertexBuffer = device.createBuffer({
        size: cubeData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(vertexBuffer, 0, cubeData);

    const uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
            buffers: [{
                arrayStride: 24,
                attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3'
                    }, // Position
                    {
                        shaderLocation: 1,
                        offset: 12,
                        format: 'float32x3'
                    } // Color
                ]
            }]
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [{
                format: presentationFormat
            }]
        },
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus',
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'back',
        }
    });

    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
            binding: 0,
            resource: {
                buffer: uniformBuffer
            }
        }]
    });

    let depthTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    // --- CORRECTED MATH FUNCTIONS (Column Major) ---

    function mat4Multiply(a, b) {
        let out = new Float32Array(16);
        // Perform proper Column-Major matrix multiplication
        for (let i = 0; i < 4; i++) { // Column of B
            for (let j = 0; j < 4; j++) { // Row of A
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    // a[col*4 + row] -> A(j, k) is a[k*4 + j]
                    // Wait, standard array layout:
                    // Col 0: 0,1,2,3
                    // Col 1: 4,5,6,7
                    // element at Row R, Col C is index C*4 + R

                    // We want C = A * B
                    // C(row, col) = Sum(A(row, k) * B(k, col))
                    // out[col*4 + row] = Sum(a[k*4 + row] * b[col*4 + k])
                    sum += a[k * 4 + j] * b[i * 4 + k];
                }
                out[i * 4 + j] = sum;
            }
        }
        return out;
    }

    function mat4Perspective(fov, aspect, near, far) {
        const f = 1.0 / Math.tan(fov / 2);
        // WebGPU Clip Space Z is [0, 1]
        // Standard WebGPU Perspective Matrix (Column Major)
        return new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, far / (near - far), -1,
            0, 0, (near * far) / (near - far), 0
        ]);
    }

    function mat4Translation(x, y, z) {
        // Column Major
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }

    function mat4RotationY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        // Rotate around Y axis
        // |  c  0  s  0 |
        // |  0  1  0  0 |
        // | -s  0  c  0 |
        // |  0  0  0  1 |
        return new Float32Array([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    function mat4RotationX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        // Rotate around X axis
        return new Float32Array([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }

    function frame() {
        const now = Date.now() / 1000;

        // 1. Projection
        const aspect = canvas.width / canvas.height;
        const projection = mat4Perspective(Math.PI / 4, aspect, 0.1, 100.0);

        // 2. View (Translate Camera back)
        const view = mat4Translation(0, 0, -4);

        // 3. Model (Rotate X and Y)
        const rotY = mat4RotationY(now);
        const rotX = mat4RotationX(now * 0.5);
        const model = mat4Multiply(rotY, rotX);

        // 4. MVP calculation
        // MVP = Projection * View * Model
        const viewProj = mat4Multiply(projection, view);
        const mvp = mat4Multiply(viewProj, model);

        device.queue.writeBuffer(uniformBuffer, 0, mvp);

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();

        const renderPassDescriptor = {
            colorAttachments: [{
                view: textureView,
                clearValue: {
                    r: 0.1,
                    g: 0.1,
                    b: 0.1,
                    a: 1.0
                },
                loadOp: 'clear',
                storeOp: 'store',
            }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            }
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.draw(36);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}
