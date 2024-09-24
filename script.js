// Function to get finger distance
function getFingerDistance(handLandmarks) {
  const thumbTip = handLandmarks[4];
  const indexFingerTip = handLandmarks[8];
  const distance = Math.sqrt(
    (indexFingerTip[0] - thumbTip[0]) ** 2 +
      (indexFingerTip[1] - thumbTip[1]) ** 2
  );
  return distance;
}

// Load handpose model
handpose
  .load()
  .then((model) => {
    console.log("Handpose model loaded.");
    detectHand(model);
  })
  .catch((err) => {
    console.error("Error loading Handpose model:", err);
  });

// Function to detect hand
function detectHand(model) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      const video = document.getElementById("video");
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
      };

      // Interval for hand detection
      setInterval(async () => {
        const predictions = await model.estimateHands(video);
        if (predictions.length > 0) {
          const handLandmarks = predictions[0].landmarks;
          const fingerDistance = getFingerDistance(handLandmarks);
          document.getElementById(
            "output"
          ).innerText = `Finger Distance: ${fingerDistance.toFixed(2)}px`;

          // Adjust brightness based on finger distance
          // The scale is adjusted for better control
          let brightness = Math.min(
            Math.max((fingerDistance - 50) / 3, 30),
            100
          );
          document.body.style.filter = `brightness(${brightness}%)`;
        } else {
          document.getElementById("output").innerText = "No hand detected";
        }
      }, 50);
    })
    .catch((err) => {
      console.error("Error accessing camera:", err);
    });
}
