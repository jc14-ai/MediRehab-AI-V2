"use client";
import { useEffect, useRef } from "react";

type CameraFeedProps = {
  visibility:boolean;
}

export default function CameraFeed({visibility}:CameraFeedProps) {
  // Tell TypeScript this ref is for an HTMLVideoElement
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: visibility });
        if (videoRef.current) {
          // Type-safe access
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();

    // Stop camera when component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-xl shadow-lg w-[400px] h-[300px]"
      />
    </div>
  );
}
