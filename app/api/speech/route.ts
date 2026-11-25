import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return NextResponse.json({ error: "Server पर ELEVENLABS_API_KEY configure नहीं है।" }, { status: 503 });
  try {
    const { text, voiceId } = await req.json();
    if (typeof text !== "string" || !text.trim() || text.length > 5000) return NextResponse.json({ error: "Text 1 से 5000 characters का होना चाहिए।" }, { status: 400 });
    const allowed = [process.env.ELEVENLABS_MALE_VOICE_ID, process.env.ELEVENLABS_FEMALE_VOICE_ID].filter(Boolean);
    if (!voiceId || !allowed.includes(voiceId)) return NextResponse.json({ error: "यह voice ID configured नहीं है।" }, { status: 400 });
    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.48, similarity_boost: 0.78, style: 0.25, use_speaker_boost: true } })
    });
    if (!upstream.ok) return NextResponse.json({ error: "Voice provider ने request अस्वीकार की। API key, voice ID और account credits जाँचें।" }, { status: upstream.status });
    return new NextResponse(await upstream.arrayBuffer(), { headers: { "Content-Type": "audio/mpeg", "Content-Disposition": 'attachment; filename="shubh-ai-voice.mp3"', "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Request process नहीं हो पाई।" }, { status: 500 }); }
}