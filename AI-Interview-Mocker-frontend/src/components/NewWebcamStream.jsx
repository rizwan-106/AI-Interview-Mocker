import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { VITE_EYE_FACE_BE_API } from "@/utils/utils";
const NewWebcamStream = () => {
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  const [analysis, setAnalysis] = useState({
    face_detected: false,
    face_count: 0,
    focused: false,
  });

  const [focusedFrames, setFocusedFrames] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [focusPercent, setFocusPercent] = useState(0);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [lastWarning, setLastWarning] = useState("");
  

  const handleStartRecording = () => {
    if (recordingStarted) return;

    // Connect socket
    socketRef.current = io(VITE_EYE_FACE_BE_API);
    

    setFocusedFrames(0);
    setTotalFrames(0);
    setFocusPercent(0);
    setLastWarning("");

    setRecordingStarted(true);

    // Emit frames every 500ms
    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc && socketRef.current) {
          socketRef.current.emit("frame", { image: imageSrc });
        }
      }
    }, 500);

    // Listen for analysis
    socketRef.current.on("analysis", (data) => {
      setAnalysis(data);
      setTotalFrames((prev) => prev + 1);
      if (data.focused) {
        setFocusedFrames((prev) => prev + 1);
      }

      const currentFocusPercent =
        ((focusedFrames + (data.focused ? 1 : 0)) / (totalFrames + 1)) * 100;

      // Show warning as toast
      let warning = "";
      if (!data.face_detected) {
        warning =
          "⚠️ No face detected! Please stay visible in front of the camera.";
      } else if (!data.focused) {
        warning = "⚠️ You seem distracted. Please stay focused.";
      } else if (currentFocusPercent < 60 && totalFrames > 5) {
        warning = "⚠️ Your focus is too low. Pay attention to the interview.";
      }

      if (warning && warning !== lastWarning) {
        toast.warn(warning);
        setLastWarning(warning);
      }

      if (!warning) setLastWarning("");
    });
  };

  const handleStopRecording = () => {
    if (!recordingStarted) return;

    // Clear intervals and socket
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setRecordingStarted(false);
  };

  // Update focus percentage
  useEffect(() => {
    if (totalFrames > 0) {
      const percent = ((focusedFrames / totalFrames) * 100).toFixed(2);
      setFocusPercent(Number(percent));
    }
  }, [focusedFrames, totalFrames]);

  return (
    <div style={{ padding: 20 }}>
      <ToastContainer />
      <h2>Live Webcam Feed</h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored
        width={400}
        height={300}
      />

      <div style={{ marginTop: 10 }}>
        {!recordingStarted ? (
          <button
            onClick={handleStartRecording}
            style={{
              padding: "10px 20px",
              fontWeight: "bold",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ▶️ Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            style={{
              padding: "10px 20px",
              fontWeight: "bold",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Real-time Analysis</h3>
        <p>
          <strong>Face Detected:</strong>{" "}
          {analysis.face_detected ? "Yes" : "No"}
        </p>
        <p>
          <strong>Face Count:</strong> {analysis.face_count}
        </p>
        <p>
          <strong>Focused:</strong> {analysis.focused ? "Yes" : "No"}
        </p>
        <p>
          <strong>Total Frames:</strong> {totalFrames}
        </p>
        <p>
          <strong>Focused Frames:</strong> {focusedFrames}
        </p>
        <p>
          <strong>Focus Percentage:</strong> {focusPercent}%
        </p>
      </div>
    </div>
  );
};

export default NewWebcamStream;
