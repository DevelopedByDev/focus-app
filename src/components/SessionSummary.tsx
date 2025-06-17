"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, Clock, Target, BarChart3, AlertTriangle, CheckCircle, 
  Camera, TrendingUp, Lightbulb, Home, RotateCcw 
} from "lucide-react";
import { SessionStats } from "@/services/sessionAnalytics";
import { SessionData } from "./SessionSetupDialog";

interface SessionSummaryProps {
  sessionData: SessionData;
  sessionStats: SessionStats;
  onStartNewSession: () => void;
  onReturnHome: () => void;
}

export function SessionSummary({ 
  sessionData, 
  sessionStats, 
  onStartNewSession, 
  onReturnHome 
}: SessionSummaryProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getFocusGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 50) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const focusGrade = getFocusGrade(sessionStats.focusPercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Session Complete!</h1>
          </div>
          <p className="text-xl text-gray-600">
            Here&apos;s how you performed during your focus session
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Focus Grade */}
          <Card className={`text-center ${focusGrade.bg} border-2`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                Focus Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${focusGrade.color} mb-2`}>
                {focusGrade.grade}
              </div>
              <p className="text-sm text-gray-600">
                {Math.round(sessionStats.focusPercentage)}% Focus Rate
              </p>
            </CardContent>
          </Card>

          {/* Session Duration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Session Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatTime(sessionStats.actualSessionTime)}
              </div>
              <p className="text-sm text-gray-600">
                of {formatTime(sessionStats.sessionDuration)} planned
              </p>
            </CardContent>
          </Card>

          {/* Screenshots */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {sessionStats.totalScreenshots}
              </div>
              <p className="text-sm text-gray-600">
                AI analyses performed
              </p>
            </CardContent>
          </Card>

          {/* Focus vs Distraction */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Focus Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Focused</span>
                  </div>
                  <span className="font-medium">{sessionStats.focusedScreenshots}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Distracted</span>
                  </div>
                  <span className="font-medium">{sessionStats.distractedScreenshots}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Task:</h4>
                <p className="text-gray-700">{sessionData.taskDescription}</p>
              </div>
              {sessionData.primaryApps && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Primary Tools:</h4>
                  <p className="text-gray-700">{sessionData.primaryApps}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {sessionData.screenshotInterval}s
                  </div>
                  <div className="text-xs text-gray-600">Screenshot Interval</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    Every {sessionData.vocalReminderFrequency}
                  </div>
                  <div className="text-xs text-gray-600">Voice Reminders</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Major Distractions */}
        {sessionStats.majorDistractions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Major Distractions Identified
              </CardTitle>
              <CardDescription>
                High-confidence detections of when you were off-task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionStats.majorDistractions.map((distraction, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{distraction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actionable Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Actionable Steps for Next Session
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your focus patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {sessionStats.actionableSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onStartNewSession}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Start New Session
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onReturnHome}
            className="text-lg px-8 py-6 h-auto"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 