/**
 * Color constructor
 * @param {number} red 
 * @param {number} green 
 * @param {number} blue 
 * @param {number} alpha 
 */
function Color(red = 0, green = 0, blue = 0, alpha = 255) {
  [].forEach.call(arguments, (arg, idx) => {
    if (arg > Color.RGB_MAX || arg < Color.RGB_MIN) {
      throw new ReferenceError(`Invalid value for color ${idx}, expected value in range (${Color.RGB_MAX}<=>${Color.RGB_MIN}) but got '${arg}'`);
    }
  });
  
  this.red = red;
  this.green = green;
  this.blue = blue;
  this.alpha = alpha;
}

Color.RGB_MAX = 255;
Color.RGB_MIN = 0;
Color.VEC_MAX = 1.0;
Color.VEC_MIN = 0.0;

/**
 * Create new color instance from hex color string
 * @param {string} strHex Hex RGB(A) string (ex: #fff or #ff00aa) 
 */
Color.fromHex = function (strHex) {
  const hex = Array.from(strHex[0] === '#' ? strHex.substring(1, strHex.length) : strHex);
  const len = hex.length;
    
  let prevIdx = 0;
  let rgba;

  if ((len > 4) && ((len % 2) === 0)) {
    rgba = hex.reduce((prev, current, idx, arr) => {
      if (idx === 1) {
        prev = [parseInt(prev + arr[idx], 16)];
        prevIdx = idx;
        return prev;
      }
      
      if (idx > prevIdx) {
        prevIdx = idx + 1;
        prev.push(parseInt(current + arr[prevIdx], 16));
      }
      
      return prev;
    });
  } else {
      rgba = hex.map((i) => parseInt(i+i, 16));
  }
  
  const newColor = Object.create(Color.prototype);
  Color.apply(newColor, rgba);
  return newColor;
}

/**
 * Converts the color to RGBA hex string
 * 
 * @returns string
 */
Color.prototype.toHex = function() {
  return '#' + this.toArray().map((color) => color.toString(16)).join('');
};

/**
 * Converts the color to RGBA array
 */
Color.prototype.toArray = function() {
  return [this.red, this.green, this.blue, this.alpha];
}

/**
 * Converts the color to vector
 * 
 * @returns Float32Array
 */
Color.prototype.toVector = function() {
  return new Float32Array(this.toArray().map((color) => +((((color / Color.RGB_MAX) * 100) * 0.01).toFixed(2))));
}