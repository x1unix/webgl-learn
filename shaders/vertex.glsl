attribute vec2 vertexPosition;

void main() {
  int x = 0;
  int w = 1;
  gl_Position = vec4(vertexPosition, x, w);
}
