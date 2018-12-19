//Inspired and base content from Ben Horn
//https://benjaminhorn.io/code/motion-detection-with-javascript-and-a-web-camera/
//https://github.com/beije/motion-detection-in-javascript/blob/master/index.html

var MotionDetector = {};

var divX, divY;

var divWid, divHei;

function getDivMeasure() {

    let div = document.querySelector('#movement');

    divX = parseFloat(div.style.top);
    divY = parseFloat(div.style.left);

    divWid = parseFloat(div.style.width);
    divHei = parseFloat(div.style.height);

    // console.log(divX);
    // console.log(divY);
    // console.log(divWid);
    // console.log(divHei);
    // console.log('');

    requestAnimationFrame(getDivMeasure);
}

// requestAnimationFrame(getDivMeasure);