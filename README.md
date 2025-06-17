# FocusAI - AI-Powered Focus Assistant

A real-time focus assistant that helps users stay on task using AI-powered screen analysis. Set your goal, start working, and let AI monitor your progress every 30 seconds with gentle feedback when you drift off task.

## Features

- **Smart Session Setup**: Define your task, duration, and primary tools
- **Real-time Screen Monitoring**: Captures screenshots every 30 seconds
- **AI-Powered Analysis**: Uses Google's Gemini AI to determine if you're on task
- **Privacy-First**: No screenshots stored or transmitted beyond analysis
- **Gentle Feedback**: Encouraging guidance to keep you focused
- **Timer & Progress Tracking**: Visual session management

## Prerequisites

- Node.js 18+ 
- A Google AI API key (free tier available)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AI Analysis (Required)

1. Get a Google AI API key:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. Create a `.env.local` file in the project root:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

**Note**: Without the API key, screen capture will work but AI analysis will show an error message.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## How to Use

1. **Start a Session**: Click "Start Focus Session" on the homepage
2. **Set Your Goal**: Describe what you want to work on (e.g., "Writing a blog post")
3. **Configure Duration**: Choose your session length (15 min to 2 hours)
4. **Add Apps** (Optional): List primary tools you'll use
5. **Begin Working**: Grant screen sharing permission and start your session
6. **Stay Focused**: AI will analyze your screen every 30 seconds and provide feedback

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

**Note**: Screen sharing requires HTTPS in production or localhost for development.

## Privacy & Security

- Screenshots are analyzed in real-time and never stored
- No personal data is transmitted beyond the AI analysis
- Screen sharing can be stopped at any time
- API calls are made client-side (your API key stays in your browser)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **AI**: Google Gemini 2.0 Flash
- **APIs**: Browser Screen Capture API

## Development

Built with modern web technologies for a seamless focus experience:

- Real-time screen capture using `getDisplayMedia()`
- Structured AI responses with JSON schema validation  
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript

## Troubleshooting

### Screen Sharing Not Working
- Ensure you're on HTTPS or localhost
- Check browser permissions for screen sharing
- Try refreshing and granting permission again

### AI Analysis Errors
- Verify your API key is correct in `.env.local`
- Check your Google AI API quota/limits
- Ensure stable internet connection

### Performance Issues
- Close unnecessary browser tabs
- Check system resources (screen capture can be intensive)
- Restart the browser if needed

## Contributing

This project is part of an AI productivity tool exploration. Feel free to suggest improvements or report issues.

## License

MIT License - feel free to use this for personal or commercial projects.
