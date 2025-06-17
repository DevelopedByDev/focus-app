"use client";

import { useState, useCallback, useRef } from "react";

export interface ScreenCaptureHook {
  isCapturing: boolean;
  lastScreenshot: string | null;
  error: string | null;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
}

export function useScreenCapture(): ScreenCaptureHook {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureScreenshot = useCallback(async (): Promise<string | null> => {
    if (!streamRef.current || !videoRef.current) return null;

    try {
      // Create canvas and capture frame
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) throw new Error("Could not get canvas context");

      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to canvas
      ctx.drawImage(video, 0, 0);
      
      // Convert to base64
      const screenshot = canvas.toDataURL("image/jpeg", 0.8);
      
      return screenshot;
    } catch (err) {
      console.error("Error capturing screenshot:", err);
      return null;
    }
  }, []);

  const startCapture = useCallback(async () => {
    try {
      setError(null);
      
      // Request screen capture permission
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 10, max: 15 }
        },
        audio: false,
      });

      streamRef.current = stream;

      // Create a video element to display the stream
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      
      // Keep reference to video
      videoRef.current = video;

      // Wait for video to load
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = reject;
      });

      setIsCapturing(true);

      // Take initial screenshot after a short delay to ensure video is ready
      setTimeout(async () => {
        const initialScreenshot = await captureScreenshot();
        if (initialScreenshot) {
          setLastScreenshot(initialScreenshot);
        }
      }, 1000);

      // Set up interval to capture screenshots every 30 seconds
      intervalRef.current = setInterval(async () => {
        const screenshot = await captureScreenshot();
        if (screenshot) {
          setLastScreenshot(screenshot);
          console.log("Screenshot captured at:", new Date().toLocaleTimeString());
        }
      }, 30000); // 30 seconds

      // Handle stream ending (user stops sharing)
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("Screen sharing stopped by user");
        stopCapture();
      });

    } catch (err: any) {
      console.error("Error starting screen capture:", err);
      if (err.name === "NotAllowedError") {
        setError("Screen sharing permission denied. Please allow screen sharing to start the session.");
      } else if (err.name === "NotSupportedError") {
        setError("Screen sharing is not supported in this browser. Please use Chrome, Firefox, or Safari.");
      } else {
        setError(err.message || "Failed to start screen capture");
      }
      setIsCapturing(false);
    }
  }, [captureScreenshot]);

  const stopCapture = useCallback(() => {
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }

    setIsCapturing(false);
    setError(null);
    console.log("Screen capture stopped");
  }, []);

  return {
    isCapturing,
    lastScreenshot,
    error,
    startCapture,
    stopCapture,
  };
} 