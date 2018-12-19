/* Assignment 10: Shader Art 
 * Author: Zoe Kniskern 
 *
 * Put your documentation here. You probably won't need to modify this
 * file as it is setup for the u_time and u_resolution uniforms already.
 */

const canvas = document.getElementById("shaderCanvas");

// For most of this class, we have been using the 2D context from canvas like so: 
//const ctx = mainCanvas.getContext('2d', {alpha: false});

// Now, we will request to get the WebGL 3d rendering context 
// We will be using WebGL1 since WebGL2 is not as widely supported at this time
const gl = shaderCanvas.getContext('webgl', {alpha: false});

let w = window.innerWidth;
let h = window.innerHeight;

/* UTILITY CODE */

/* use to update global w and h and reset canvas width/height */ 
function updateCanvasSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
}
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize); 

/* MAIN DRAWING CODE */

// Let's store our WebGL information in a global object
// we'll populate values during setupProgram()
let programInfo;

// Utility function to compiler GLSL shader code into WebGLShader object
// 
// Using code from https://developer.mozilla.org/en-US/docs/Web/API/WebGLShader
function createShader (gl, sourceCode, type) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  let shader = gl.createShader( type );  // create the JS WebGLShader object
  gl.shaderSource( shader, sourceCode ); // set the shader source code
  gl.compileShader( shader );            // compile

  if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    var info = gl.getShaderInfoLog( shader );
    throw 'Could not compile WebGL program. \n\n' + info;
  }
  return shader;
}

// Create our WebGLProgram. Made up of a vertex and fragment shader. 
// uses code from https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
function setupProgram() {

    let program = gl.createProgram();

    // grab our vertexShader and fragment shader code from HTML DOM
    let vertexShaderCode = document.querySelector("#vertexShaderCode").innerHTML;
    let fragmentShaderCode = document.querySelector("#fragmentShaderCode").innerHTML;

    // Compile into WebGLShader objects

    let vertexShader = createShader(gl, vertexShaderCode, gl.VERTEX_SHADER);
    let fragmentShader = createShader(gl, fragmentShaderCode, gl.FRAGMENT_SHADER);

    // Attach pre-existing (compiled) shaders
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the compiled shaders into the program to run on the GPU
    gl.linkProgram(program);

    if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
        let info = gl.getProgramInfoLog(program);
        throw 'Could not compile WebGL program. \n\n' + info;
    }

    // we want to do as much bindings and lookups and other things
    // when we start the program so that everything is cached and 
    // easy to use when we are in our drawing loop 

    const vertexBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // four vertices to create a square using gl.TRIANGLE_STRIP 
    const vertices = [
        -1.0, -1.0, 
        1.0, -1.0,
        -1.0, 1.0, 
        1.0, 1.0
    ];

    // Now transfer the vertex information from Javascript to the GPU
    // buffer. We need to convert our array to a typed Float32Array 
    // (required for WebGL to have typed data), then use that to 
    // fill the current buffer set in the gl.ARRAY_BUFFER position.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
                    gl.STATIC_DRAW);

    // setup our attributes

    let attribPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(attribPosition);
    gl.vertexAttribPointer(attribPosition, 2, gl.FLOAT, false, 0, 0);

    programInfo = {
        program: program,
        vertexBuffer: vertexBuffer,
        uTime: gl.getUniformLocation(program, 'u_time'),
        uResolution: gl.getUniformLocation(program, 'u_resolution'),
        points: gl.getUniformLocation(program, 'point'),
        wid: gl.getUniformLocation(program, 'wid'),
        hei: gl.getUniformLocation(program, 'hei')
    }

}

function draw(t) {
    // make our WebGL viewport cover our canvas 
    // this stretches things out, but that's okay for now,
    // just be aware we'll have to do some more work if we want to
    // handle this differently 
    gl.viewport(0,0, w, h);

    // Clear the background to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // set which WebGLProgram to use
    gl.useProgram(programInfo.program);

    // Okay, let's tell WebGL what buffer data we want to use now...
    gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.vertexBuffer);

    // set uniform value
    gl.uniform1f(programInfo.uTime, t * 0.001);
    gl.uniform2f(programInfo.uResolution, w, h);
    gl.uniform2f(programInfo.point, divX, divY);
    gl.uniform1f(programInfo.wid, divWid);
    gl.uniform1f(programInfo.hei, divHei);


    // console.log(divX);
    // console.log(divY);
    // console.log(divWid);
    // console.log(divHei);
    // console.log('');

    // Use TRIANGLE_STRIP: first three vertices establish the first triangle,
    // every point after that uses the last two vertices with the new one
    // to make the next triangle
    var primitiveType = gl.TRIANGLE_STRIP;
    var offset = 0;
    var count = 4;
    gl.drawArrays(primitiveType, offset, count);

    requestAnimationFrame(draw);
}

window.onload = () => {
    setupProgram();
    requestAnimationFrame(draw);
};
