"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Square } from "lucide-react"

type CameraFeedProps = {
  exercise: string
  dataPoints: number[]
  label: string
  parts: string[]
  patientId: string
  assignId: string
  resultId: string
}

declare const drawConnectors: any
declare const drawLandmarks: any

export default function CameraFeed({
  exercise,
  dataPoints,
  label,
  parts,
  patientId,
  assignId,
  resultId,
}: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const cameraRef = useRef<any>(null)

  // Timers
  const screenshotIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const takeScreenshot = async () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL("image/png")

    await fetch("/api/save-screenshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData, patientId: patientId, assignId: assignId, resultId: resultId }),
    })
  }

  const toggleCamera = async () => {
    // Stop camera logic
    if (isRunning) {
      cameraRef.current?.stop()
      cameraRef.current = null
      setIsRunning(false)

      if (screenshotIntervalRef.current) clearInterval(screenshotIntervalRef.current)
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current)

      return
    }

    setIsRunning(true)

    const poseModule = await import("@mediapipe/pose")
    const Pose = poseModule.default || poseModule
    const POSE_CONNECTIONS = poseModule.POSE_CONNECTIONS

    const cameraModule = await import("@mediapipe/camera_utils")
    const Camera = cameraModule.default || cameraModule

    const pose = new Pose.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    })

    pose.onResults((results: any) => {
      if (!results.poseLandmarks) return

      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas || !video) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.scale(-1, 1)
      ctx.translate(-canvas.width, 0)

      if (typeof drawConnectors !== "undefined") {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { lineWidth: 4 })
      }

      if (typeof drawLandmarks !== "undefined") {
        drawLandmarks(ctx, results.poseLandmarks, { radius: 3 })
      }

      const keypoints = dataPoints.map((i, index) => ({
        part: parts[index],
        x_coords: results.poseLandmarks[i].x,
        y_coords: results.poseLandmarks[i].y,
        z_coords: results.poseLandmarks[i].z,
        labels: label,
      }))

      fetch(`http://127.0.0.1:5000/record/${exercise}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame: keypoints }),
      })
    })

    if (videoRef.current) {
      cameraRef.current = new Camera.Camera(videoRef.current, {
        onFrame: async () => await pose.send({ image: videoRef.current }),
        width: 1280,
        height: 720,
      })
      cameraRef.current.start()
    }

    // Every 10 seconds: take screenshot
    screenshotIntervalRef.current = setInterval(() => {
      takeScreenshot()
    }, 10000)

    // Stop after 30 seconds
    stopTimeoutRef.current = setTimeout(() => {
      toggleCamera()
    }, 30000)
  }

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <Button onClick={toggleCamera} variant={isRunning ? "destructive" : "default"} size="lg" className="gap-2">
        {isRunning ? (
          <>
            <Square className="h-4 w-4" />
            Stop Camera
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            Start Camera
          </>
        )}
      </Button>

      <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden border bg-muted">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Click Start Camera to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
