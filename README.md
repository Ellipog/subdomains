# Aaenz Web Portal

A modern web portal built with Next.js that displays and manages subdomains of aaenz.no. The portal features a beautiful, responsive UI with real-time subdomain status checking and title fetching.

## Features

- 📌 Pinned sites management
- 🔍 Automatic subdomain discovery
- 🎯 Real-time status checking
- 📱 Responsive design for all devices
- 🎨 Modern UI with animations
- 🌙 Dark mode support
- 🔒 Secure iframe handling

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Cheerio

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/aaenz.git
cd aaenz
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Development

- `bun dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Run ESLint

## Project Structure

```
aaenz/
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── page.tsx       # Main page component
│   └── layout.tsx     # Root layout
├── hooks/             # Custom React hooks
├── static/            # Static data (pins)
└── public/            # Public assets
```

## API Endpoints

- `/api/subdomains` - Fetches all subdomains
- `/api/get-title` - Retrieves site titles
- `/api/check-status` - Checks site availability

---

<div align="center">
by Elliot
</div>
