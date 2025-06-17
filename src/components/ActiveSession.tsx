"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Clock, Target, StopCircle, Eye } from "lucide-react";
import { SessionData } from "./SessionSetupDialog";

interface ActiveSessionProps {
  sessionData: SessionData;
  lastScreenshot: string | null;
  isCapturing: boolean;
  onEndSession: () => void;
}

export function ActiveSession({ sessionData, lastScreenshot, isCapturing, onEndSession }: ActiveSessionProps) {
  const [timeRemaining, setTimeRemaining] = useState(sessionData.duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    setIsActive(false);
    onEndSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Session Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Focus Session Active</h1>
                <p className="text-gray-600">AI is monitoring your progress</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isCapturing ? "default" : "secondary"} className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {isCapturing ? "Monitoring" : "Paused"}
              </Badge>
              <Button variant="destructive" onClick={handleEndSession}>
                <StopCircle className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </div>

        {/* Session Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{sessionData.taskDescription}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(timeRemaining)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Primary Apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {sessionData.primaryApps || "Not specified"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Screenshot Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Latest Screenshot
            </CardTitle>
            <CardDescription>
              {lastScreenshot 
                ? "AI analyzes this view every 30 seconds to keep you on track"
                : "Waiting for first screenshot..."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastScreenshot ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={lastScreenshot} 
                    alt="Current screen capture" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Screenshot taken automatically • Not stored or transmitted beyond analysis
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isCapturing ? "Taking first screenshot..." : "Screen sharing not active"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Complete */}
        {timeRemaining <= 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Session Complete!</CardTitle>
              <CardDescription className="text-green-700">
                Great job staying focused for {sessionData.duration} minutes!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleEndSession} className="bg-green-600 hover:bg-green-700">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 