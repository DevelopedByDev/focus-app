"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Target, Monitor } from "lucide-react";

interface SessionSetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (sessionData: SessionData) => void;
}

export interface SessionData {
  taskDescription: string;
  duration: number; // in minutes
  primaryApps: string;
}

export function SessionSetupDialog({ isOpen, onClose, onStartSession }: SessionSetupDialogProps) {
  const [taskDescription, setTaskDescription] = useState("");
  const [duration, setDuration] = useState<number>(25);
  const [primaryApps, setPrimaryApps] = useState("");
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
              Session Duration
            </Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
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