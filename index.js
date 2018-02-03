let canvas;
let gl;

function main() {
  canvas = document.getElementById('canvas');
  gl = canvas.getContext('experimental-webgl');
  syncCanvasSize();
  window.addEventListener('resize', onResize);

  if (!gl) {
      alert('WebGL unsupported');
      return;
  }

  Promise.all([
    Shader.Fragment(gl).from('shaders/fragment.glsl'),
    Shader.Vertex(gl).from('shaders/vertex.glsl')
  ]).then(shaders => initProgram(shaders)
).then((program) => {
  createTriangle(gl, program);
}).catch((err) => {
    console.error(err.toString());
  })
}

function createSquare(gl, program) {
  const buffVertex = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER);
}

function createTriangle(gl, program) {
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Triangle points (X: Y)
  const vertexArray = [
     0.0,  0.5,
     0.5, -0.5,
    -0.5, -0.5
  ];

  // Put points to buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

  // Get 'vertexPosition' attribute location
  const attrLoc_VertexPosition = gl.getAttribLocation(program, 'vertexPosition');

  gl.vertexAttribPointer(
    attrLoc_VertexPosition,  // Attribute link
    2,        // Array items count for iteration (2 from vertex array for X, Y)
    gl.FLOAT, // Data type
    gl.FALSE, // Normalize ?
    2 * Float32Array.BYTES_PER_ELEMENT, // Count of elements for 1 vertex
    0 * Float32Array.BYTES_PER_ELEMENT // Count of items to skip in each row
  );

  // Enable Attribute
  gl.enableVertexAttribArray(attrLoc_VertexPosition);

  // Clear (RGBA)
  gl.clearColor(0.75, 0.9, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Enable program
  gl.useProgram(program);


  
  // create background color vector
  const vec3_backgroundColor = Color.fromHex('#3232ff').toVector();

  // Get uniform variable location.
  // We have to use uniform variables, because fragment shader
  // didn't support arrtibutes
  const loc_bgColor = gl.getUniformLocation(program, 'bgColor');
  
  // Put uniform variable
  gl.uniform4fv(loc_bgColor, vec3_backgroundColor);

  // Draw:
  // 1. Shapes to use to draw
  // 2. Start vertex index
  // 3. Count of vertexes to draw
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function initProgram(shaders) {
  return new Promise((i, o) => {
    const program = gl.createProgram();
    shaders.forEach(shader =>
      gl.attachShader(program, shader)
    );

    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    {
      const err = gl.getProgramInfoLog(program);
      o(`Error validating program: ${err}`);
      return;
    }

    i(program);
  })
}

function onResize() {
  syncCanvasSize();
}

function syncCanvasSize() {
  canvas.height = canvas.clientHeight;
  canvas.width = canvas.clientWidth;
  gl.viewport(0, 0, canvas.width, canvas.height)
}
