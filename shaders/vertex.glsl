attribute vec2 vertexPosition;

varying vec4 v_color;

void main() {
  int x = 0;
  int w = 1;
  gl_Position = vec4(vertexPosition, x, w);

  // Convert from clipspace to colorspace.
  // Clipspace goes -1.0 to +1.0
  // Colorspace goes from 0.0 to 1.0
  v_color = gl_Position * 0.5 + 0.5;
}
