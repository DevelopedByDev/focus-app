This app is a real-time focus assistant that helps users stay on task using AI. Before beginning a work session, the user declares their intended task—for example, “Writing a blog post in Notion” or “Studying for my physics exam.” Once the session starts, the app securely captures a screenshot of the user’s screen every 30 seconds using browser screen capture APIs (with user permission). Each screenshot is instantly analyzed by a vision-language model such as OpenAI’s GPT-4 Vision or Google’s Gemini to determine whether the current screen content aligns with the user’s stated task.

Based on the model’s judgment, the app provides live feedback via a floating overlay that appears for a few seconds after each analysis. If the user is on task, the overlay shows a green confirmation; if the model detects a mismatch, the overlay alerts the user that they may be distracted. Importantly, no screenshots or personal data are ever stored or transmitted beyond inference—privacy is a core principle of this tool.

The goal is to gently nudge users back to focus without being intrusive, making it ideal for deep work sessions, studying, or productivity sprints. This minimalist app acts like an AI-powered accountability buddy in real time.

So far, only the landing page UI has been implemented. 

Next, I want to work on enabling the screen recording. So when the "Start Focus Session" button is clicked, a popup should appear asking the user what they want to work on, duration of work, what apps they would primarily use, 