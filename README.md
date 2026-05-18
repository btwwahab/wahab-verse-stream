# Aziona Stream (AI Verse) — AI‑Powered Streaming Platform

A futuristic, AI-assisted streaming UI that pulls trending movies/series from TMDb and includes a built-in AI chat assistant powered by Groq (OpenAI-compatible chat completions). Deployed as a static site + serverless API endpoints on Vercel.

**Live Demo:** https://wahab-verse-stream.vercel.app

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works (End-to-End)](#how-it-works-end-to-end)
  - [1) Client app (static)](#1-client-app-static)
  - [2) TMDb proxy API](#2-tmdb-proxy-api)
  - [3) AI chat API](#3-ai-chat-api)
  - [4) Deployment routing](#4-deployment-routing)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [`GET /api/tmdb`](#get-apitmdb)
  - [`POST /api/chat`](#post-apichat)
- [Deployment (Vercel)](#deployment-vercel)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)
- [License](#license)
- [Credits](#credits)

---

## Overview

Aziona Stream is an AI-powered “streaming platform” experience: a visually rich front-end that dynamically loads trending content, popular movies, and popular TV series, then lets users explore titles and chat with an AI assistant for recommendations and mood-based suggestions.

This repo is built as:
- **Static front-end** (`index.html`, `style.css`, `main.js`, `data.js`, `ai-assist.js`)
- **Serverless API layer** (`/api/*`) for:
  - TMDb API proxy (keeps your TMDb API key secret)
  - AI chat endpoint (keeps your Groq API key secret)

---

## Key Features

- **Trending / Popular content** loaded dynamically (movies + TV)
- **Genre discovery** and filtering support
- **Movie/TV detail viewing** (modal-based UI)
- **AI Assistant** (chat modal UI) for:
  - recommendations
  - mood-based suggestions
  - film/storytelling insights
- **Serverless proxy** endpoints to protect API keys (TMDb + Groq)
- **Vercel-ready** configuration for static + serverless routing

---

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **UI Libraries:** Bootstrap 5, Font Awesome
- **HTTP Client:** Axios
- **Backend (Serverless):** Node.js serverless functions (Vercel)
- **External APIs:**
  - **TMDb** (The Movie Database)
  - **Groq** chat completions API (OpenAI-compatible endpoint)

---

## Project Structure

```
.
├─ api/
│  ├─ tmdb.js          # Serverless function proxy to TMDb
│  └─ chat.js          # Serverless function to call Groq chat completions
├─ img/                # Images (favicon, UI assets)
├─ index.html          # App shell
├─ style.css           # Styling / theme
├─ main.js             # UI interactions + rendering (cards, modals, effects)
├─ data.js             # Data layer (fetches content via /api/tmdb)
├─ ai-assist.js        # AI assistant UI + client-side chat integration
├─ package.json        # Vercel CLI scripts + dependencies
├─ .env                # Local env vars (do not commit secrets)
└─ verce.json          # Vercel config (builds + routes)
```

> Note: The repository uses `verce.json` as its Vercel configuration file.

---

## How It Works (End-to-End)

### 1) Client app (static)
- `index.html` loads:
  - Bootstrap + Font Awesome
  - `data.js` (content fetching + formatting)
  - `ai-assist.js` (AI modal + chat interactions)
  - `main.js` (UI rendering, animations, modals, watchlist UX, etc.)

The UI includes:
- A search input
- Dynamic category pills / sections (populated via JavaScript)
- A watchlist section
- A “robot” toggle button that opens the AI assistant modal

### 2) TMDb proxy API
The front-end **does not** call TMDb directly. Instead it calls:

- `fetch('/api/tmdb?endpoint=/trending/all/day')`
- `fetch('/api/tmdb?endpoint=/movie/popular')`
- `fetch('/api/tmdb?endpoint=/tv/popular')`
- `fetch('/api/tmdb?endpoint=/genre/movie/list')`
- `fetch('/api/tmdb?endpoint=/genre/tv/list')`
- etc.

The serverless function in `api/tmdb.js`:
- reads `TMDB_API_KEY` from environment variables
- forwards the request to TMDb
- returns the JSON payload back to the browser

This pattern protects your TMDb key from being exposed in client-side code.

### 3) AI chat API
The AI assistant uses a serverless endpoint at `POST /api/chat`.

The serverless function in `api/chat.js`:
- expects a JSON body with:
  - `message` (required)
  - `system` (optional custom system prompt)
- calls Groq’s OpenAI-compatible endpoint:
  - `https://api.groq.com/openai/v1/chat/completions`
- uses:
  - `model: "llama-3.3-70b-versatile"`
  - `max_tokens: 800`
  - `temperature: 0.8`
- authenticates using `GROQ_API_KEY` from environment variables

The response is returned to the client, which renders it inside the chat modal.

### 4) Deployment routing
`verce.json` declares:
- `index.html` as a static build
- `api/*.js` as Node serverless functions
- routing rules:
  - `/api/*` → serverless functions
  - everything else → static files

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (recommended LTS)
- Vercel CLI (installed automatically via devDependencies, but can be installed globally too)

### Install
```bash
npm install
```

### Configure environment variables
Create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

### Run locally (Vercel dev)
```bash
npm run dev
```

This runs:
- the static site
- the serverless functions under `/api/*`

Open the local URL shown in your terminal.

---

## Environment Variables

Create a `.env` file (do not commit secrets):

```bash
TMDB_API_KEY=your_tmdb_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Where to get keys
- **TMDB_API_KEY:** from TMDb developer settings
- **GROQ_API_KEY:** from your Groq account dashboard

---

## API Reference

### `GET /api/tmdb`

Proxy for TMDb endpoints.

**Query Parameters**
- `endpoint` (required): TMDb endpoint path, e.g. `/trending/all/day`

**Example**
```http
GET /api/tmdb?endpoint=/movie/popular
```

**Response**
- Forwards TMDb JSON response.

**Notes**
- The serverless function automatically appends `api_key=...`
- Supports endpoints with existing query strings (it appends `&api_key=...` when needed)

---

### `POST /api/chat`

AI chat endpoint (Groq-backed).

**Body (JSON)**
```json
{
  "message": "Recommend me a sci-fi movie for a thoughtful mood",
  "system": "optional custom system prompt"
}
```

**Response**
- Returns the Groq chat completions payload (OpenAI-style response shape).

**Errors**
- `400` if `message` is missing
- `405` for non-POST methods

---

## Deployment (Vercel)

### Deploy using Vercel CLI
```bash
npm run deploy
```

### Vercel Environment Variables
In your Vercel project settings, add:
- `TMDB_API_KEY`
- `GROQ_API_KEY`

Then redeploy.

---

## Security Notes

- **Do not commit `.env`** with real API keys.
- TMDb and Groq keys are kept server-side via Vercel serverless functions.
- CORS in the serverless functions is permissive (`Access-Control-Allow-Origin: *`). If you want to restrict usage, limit allowed origins.

---

## Troubleshooting

### 1) TMDb content not loading
- Ensure `TMDB_API_KEY` is set locally (`.env`) and on Vercel
- Check the Network tab:
  - `/api/tmdb?...` should return `200`
- If you see `401` or an error message from TMDb, your key may be invalid/restricted.

### 2) AI assistant not responding
- Ensure `GROQ_API_KEY` is set locally and on Vercel
- Check serverless logs on Vercel for `/api/chat`
- Confirm request body includes `message`

### 3) Running without Vercel dev
If you open `index.html` directly (file://), serverless routes won’t work.
Use:
```bash
npm run dev
```

---

## Roadmap Ideas

- User accounts + persistent watchlist
- Better search (server-side query to TMDb via `/api/tmdb`)
- “Continue watching” section
- Rate/like content and personalize recommendations
- Safer CORS + rate limiting on `/api/chat`
- Add tests + linting workflow

---

## License

No license is currently specified in this repository.  
If you want, add an MIT license (or your preferred license) and update this section.

---

## Credits

- Built by **btwwahab**
- UI powered by **Bootstrap** and **Font Awesome**
- Movie/TV metadata by **TMDb**
- AI assistant powered by **Groq** (OpenAI-compatible chat completions)
