//Inspired and base content from Ben Horn
//https://benjaminhorn.io/code/motion-detection-with-javascript-and-a-web-camera/
//https://github.com/beije/motion-detection-in-javascript/blob/master/index.html

;(function (App) {

    App.Webcam = function(videoElement) {
        var webCamWindow = false;
        var width = 640;
        var height = 480;

        //Initialize
        function initialize(videoElement) {
            if(typeof videoElement != 'object') {
                webCamWindow = document.getElementById(videoElement);
            } else {
                webCamWindow = videoElement;
            }

            if(hasSupport()) {
                if(webCamWindow) {
                    webCamWindow.style.width = width + 'px';
                    webCamWindow.style.height = height + 'px';
                    startStream();
                }
            } else {
                alert('no support found');
            }
        }

        //Streaming from webcam to video element
        function startStream() {
            (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia).call(
                navigator,
                {video: true},
                function(localMediaStream) {
                    if(webCamWindow) {
                        var vendorURL = window.URL || window.webkitURL;

                        if(navigator.mozGetUserMedia) {
                            webCamWindow.mozSrcObject = localMediaStream;
							webCamWindow.play();
                        } else {
                            webCamWindow.srcObject = localMediaStream;
                        }
                    }
                },
                console.error
            );
        }

        //Capture Image Still
        function captureImage(append) {

            console.log('capture image ran');
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(webCamWindow, 0, 0, width, height);

            var pngImage = canvas.toDataURL('image/png');

            if(append) {
                append.appendChild(canvas);
            }

            return canvas;
        }

        //Size of Video
        function setSize(w,h) {
            width = w;
            height = h;
        }

        //Browser Support
        function hasSupport() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }

        //Initialize on Creation
        initialize(videoElement);

        //Return capture
        return {
            setSize: setSize,
            hasSupport: hasSupport,
            captureImage: captureImage
        };
    }

})(MotionDetector);