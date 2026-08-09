# Mnemonic AI

A modern semantic search engine for your bookmarks, powered by vector embeddings and intelligent AI-driven search.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-blue)](https://ai.google.dev/)

## Features

- **Semantic Search**: Search bookmarks using vector embeddings for intelligent, context-aware results
- **Modern UI**: Clean, minimal interface built with NextUI and Tailwind CSS
- **Authentication**: Secure user sessions with NextAuth
- **Dark Mode**: Seamless theme switching with next-themes
- **Type-Safe**: Full TypeScript coverage across the codebase

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + NextUI
- **Database**: Supabase PostgreSQL with Prisma ORM & pgvector
- **AI & Embeddings**: Google Gemini (`text-embedding-004`)
- **Auth**: NextAuth.js
- **Linting**: ESLint with Next.js config

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase PostgreSQL database with `pgvector` enabled
- Google Gemini API Key
- npm or your preferred package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mnemonic-ai.git
   cd mnemonic-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase `DATABASE_URL` (pooler), `DIRECT_URL` (direct connection), `GEMINI_API_KEY`, and `NEXTAUTH_SECRET`.

4. Push schema migrations to your Supabase database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the app.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (runs Prisma generate + Next.js build) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |

## Project Structure

```
mnemonic-ai/
├── app/                  # Next.js App Router
│   ├── api/             # API routes (bookmarks, search, auth)
│   ├── auth/            # Authentication pages
│   └── search/          # Search page
├── lib/                 # Core utilities (embeddings, auth, prisma)
├── prisma/              # Database schema and config
├── supabase/            # Supabase SQL migrations and RLS policies
├── proxy.ts             # Middleware configuration
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request