# EphemeralChat 💬

A privacy-first, real-time temporary chat app where chats disappear when everyone leaves.

## Features

- 🚀 Real-time messaging with Socket.IO
- 🔒 No data persistence - messages live only in memory
- 💨 Quick room creation with shareable links
- 📱 Responsive design with TailwindCSS
- 🎨 Clean, modern WhatsApp-like UI
- 🔄 Automatic room cleanup when empty

## Tech Stack

- **Frontend**: React.js + Vite + TailwindCSS
- **Backend**: Node.js + Express.js + Socket.IO
- **Storage**: In-memory only (no database)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone and setup**:
   ```bash
   git clone https://github.com/hayjayworld/ephemeral-chat
   cd ephemeral-chat
   ```

### Backend URL configuration

The frontend uses `http://localhost:3001` during development and the deployed
Render backend (`https://ephemeral-chat-f89j.onrender.com`) in production.
Set `VITE_BACKEND_URL` in the frontend build environment to override this URL
(for example, in Vercel project settings), then redeploy the frontend.

The backend's `FRONTEND_URL` environment variable must be set to the frontend
origin (for example, `https://ephemeral-chat-mauve.vercel.app`) for CORS and
generated room links to work.