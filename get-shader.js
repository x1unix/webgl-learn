function Shader(glContext, type) {
  this.context = glContext;
  this.type = type;
  this.source = '';
  this.shader = null;
  this.name = '';

  this.from = (url) => new Promise((resolve, reject) => {
    this.name = ((i) => i.length > 0 ? i[i.length - 1] : i[0])(url.split('/'));
    fetch(url)
        .then(response => response.text())
        .then((hlsl) => {
            this.source = hlsl;
            return this.build(hlsl);
        })
        .then((shader) => resolve(shader))
        .catch(err => reject(err));
  });

  this.build = (hlsl) => {
    return new Promise((resolve, reject) => {
      this.shader = this.context.createShader(this.type);
      this.context.shaderSource(this.shader, hlsl);
      this.context.compileShader(this.shader);
      if (!this.context.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
          const err = this.context.getShaderInfoLog(this.shader);
          reject(new Shader.ShaderBuildError(this, err));
          return;
      }

      resolve(this.shader);
    });
  };

  this.getContent = () => this.shader;
};

Shader.VERTEX = 35633;
Shader.FRAGMENT = 35632;

Shader.Vertex = (glContext) => new Shader(glContext, Shader.VERTEX);
Shader.Fragment = (glContext) => new Shader(glContext, Shader.FRAGMENT);

Shader.ShaderBuildError = function(shaderContainer, error) {
  Error.call(this, error);
  const errorRegex = /ERROR: ([0-9]):([0-9])/g;

  this.name = 'ShaderBuildError';
  this.message = `Failed to build shader '${shaderContainer.name}': ${error}`;

  this.toString = function() {
    const sources = shaderContainer.source.split('\n');
    const parsedError = errorRegex.exec(error);
    let output = ''+this.message;

    if (error === null) {
      return this.message;
    }

    const errorNum = +parsedError[1];
    let errorLine = +parsedError[2];
    if (!isNaN(errorLine) && (errorLine > 0)) {
        errorLine--;
    }

    output += `\nError in '${shaderContainer.name}':\n\n`;

    output += sources.map((strLine, index) =>
      (index === errorLine) ? `--> ${strLine}` : `    ${strLine}`
    ).join('\n');

    return output;
  };
}
