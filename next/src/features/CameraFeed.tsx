"use client";

import { useEffect, useRef, useState } from "react";

type CameraFeedProps = {
  exercise: string;
  dataPoints: number[];
  label: string;
  parts: string[];
  patientId:string;
  assignId:string;
  resultId:string;
};

declare const drawConnectors: any;
declare const drawLandmarks: any;

export default function CameraFeed({ exercise, dataPoints, label, parts, patientId, assignId, resultId }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const cameraRef = useRef<any>(null);

  // Timers
  const screenshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const takeScreenshot = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    await fetch("/api/save-screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData, patientId: patientId, assignId:assignId, resultId:resultId}),
    });
  };

  const toggleCamera = async () => {
    // Stop camera logic
    if (isRunning) {
      cameraRef.current?.stop();
      cameraRef.current = null;
      setIsRunning(false);

      if (screenshotIntervalRef.current) clearInterval(screenshotIntervalRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);

      return;
    }

    setIsRunning(true);

    const poseModule = await import("@mediapipe/pose");
    const Pose = poseModule.default || poseModule;
    const POSE_CONNECTIONS = poseModule.POSE_CONNECTIONS;

    const cameraModule = await import("@mediapipe/camera_utils");
    const Camera = cameraModule.default || cameraModule;

    const pose = new Pose.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
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
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);

      if (typeof drawConnectors !== "undefined") {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { lineWidth: 4 });
      }

      if (typeof drawLandmarks !== "undefined") {
        drawLandmarks(ctx, results.poseLandmarks, { radius: 3 });
      }

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

    // Every 10 seconds: take screenshot
    screenshotIntervalRef.current = setInterval(() => {
      takeScreenshot();
    }, 10000);

    // Stop after 30 seconds
    stopTimeoutRef.current = setTimeout(() => {
      toggleCamera();
    }, 30000);
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
          className="rounded-xl shadow-lg h-full w-full transform scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
}
