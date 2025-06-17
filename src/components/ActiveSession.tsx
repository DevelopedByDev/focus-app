"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Clock, Target, StopCircle, Eye, Brain, CheckCircle, AlertTriangle, Loader2, Volume2, VolumeX } from "lucide-react";
import { SessionData } from "./SessionSetupDialog";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";

interface ActiveSessionProps {
  sessionData: SessionData;
  lastScreenshot: string | null;
  isCapturing: boolean;
  onEndSession: () => void;
}

export function ActiveSession({ sessionData, lastScreenshot, isCapturing, onEndSession }: ActiveSessionProps) {
  const [timeRemaining, setTimeRemaining] = useState(sessionData.duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(true);
  const [lastAnalyzedScreenshot, setLastAnalyzedScreenshot] = useState<string | null>(null);
  
  const {
    analysisResult,
    analysisError,
    isAnalyzing,
    analyzeScreenshot,
    clearAnalysis
  } = useAIAnalysis();

  const {
    isSpeaking,
    isEnabled: isVoiceAssistantEnabled,
    toggleVoiceAssistant,
    handleAnalysisResult
  } = useVoiceAssistant(true);

  // Timer effect
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

  // AI Analysis effect - trigger when new screenshot is available
  useEffect(() => {
    if (lastScreenshot && lastScreenshot !== lastAnalyzedScreenshot && !isAnalyzing) {
      console.log("New screenshot detected, starting AI analysis...");
      analyzeScreenshot(
        lastScreenshot,
        sessionData.taskDescription,
        sessionData.primaryApps
      );
      setLastAnalyzedScreenshot(lastScreenshot);
    }
  }, [lastScreenshot, lastAnalyzedScreenshot, isAnalyzing, analyzeScreenshot, sessionData]);

  // Voice Assistant effect - handle analysis results for voice nudges
  useEffect(() => {
    if (analysisResult && !isAnalyzing) {
      handleAnalysisResult(analysisResult);
    }
  }, [analysisResult, isAnalyzing, handleAnalysisResult]);

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
    clearAnalysis();
    onEndSession();
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
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
              <Badge 
                variant={isVoiceAssistantEnabled ? "default" : "secondary"} 
                className={`flex items-center gap-1 cursor-pointer hover:opacity-80 ${
                  isSpeaking ? 'animate-pulse' : ''
                }`}
                onClick={toggleVoiceAssistant}
              >
                {isVoiceAssistantEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                {isSpeaking ? "Speaking..." : isVoiceAssistantEnabled ? "Voice On" : "Voice Off"}
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

        {/* AI Analysis Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Focus Analysis
            </CardTitle>
            <CardDescription>
              Real-time AI assessment of whether you're staying on task
              {isVoiceAssistantEnabled && (
                <span className="text-blue-600 font-medium"> • Voice nudges enabled</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                <span className="text-gray-600">Analyzing screenshot...</span>
              </div>
            ) : analysisError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Analysis Error</span>
                </div>
                <p className="text-red-700 text-sm">{analysisError.error}</p>
                {analysisError.code === "SERVICE_NOT_INITIALIZED" && (
                  <p className="text-red-600 text-xs mt-2">
                    💡 Add your Google AI API key to enable AI analysis
                  </p>
                )}
              </div>
            ) : analysisResult ? (
              <div className={`border rounded-lg p-4 ${
                analysisResult.isOnTask 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {analysisResult.isOnTask ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className={`font-medium ${
                      analysisResult.isOnTask ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {analysisResult.isOnTask ? 'On Task ✅' : 'Potentially Off Task ⚠️'}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {formatConfidence(analysisResult.confidence)} confident
                  </Badge>
                </div>
                <p className={`text-sm ${
                  analysisResult.isOnTask ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {analysisResult.explanation}
                </p>
                {!analysisResult.isOnTask && isVoiceAssistantEnabled && (
                  <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    Voice assistant will provide nudges if you stay off-task
                  </div>
                )}
              </div>
            ) : lastScreenshot ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Waiting for AI analysis...</p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Brain className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">AI analysis will appear here once screenshots are available</p>
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