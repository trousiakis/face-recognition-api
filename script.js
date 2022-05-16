const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

//Starts the video streaming
function startVideo () {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,                                      // A function which is invoked when the request for media access is approved. 
        err => console.error(err)                                                // When the call fails
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)                           //make a canvas to diplay results
    document.body.append(canvas)
    const displaySize = { width: video.width,                                     //Size  equal to video's width and heighy
        height: video.height }
        faceapi.matchDimensions(canvas, displaySize)                              //Resize canvas to video width and height
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,                    // get all faces from web-cam image in every call ( element, type-of-library)
            new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()                                                  // Put dots on face landmarks
            .withFaceExpressions()                                                // recognize expression
            console.log(detections)
            const resizedDetections = faceapi.resizeResults(detections, displaySize)                      //Resize the detections so they align with video

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)  // remove previous canvas
            faceapi.draw.drawDetections(canvas, resizedDetections)                //Draw detections on canvas
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) 
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections) 
            },100)
})