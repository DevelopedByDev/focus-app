"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Target, Monitor, Camera, Volume2 } from "lucide-react";

interface SessionSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (sessionData: SessionData) => void;
}

export interface SessionData {
  taskDescription: string;
  duration: number; // in minutes
  primaryApps: string;
  screenshotInterval: number; // in seconds
  vocalReminderFrequency: number; // every N distraction screenshots
}

export function SessionSetupDialog({ isOpen, onClose, onStartSession }: SessionSetupDialogProps) {
  const [taskDescription, setTaskDescription] = useState("");
  const [duration, setDuration] = useState<number>(25);
  const [primaryApps, setPrimaryApps] = useState("");
  const [screenshotInterval, setScreenshotInterval] = useState<number>(30);
  const [vocalReminderFrequency, setVocalReminderFrequency] = useState<number>(2);
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (!taskDescription.trim()) {
      alert("Please describe what you want to work on");
      return;
    }

    setIsStarting(true);
    
    const sessionData: SessionData = {
      taskDescription: taskDescription.trim(),
      duration,
      primaryApps: primaryApps.trim(),
      screenshotInterval,
      vocalReminderFrequency,
    };

    try {
      await onStartSession(sessionData);
      onClose();
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start screen sharing. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const resetForm = () => {
    setTaskDescription("");
    setDuration(25);
    setPrimaryApps("");
    setScreenshotInterval(30);
    setVocalReminderFrequency(2);
    setIsStarting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Set Up Your Focus Session
          </DialogTitle>
          <DialogDescription>
            Define your goal and preferences to help AI keep you focused and on track.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              What do you want to work on?
            </Label>
            <Textarea
              id="task-description"
              placeholder="e.g., Writing a blog post in Notion, Studying for my physics exam, Coding a React component..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Session Duration (minutes)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 1 && value <= 60) {
                  setDuration(value);
                }
              }}
              placeholder="25"
            />
            <p className="text-xs text-gray-500">
              Choose between 1 and 60 minutes
            </p>
          </div>

          {/* Primary Apps */}
          <div className="space-y-2">
            <Label htmlFor="primary-apps" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Primary Apps/Tools (Optional)
            </Label>
            <Input
              id="primary-apps"
              placeholder="e.g., Notion, VS Code, Google Docs, Figma..."
              value={primaryApps}
              onChange={(e) => setPrimaryApps(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Apps you'll primarily use - helps AI better understand when you're on task
            </p>
          </div>

          {/* Screenshot Interval */}
          <div className="space-y-2">
            <Label htmlFor="screenshot-interval" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Screenshot Interval (seconds)
            </Label>
            <Input
              id="screenshot-interval"
              type="number"
              min="10"
              max="120"
              value={screenshotInterval}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 10 && value <= 120) {
                  setScreenshotInterval(value);
                }
              }}
              placeholder="30"
            />
            <p className="text-xs text-gray-500">
              How often to take screenshots for AI analysis (10-120 seconds)
            </p>
          </div>

          {/* Vocal Reminder Frequency */}
          <div className="space-y-2">
            <Label htmlFor="vocal-reminders" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Vocal Reminders
            </Label>
            <Select 
              value={vocalReminderFrequency.toString()} 
              onValueChange={(value) => setVocalReminderFrequency(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every distraction screenshot</SelectItem>
                <SelectItem value="2">Every 2 distraction screenshots</SelectItem>
                <SelectItem value="3">Every 3 distraction screenshots</SelectItem>
                <SelectItem value="4">Every 4 distraction screenshots</SelectItem>
                <SelectItem value="5">Every 5 distraction screenshots</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              How often to get voice nudges when you're off-task
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStart} 
            disabled={isStarting || !taskDescription.trim()}
            className="flex-1"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Starting...
              </>
            ) : (
              "Start Session"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 