"use client";

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

export interface TaskAnalysisResult {
  isOnTask: boolean;
  explanation: string;
  confidence: number;
}

export interface AnalysisError {
  error: string;
  code?: string;
}

class AIAnalysisService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.warn("Google AI API key not found. Set NEXT_PUBLIC_GOOGLE_AI_API_KEY environment variable.");
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
    } catch (error) {
      console.error("Failed to initialize Google AI:", error);
    }
  }

  async analyzeScreenshot(
    screenshotBase64: string, 
    taskDescription: string, 
    primaryApps?: string
  ): Promise<TaskAnalysisResult | AnalysisError> {
    if (!this.model) {
      return {
        error: "AI service not initialized. Please check your API key configuration.",
        code: "SERVICE_NOT_INITIALIZED"
      };
    }

    try {
      // Remove the data URL prefix if present
      const base64Data = screenshotBase64.replace(/^data:image\/[a-zA-Z]*;base64,/, '');

      const prompt = this.buildAnalysisPrompt(taskDescription, primaryApps);

      const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        { text: prompt },
      ];

      const response = await this.model.generateContent(contents);
      const result = JSON.parse(response.response.text());

      // Validate the response structure
      if (typeof result.isOnTask !== 'boolean' || 
          typeof result.explanation !== 'string' || 
          typeof result.confidence !== 'number') {
        throw new Error("Invalid response structure from AI model");
      }

      return {
        isOnTask: result.isOnTask,
        explanation: result.explanation,
        confidence: Math.max(0, Math.min(1, result.confidence)) // Clamp between 0 and 1
      };

    } catch (error: unknown) {
      console.error("Error analyzing screenshot:", error);
      const err = error as Error;
      
      if (err.message?.includes('API key')) {
        return {
          error: "Invalid API key. Please check your Google AI API key configuration.",
          code: "INVALID_API_KEY"
        };
      }
      
      if (err.message?.includes('quota')) {
        return {
          error: "API quota exceeded. Please try again later.",
          code: "QUOTA_EXCEEDED"
        };
      }

      return {
        error: `Analysis failed: ${err.message || 'Unknown error'}`,
        code: "ANALYSIS_FAILED"
      };
    }
  }

  private buildAnalysisPrompt(taskDescription: string, primaryApps?: string): string {
    return `You are an AI productivity assistant helping users stay focused on their intended tasks. Your role is to analyze screenshots of a user's screen and determine whether they are currently working on their stated goal.

**USER'S INTENDED TASK:**
"${taskDescription}"

${primaryApps ? `**PRIMARY APPS/TOOLS THEY PLAN TO USE:**
"${primaryApps}"

` : ''}**YOUR ANALYSIS RESPONSIBILITIES:**

1. **Screen Content Analysis**: Examine the screenshot to identify:
   - What applications/websites are visible and active
   - What specific content or activities are shown
   - Any text, documents, code, or other work materials visible

2. **Task Alignment Assessment**: Determine if the current screen content aligns with the user's stated task by considering:
   - Direct relevance: Is the user directly working on their stated goal?
   - Tool appropriateness: Are they using tools/apps that make sense for their task?
   - Content relevance: Does the visible content relate to their intended work?
   - Productive vs. distracting activities: Are they engaged in focused work or potentially distracted?

3. **Context-Aware Analysis**: Consider that:
   - Research, planning, or preparation activities may be relevant to the main task
   - Brief breaks or tool-switching can be normal parts of productive work
   - The user may be in a different phase of their task than initially described
   - Some multi-tasking might be legitimate (e.g., taking notes while reading)

4. **Confidence Assessment**: Evaluate how certain you are about your analysis based on:
   - Clarity of the screenshot
   - Obvious alignment or misalignment with the stated task
   - Ambiguous activities that could go either way

**ANALYSIS GUIDELINES:**
- Be encouraging and understanding - brief diversions don't necessarily mean someone is off-task
- Focus on the primary activity visible in the screenshot
- Consider the bigger picture of whether this activity could reasonably contribute to their goal
- If you're unsure, err on the side of being supportive rather than overly critical
- Keep explanations brief (1-2 sentences) but specific to what you observe

**RESPONSE FORMAT:**
Provide your analysis as a JSON object with:
- isOnTask: true if the user appears to be working on their intended task, false if they seem distracted or off-topic
- explanation: A brief, specific explanation of why you determined they are or aren't on task based on what you see in the screenshot
- confidence: A number between 0.0 and 1.0 indicating how confident you are in your assessment

Analyze the screenshot now and provide your assessment.`;
  }
}

// Export a singleton instance
export const aiAnalysisService = new AIAnalysisService(); 