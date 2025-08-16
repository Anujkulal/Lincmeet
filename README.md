# LincMeet

LincMeet is a Next.js web application for managing and joining online meetings. It integrates with Stream Video SDK to provide real-time video calls, meeting scheduling, and recording playback.

## Features

- **Upcoming Meetings**: View your next scheduled meeting on the homepage.
- **Meeting Types**: Choose from different meeting types.
- **Meeting List**: See ended, upcoming, and recorded meetings.
- **Join/Start Meetings**: Instantly join or start a meeting.
- **Recordings**: Play back recorded meetings.
- **Responsive UI**: Optimized for desktop and mobile devices.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Stream Video SDK](https://getstream.io/video/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone git@github.com:Anujkulal/Lincmeet.git
   cd Lincmeet
   ```

2. **Install dependencies:**
   ```bash
   npm i
   ```

3. **Set environment variables:**
   - Copy `.env.sample` to `.env` and fill in your Stream API keys and other config.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Folder Structure

- `/src/app` - Next.js app routes and pages
- `/src/components` - Reusable React components
- `/src/hooks` - Custom React hooks
