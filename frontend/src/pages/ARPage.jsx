import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const ARPage = () => {
  const [showAR, setShowAR] = useState(false);
  const [cameraAccessGranted, setCameraAccessGranted] = useState(false);

  // Function to toggle AR view and request camera permissions
  const toggleAR = () => {
    if (!showAR) {
      // Request camera access when the AR scene is activated
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          console.log('Camera access granted');
          setCameraAccessGranted(true); // Set camera access granted flag
          setShowAR(true); // Show AR view
        })
        .catch((err) => {
          console.error('Camera access denied: ', err);
          alert('Camera access is required to use the AR functionality.');
        });
    } else {
      // Hide the AR scene if it's already showing
      setShowAR(false);
      setCameraAccessGranted(false); // Reset the camera access flag
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-4 pt-36">
        <h1 className="text-2xl font-bold mb-4">AR Functionality</h1>

        {/* Button to trigger AR */}
        <button
          onClick={toggleAR}
          className="px-4 py-2 border border-main-color text-white bg-blue-500 hover:bg-blue-700 rounded-xl transition-colors duration-200"
        >
          {showAR ? 'Hide AR View' : 'Show AR View'}
        </button>

        {/* Conditional rendering of AR scene */}
        {showAR && cameraAccessGranted && (
          <div className="mt-6">
            {/* AR.js scene with webcam video feed and AR functionality */}
            <a-scene
              embedded
              arjs="sourceType: webcam; debugUIEnabled: false;"
              renderer="logarithmicDepthBuffer: true;"
            >
              {/* Hiro Marker for AR */}
              <a-marker preset="hiro">
                <a-box position="0 0.5 0" rotation="0 45 0" color="#4CC3D9"></a-box>
              </a-marker>

              {/* Camera entity */}
              <a-entity camera></a-entity>
            </a-scene>
          </div>
        )}
      </div>
    </>
  );
};

export default ARPage;
