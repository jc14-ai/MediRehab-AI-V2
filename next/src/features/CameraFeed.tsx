"use client";

import { useEffect, useRef, useState } from "react";

type CameraFeedProps = {
  exercise: string;
  dataPoints:number[];
  label:string;
  parts:string[];
};

declare const drawConnectors: any;
declare const drawLandmarks: any;

export default function CameraFeed({ exercise, dataPoints, label, parts }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const toggleCamera = async () => {
    if (isRunning) {
      cameraRef.current?.stop();
      cameraRef.current = null;
      setIsRunning(false);
      return;
    }

    setIsRunning(true);

    const poseModule = await import("@mediapipe/pose");
    const Pose = poseModule.default || poseModule;
    const POSE_CONNECTIONS = poseModule.POSE_CONNECTIONS;

    const cameraModule = await import("@mediapipe/camera_utils");
    const Camera = cameraModule.default || cameraModule;

    const pose = new Pose.Pose({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    pose.onResults((results: any) => {
      if (!results.poseLandmarks) return;

      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      if (typeof drawConnectors !== "undefined") {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          lineWidth: 4,
        });
      }

      if (typeof drawLandmarks !== "undefined") {
        drawLandmarks(ctx, results.poseLandmarks, { radius: 3 });
      }

      // const parts = [
      //   "LEFT_SHOULDER",
      //   "RIGHT_SHOULDER",
      //   "LEFT_ELBOW",
      //   "RIGHT_ELBOW",
      //   "LEFT_HIP",
      //   "RIGHT_HIP",
      // ];

      const keypoints = dataPoints.map((i, index) => ({
        part: parts[index],
        x_coords: results.poseLandmarks[i].x,
        y_coords: results.poseLandmarks[i].y,
        z_coords: results.poseLandmarks[i].z,
        labels: label,
      }));

      fetch(`http://127.0.0.1:5000/record/${exercise}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: keypoints }),
      });
    });

    if (videoRef.current) {
      cameraRef.current = new Camera.Camera(videoRef.current, {
        onFrame: async () => await pose.send({ image: videoRef.current }),
        width: 1280,
        height: 720,
      });
      cameraRef.current.start();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full p-5 gap-3">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={toggleCamera}
      >
        {isRunning ? "Stop Camera" : "Start Camera"}
      </button>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-xl shadow-lg h-full w-full"
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}