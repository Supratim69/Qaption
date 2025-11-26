# Qaption

A professional video captioning platform with automatic transcription using AssemblyAI and video rendering with Remotion. Features a sleek, dark cinematic interface designed for long editing sessions. Supports Hinglish (Hindi + English) text rendering.

## 🚀 Live Demo

**Hosted URL:** [Your deployment URL here]

## ✨ Features

-   **Video Upload**: Upload MP4 videos up to 100MB
-   **Auto-Captioning**: Automatic speech-to-text using AssemblyAI API
-   **Hinglish Support**: Proper rendering of mixed Hindi (Devanagari) and English text
-   **3 Caption Styles**:
    -   Bottom Centered (Standard subtitles)
    -   Top Bar (News-style)
    -   Karaoke (Word-by-word highlighting)
-   **Real-time Preview**: Live preview using Remotion Player
-   **Caption Editor**: Edit caption text and timing
-   **Export Ready**: Instructions for rendering final video

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
-   **Video Rendering**: Remotion 4.0
-   **Speech-to-Text**: AssemblyAI API
-   **Fonts**: Inter + Noto Sans Devanagari (for Hinglish)
-   **UI Theme**: Dark cinematic interface ("The Studio" theme)
-   **Deployment**: Vercel / Platform-agnostic

## 📋 Prerequisites

-   Node.js 20.x or higher
-   npm or yarn
-   AssemblyAI API key (free tier available at https://www.assemblyai.com/)

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd remotion-captioning-platform
```

> **Note**: The platform has been renamed to "Qaption" with a professional dark theme interface.

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# AssemblyAI API Key (Required)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Base URL for production (Optional - auto-detected in dev)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Getting AssemblyAI API Key:**

1. Sign up at https://www.assemblyai.com/
2. Navigate to your dashboard
3. Copy your API key
4. Paste it in `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### 1. Upload a Video

-   Click the upload area or drag and drop an MP4 file
-   Maximum file size: 100MB
-   Supported formats: MP4, MOV, AVI

### 2. Generate Captions

-   Click "Generate Captions" button
-   AssemblyAI will transcribe the audio
-   Captions will appear with timestamps

### 3. Choose Caption Style

-   Select from 3 preset styles:
    -   **Bottom Centered**: Classic subtitle style
    -   **Top Bar**: News-style captions
    -   **Karaoke**: Highlighted words

### 4. Edit Captions (Optional)

-   Modify caption text
-   Adjust start/end times
-   Delete unwanted captions

### 5. Preview

-   Real-time preview with Remotion Player
-   See exactly how captions will appear

### 6. Export Video

#### Option A: Using Remotion CLI (Recommended)

```bash
# Install Remotion CLI globally
npm install -g @remotion/cli

# Render the video
npx remotion render remotion/Root.tsx VideoWithCaptions output.mp4 \
  --props='{"videoUrl":"/uploads/your-video.mp4","captions":[...],"style":"bottom-centered"}'
```

#### Option B: Using Remotion Studio (GUI)

```bash
npx remotion studio
```

This opens a GUI where you can:

-   Preview compositions
-   Adjust settings
-   Render videos with a button click

## 🎨 Caption Styles Explained

### Bottom Centered

-   Standard subtitle format
-   Black background with white text
-   Positioned at bottom center
-   Best for: General use, movies, tutorials

### Top Bar

-   Full-width bar at the top
-   News broadcast style
-   Black background with white text
-   Best for: News, announcements, formal content

### Karaoke

-   Words highlight as they're spoken
-   Golden yellow highlight color
-   Bottom centered position
-   Best for: Music videos, sing-alongs, engaging content

## 🎨 UI Design

Qaption features a **dark cinematic interface** inspired by professional video editing software (Adobe Premiere, DaVinci Resolve):

-   **Dark Theme**: `#1E1E1E` background reduces eye strain during long editing sessions
-   **Electric Blue Accents**: `#3B82F6` for primary actions and highlights
-   **Off-white Text**: `#F3F4F6` prevents glare while maintaining readability
-   **Custom Scrollbars**: Styled to match the dark theme
-   **Professional Typography**: Inter font for clean, modern text

## 🌐 Hinglish Support

The platform properly renders mixed Hindi and English text using:

-   **Inter**: For English characters
-   **Noto Sans Devanagari**: For Hindi (Devanagari script)

Example supported text:

-   "Hello दोस्तों, welcome to my channel"
-   "यह video बहुत interesting है"
-   "Let's start करते हैं"

## 🚀 Deployment

### Environment Variables Required

-   `ASSEMBLYAI_API_KEY` - Your AssemblyAI API key
-   `NEXT_PUBLIC_BASE_URL` - Your deployment URL (optional in dev)

### Deploy to Any Platform

The app is platform-agnostic and can be deployed to:

-   **Vercel**: `vercel --prod`
-   **Netlify**: Use Next.js plugin
-   **Render**: Use Node.js environment
-   **Railway**: Docker or Node.js
-   **AWS/GCP/Azure**: Standard Next.js deployment

> **Note**: `vercel.json` has been removed - the app is no longer Vercel-specific.

## 📁 Project Structure

```
remotion-captioning-platform/
├── app/
│   ├── api/
│   │   ├── upload/route.ts       # Video upload endpoint
│   │   └── transcribe/route.ts   # Transcription endpoint
│   ├── globals.css               # Global styles + dark theme
│   ├── layout.tsx                # Root layout (Qaption branding)
│   └── page.tsx                  # Main page
├── components/
│   ├── VideoUploader.tsx         # Upload component
│   ├── StyleSelector.tsx         # Style picker
│   ├── CaptionEditor.tsx         # Caption editor
│   ├── VideoPreview.tsx          # Preview player
│   └── DownloadButton.tsx        # Export controls
├── lib/
│   ├── types.ts                  # TypeScript types
│   ├── assemblyai.ts             # AssemblyAI integration
│   ├── s3.ts                     # AWS S3 utilities (optional)
│   └── utils.ts                  # Utility functions
├── remotion/
│   ├── CaptionStyles/
│   │   ├── BottomCentered.tsx    # Bottom style
│   │   ├── TopBar.tsx            # Top bar style
│   │   └── Karaoke.tsx           # Karaoke style
│   ├── Composition.tsx           # Main video composition
│   └── Root.tsx                  # Remotion root
├── public/
│   ├── uploads/                  # Uploaded videos
│   └── outputs/                  # Rendered videos
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS for Tailwind
├── remotion.config.ts            # Remotion settings
├── tsconfig.json                 # TypeScript config
└── package.json
```

**Removed Files** (cleaned up):

-   `test-env.js` - Development testing script
-   `vercel.json` - Platform-specific config
-   `.env.local.example` - Example file

## 🔍 Caption Generation Method

**Service Used**: AssemblyAI API

**How it works**:

1. Video is uploaded to the server
2. Video URL is sent to AssemblyAI
3. AssemblyAI transcribes audio with word-level timestamps
4. Words are grouped into captions (max 5 seconds or 10 words each)
5. Captions are returned with start/end times and text

**Why AssemblyAI**:

-   Free tier available (5 hours/month)
-   High accuracy for English and Hinglish
-   Word-level timestamps for precise sync
-   Fast processing time
-   Simple API integration

## 🐛 Troubleshooting

### "Transcription failed" error

-   Check your AssemblyAI API key in `.env.local`
-   Ensure video URL is publicly accessible
-   Check AssemblyAI dashboard for quota limits

### Preview not loading

-   Ensure video file is in `/public/uploads`
-   Check browser console for errors
-   Try refreshing the page

### Fonts not rendering correctly

-   Clear browser cache
-   Check that Google Fonts are loading
-   Verify internet connection

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

## 🎯 Recent Updates

-   **Rebranded to Qaption**: Professional platform naming
-   **Dark Cinematic UI**: "The Studio" theme for reduced eye strain
-   **Custom Scrollbars**: Themed to match dark interface
-   **Electric Blue Accents**: Modern, professional color scheme
-   **Cleaned Up Codebase**: Removed unnecessary development files

---

Built with ❤️ using Next.js, Remotion, and AssemblyAI | **Qaption** - Professional Video Captioning Platform
