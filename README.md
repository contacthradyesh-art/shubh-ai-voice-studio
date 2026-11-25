# Shubh AI Voice Studio

A personal Hindi text-to-speech and consent-based voice-cloning web app built with Next.js. The UI supports male/female voice profiles, natural speech generation, audio preview, and MP3 download.

## Requirements

- Node.js 20+
- An ElevenLabs account/API key with access to multilingual TTS and Instant Voice Cloning
- Your own voice sample, or a sample you have explicit permission to clone

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Configure voices

Set these values in `.env.local` (or your hosting provider's server-side environment variables):

- `ELEVENLABS_API_KEY`: your secret API key
- `ELEVENLABS_MALE_VOICE_ID`: voice ID for your authorized male voice
- `ELEVENLABS_FEMALE_VOICE_ID`: voice ID for your authorized female voice

The API key must never be prefixed with `NEXT_PUBLIC_` and must never be committed to GitHub.

To create a personal clone, upload a clear recording in the Voice Clone section and confirm that it is your voice or you have explicit permission. The server sends it to ElevenLabs' voice-add endpoint. The returned voice ID is shown once in the UI. Add that ID to the appropriate server environment variable, then redeploy/restart. Voice cloning availability, sample limits, and charges depend on your ElevenLabs plan and current terms.

## Deploy

Import this repository into Vercel, add the three environment variables in Project Settings → Environment Variables, then deploy. Keep secrets server-side only.

## API routes

- `POST /api/speech`: generates MP3 audio using a configured voice ID. Only configured male/female IDs are accepted.
- `POST /api/clone`: accepts an audio sample and requires explicit consent confirmation.
- `GET /api/voices`: returns configured voice profiles (IDs are not secret, but API keys are).

## Privacy and safety

Voice samples are transmitted to the configured voice provider for cloning; review that provider's privacy/retention terms before uploading. Use only voices you own or are explicitly authorized to clone. This starter app does not store uploaded samples in its own database. Add authentication and rate limiting before exposing a public deployment.
