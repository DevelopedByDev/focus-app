"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ttsService, TTSOptions } from "@/services/ttsService";
import { TaskAnalysisResult } from "@/services/aiAnalysis";

export interface VoiceAssistantHook {
  isSpeaking: boolean;
  isEnabled: boolean;
  lastNudgeTime: number | null;
  toggleVoiceAssistant: () => void;
  speakText: (text: string, options?: TTSOptions) => Promise<void>;
  handleAnalysisResult: (result: TaskAnalysisResult) => void;
  setNudgeInterval: (minutes: number) => void;
}

export function useVoiceAssistant(initialEnabled: boolean = true): VoiceAssistantHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [lastNudgeTime, setLastNudgeTime] = useState<number | null>(null);
  const [nudgeInterval, setNudgeIntervalState] = useState(2); // 2 minutes default
  const consecutiveOffTaskCount = useRef(0);

  const speakText = useCallback(async (text: string, options: TTSOptions = {}) => {
    if (!isEnabled) return;
    
    setIsSpeaking(true);
    try {
      await ttsService.speakText(text, options);
    } finally {
      setIsSpeaking(false);
    }
  }, [isEnabled]);

  const shouldNudgeUser = useCallback(() => {
    const now = Date.now();
    if (!lastNudgeTime) return true;

    const timeSinceLastNudge = (now - lastNudgeTime) / (1000 * 60); // minutes
    return timeSinceLastNudge >= nudgeInterval;
  }, [lastNudgeTime, nudgeInterval]);

  const handleAnalysisResult = useCallback(async (result: TaskAnalysisResult) => {
    if (!isEnabled || isSpeaking) return;

    if (!result.isOnTask) {
      consecutiveOffTaskCount.current += 1;
      
      // Only nudge if:
      // 1. User has been off-task for 2+ consecutive analysis cycles
      // 2. Enough time has passed since last nudge
      // 3. Confidence is reasonably high (>0.6)
      if (consecutiveOffTaskCount.current >= 2 && 
          shouldNudgeUser() && 
          result.confidence > 0.6) {
        
        console.log("Voice Assistant: Nudging user for being off-task");
        
        try {
          await ttsService.nudgeUser();
          setLastNudgeTime(Date.now());
          consecutiveOffTaskCount.current = 0; // Reset counter after nudge
        } catch (error) {
          console.error("Failed to play nudge audio:", error);
        }
      }
    } else {
      // User is back on task, reset counter
      consecutiveOffTaskCount.current = 0;
    }
  }, [isEnabled, isSpeaking, shouldNudgeUser]);

  const toggleVoiceAssistant = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const setNudgeInterval = useCallback((minutes: number) => {
    setNudgeIntervalState(Math.max(1, minutes)); // Minimum 1 minute
  }, []);

  // Log voice assistant state changes
  useEffect(() => {
    console.log(`Voice Assistant: ${isEnabled ? 'Enabled' : 'Disabled'}`);
  }, [isEnabled]);

  return {
    isSpeaking,
    isEnabled,
    lastNudgeTime,
    toggleVoiceAssistant,
    speakText,
    handleAnalysisResult,
    setNudgeInterval,
  };
} 