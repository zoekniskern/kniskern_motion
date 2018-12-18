//Inspired and base content from Ben Horn
//https://benjaminhorn.io/code/motion-detection-with-javascript-and-a-web-camera/
//https://github.com/beije/motion-detection-in-javascript/blob/master/index.html

;(function (App) {

    //Motion detector

    //Return Initialized Object
    App.Core = function() {
        var rendering = false;

        var width = 64;
        var height = 48;

        var webCam = null;
        var imageCompare = null;

        var currentImage = null;
        var oldImage = null;

        var topLeft = [Infinity, Infinity];
        var bottomRight = [0,0];

        var raf = (function(){
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000/60)
            }
        })
    

        //Initialize Object
        function initialize() {
            console.log('core initialize ran');
            imageCompare = new App.Compare();
            webCam = new App.Webcam(document.getElementById('webCamWindow'));

            rendering = true;

            main();
        }

        //Compares Images and Updates Position of Motion Div
        function render() {
            console.log('inside render function');
            oldImage = currentImage;
            currentImage = webCam.captureImage(false);

            if(!oldImage || !currentImage) {
                console.log("old image and current image exception");
                return;
            }

            var vals = imageCompare.compare(currentImage, oldImage, width, height);
            console.log(vals);

            topLeft[0] = vals.topLeft[0] * 10;
            topLeft[1] = vals.topLeft[1] * 10;

            bottomRight[0] = vals.bottomRight[0] * 10;
            bottomRight[1] = vals.bottomRight[1] * 10;

            document.getElementById('movement').style.top = topLeft[1] + 'px';
            document.getElementById('movement').style.top = topLeft[0] + 'px';

            document.getElementById('movement').style.width = (bottomRight[0] - topLeft[0]) + 'px';
            document.getElementById('movement').style.height = (bottomRight[1] - topLeft[1]) + 'px';

            topLeft = [Infinity, Infinity];
            bottomRight = [0,0];
        }

        //Main Render Loop
        function main() {
            console.log('main core render loop ran');
            try{
                console.log("tried render?");
                render();
            } catch(e) {
                console.log(e);
                return;
            }

            if(rendering == true){
                raf(main.bind(this));
            }
        }

        initialize();
    };
})(MotionDetector);