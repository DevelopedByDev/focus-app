"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Shield, Zap, Brain, Clock, Target } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartSession = () => {
    setIsStarting(true);
    // TODO: Navigate to session setup page
    setTimeout(() => setIsStarting(false), 2000); // Temporary simulation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FocusAI</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            AI-Powered Focus
          </Badge>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Stay on Task with
              <span className="text-blue-600"> AI Monitoring</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Set your goal, start working, and let AI analyze your screen every 30 seconds 
              to keep you focused and on track. Real-time feedback when you drift off task.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={handleStartSession}
              disabled={isStarting}
            >
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Start Focus Session
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Monitoring</CardTitle>
              <CardDescription>
                AI analyzes your screen every 30 seconds to understand what you're working on
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Screenshots are never saved. Analysis happens in real-time and data is discarded
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Real-time Feedback</CardTitle>
              <CardDescription>
                Instant overlay notifications when you drift off task to keep you focused
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Define Your Task</h3>
              <p className="text-gray-600">
                Describe what you want to work on in natural language
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Start Working</h3>
              <p className="text-gray-600">
                Begin your work session and let AI monitor your progress
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Stay Focused</h3>
              <p className="text-gray-600">
                Get gentle reminders when you drift off task
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gray-900 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who use AI to stay focused and get more done.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 h-auto"
            onClick={handleStartSession}
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent mr-2" />
                Starting Session...
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 mr-2" />
                Start Your First Session
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 FocusAI. Built for productivity enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
