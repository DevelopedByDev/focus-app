"use client";

import { TaskAnalysisResult } from "@/services/aiAnalysis";

export interface AnalysisRecord {
  timestamp: Date;
  result: TaskAnalysisResult;
  screenshot?: string;
}

export interface SessionStats {
  totalScreenshots: number;
  focusedScreenshots: number;
  distractedScreenshots: number;
  focusPercentage: number;
  sessionDuration: number; // in minutes
  actualSessionTime: number; // actual time elapsed in minutes
  majorDistractions: string[];
  detailedAnalysis: AnalysisRecord[];
  actionableSteps: string[];
}

class SessionAnalyticsService {
  private analysisHistory: AnalysisRecord[] = [];
  private sessionStartTime: Date | null = null;
  private sessionEndTime: Date | null = null;
  private originalDuration: number = 0; // in minutes

  startSession(duration: number): void {
    this.sessionStartTime = new Date();
    this.originalDuration = duration;
    this.analysisHistory = [];
    this.sessionEndTime = null;
    console.log("Session analytics started");
  }

  addAnalysisResult(result: TaskAnalysisResult, screenshot?: string): void {
    const record: AnalysisRecord = {
      timestamp: new Date(),
      result,
      screenshot
    };
    
    this.analysisHistory.push(record);
    console.log(`Analysis recorded: ${result.isOnTask ? 'On Task' : 'Off Task'} (${Math.round(result.confidence * 100)}% confidence)`);
  }

  endSession(): SessionStats {
    this.sessionEndTime = new Date();
    const stats = this.generateSessionStats();
    console.log("Session analytics completed:", stats);
    return stats;
  }

  private generateSessionStats(): SessionStats {
    const totalScreenshots = this.analysisHistory.length;
    const focusedScreenshots = this.analysisHistory.filter(record => record.result.isOnTask).length;
    const distractedScreenshots = totalScreenshots - focusedScreenshots;
    const focusPercentage = totalScreenshots > 0 ? (focusedScreenshots / totalScreenshots) * 100 : 0;

    // Calculate actual session time
    const actualSessionTime = this.sessionStartTime && this.sessionEndTime 
      ? (this.sessionEndTime.getTime() - this.sessionStartTime.getTime()) / (1000 * 60)
      : 0;

    // Extract major distractions (off-task explanations with high confidence)
    const majorDistractions = this.analysisHistory
      .filter(record => !record.result.isOnTask && record.result.confidence > 0.5)
      .map(record => record.result.explanation)
      .filter((explanation, index, arr) => arr.indexOf(explanation) === index) // Remove duplicates
      .slice(0, 5); // Top 5 unique distractions

    // Generate actionable steps based on analysis
    const actionableSteps = this.generateActionableSteps(majorDistractions, focusPercentage);

    return {
      totalScreenshots,
      focusedScreenshots,
      distractedScreenshots,
      focusPercentage,
      sessionDuration: this.originalDuration,
      actualSessionTime,
      majorDistractions,
      detailedAnalysis: this.analysisHistory,
      actionableSteps
    };
  }

  private generateActionableSteps(distractions: string[], focusPercentage: number): string[] {
    const steps: string[] = [];

    // Focus percentage based recommendations
    if (focusPercentage >= 80) {
      steps.push("🎉 Excellent focus! Consider increasing session duration next time.");
    } else if (focusPercentage >= 60) {
      steps.push("👍 Good focus overall. Try to identify and eliminate the main distractions.");
    } else if (focusPercentage >= 40) {
      steps.push("⚠️ Room for improvement. Consider shorter sessions or removing distracting apps.");
    } else {
      steps.push("🚨 Low focus detected. Try breaking tasks into smaller chunks or using website blockers.");
    }

    // Distraction-specific recommendations
    const distractionLower = distractions.join(' ').toLowerCase();
    
    if (distractionLower.includes('social media') || distractionLower.includes('facebook') || 
        distractionLower.includes('twitter') || distractionLower.includes('instagram')) {
      steps.push("📱 Consider using a social media blocker during focus sessions.");
    }
    
    if (distractionLower.includes('email') || distractionLower.includes('gmail') || 
        distractionLower.includes('outlook')) {
      steps.push("📧 Set specific times for checking email instead of during focus work.");
    }
    
    if (distractionLower.includes('youtube') || distractionLower.includes('video') || 
        distractionLower.includes('entertainment')) {
      steps.push("🎥 Consider using website blockers for entertainment sites during work hours.");
    }
    
    if (distractionLower.includes('news') || distractionLower.includes('reddit')) {
      steps.push("📰 Limit news consumption to specific times of day to maintain focus.");
    }
    
    if (distractionLower.includes('phone') || distractionLower.includes('mobile')) {
      steps.push("📵 Try putting your phone in airplane mode or another room during focus sessions.");
    }

    // General recommendations
    if (distractions.length > 3) {
      steps.push("🔄 Consider the Pomodoro Technique: 25 minutes focused work, 5 minute breaks.");
    }
    
    if (distractions.length === 0 && focusPercentage < 100) {
      steps.push("🎯 Great job avoiding major distractions! Fine-tune your environment for even better focus.");
    }

    return steps.slice(0, 6); // Max 6 actionable steps
  }

  // Get real-time stats during session
  getCurrentStats(): Partial<SessionStats> {
    const totalScreenshots = this.analysisHistory.length;
    const focusedScreenshots = this.analysisHistory.filter(record => record.result.isOnTask).length;
    const distractedScreenshots = totalScreenshots - focusedScreenshots;
    const focusPercentage = totalScreenshots > 0 ? (focusedScreenshots / totalScreenshots) * 100 : 0;

    return {
      totalScreenshots,
      focusedScreenshots,
      distractedScreenshots,
      focusPercentage
    };
  }
}

// Export a singleton instance
export const sessionAnalyticsService = new SessionAnalyticsService(); 