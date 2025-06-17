"use client";

import Groq from 'groq-sdk';

export interface TTSOptions {
  voice?: string;
  model?: string;
  responseFormat?: string;
}

class TTSService {
  private groq: Groq | null = null;

  constructor() {
    this.initializeGroq();
  }

  private initializeGroq() {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    
    if (!apiKey) {
      console.warn("Groq API key not found. Set NEXT_PUBLIC_GROQ_API_KEY environment variable.");
      return;
    }

    try {
      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
    } catch (error) {
      console.error("Failed to initialize Groq:", error);
    }
  }

  async synthesizeSpeech(
    text: string, 
    options: TTSOptions = {}
  ): Promise<ArrayBuffer | null> {
    if (!this.groq) {
      console.error("Groq service not initialized. Please check your API key configuration.");
      return null;
    }

    const {
      voice = "Fritz-PlayAI",
      model = "playai-tts",
      responseFormat = "wav"
    } = options;

    try {
      const response = await this.groq.audio.speech.create({
        model: model,
        voice: voice,
        input: text,
        response_format: responseFormat
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error("Error synthesizing speech:", error);
      return null;
    }
  }

  async playAudio(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(audioBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioData;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  async speakText(text: string, options: TTSOptions = {}): Promise<void> {
    const audioBuffer = await this.synthesizeSpeech(text, options);
    if (audioBuffer) {
      await this.playAudio(audioBuffer);
    }
  }

  // Pre-defined nudge messages for when user is distracted
  getRandomNudgeMessage(): string {
    const nudgeMessages = [
      "Hey! I noticed you might be getting distracted. Would you like to refocus on your current task?",
      "It looks like you've wandered off track. Can I help you get back to what you were working on?",
      "Time to refocus! Your productivity session is still active. Do you need any assistance?",
      "I see you might be taking a break from your task. Ready to get back on track?",
      "Gentle reminder: you're in a focus session. Would you like me to help you stay motivated?",
      "Let's get back to work! I'm here if you need any help staying focused.",
      "Your attention seems to have drifted. How can I help you get back to your goal?",
      "Focus check! Your session is still running. Need any support to stay on task?"
    ];

    return nudgeMessages[Math.floor(Math.random() * nudgeMessages.length)];
  }

  async nudgeUser(customMessage?: string): Promise<void> {
    const message = customMessage || this.getRandomNudgeMessage();
    await this.speakText(message);
  }
}

// Export a singleton instance
export const ttsService = new TTSService(); 