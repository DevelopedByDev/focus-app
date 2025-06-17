"use client";

import { useState, useCallback } from "react";
import { aiAnalysisService, TaskAnalysisResult, AnalysisError } from "@/services/aiAnalysis";

export interface AIAnalysisHook {
  analysisResult: TaskAnalysisResult | null;
  analysisError: AnalysisError | null;
  isAnalyzing: boolean;
  analyzeScreenshot: (screenshot: string, taskDescription: string, primaryApps?: string) => Promise<void>;
  clearAnalysis: () => void;
}

export function useAIAnalysis(): AIAnalysisHook {
  const [analysisResult, setAnalysisResult] = useState<TaskAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<AnalysisError | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeScreenshot = useCallback(async (
    screenshot: string, 
    taskDescription: string, 
    primaryApps?: string
  ) => {
    if (!screenshot || !taskDescription) {
      console.warn("Missing screenshot or task description for analysis");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      console.log("Starting AI analysis...");
      const result = await aiAnalysisService.analyzeScreenshot(
        screenshot, 
        taskDescription, 
        primaryApps
      );

      if ('error' in result) {
        setAnalysisError(result);
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
        setAnalysisError(null);
        console.log("AI Analysis completed:", result);
      }
    } catch (error: unknown) {
      console.error("AI Analysis failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error during analysis";
      setAnalysisError({
        error: errorMessage,
        code: "ANALYSIS_EXCEPTION"
      });
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    analysisResult,
    analysisError,
    isAnalyzing,
    analyzeScreenshot,
    clearAnalysis,
  };
} 