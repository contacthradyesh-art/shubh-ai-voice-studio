import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return NextResponse.json({ error: "Server पर ELEVENLABS_API_KEY configure नहीं है।" }, { status: 503 });
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const audio = form.get("audio");
    const consent = form.get("consent");
    if (consent !== "true") return NextResponse.json({ error: "Voice cloning के लिए consent confirmation जरूरी है।" }, { status: 403 });
    if (!name || name.length > 80 || !(audio instanceof File)) return NextResponse.json({ error: "Voice name और audio file जरूरी हैं।" }, { status: 400 });
    if (!audio.type.startsWith("audio/") || audio.size > 20 * 1024 * 1024) return NextResponse.json({ error: "कृपया 20 MB से छोटी valid audio file चुनें।" }, { status: 400 });
    const payload = new FormData();
    payload.append("name", name);
    payload.append("files", audio, audio.name || "voice-sample");
    payload.append("description", "User-provided voice sample with consent for personal use.");
    const upstream = await fetch("https://api.elevenlabs.io/v1/voices/add", { method: "POST", headers: { "xi-api-key": key }, body: payload });
    const data = await upstream.json();
    if (!upstream.ok) return NextResponse.json({ error: data.detail?.message || "Provider voice cloning request failed. Check account access and sample quality." }, { status: upstream.status });
    return NextResponse.json({ voice_id: data.voice_id });
  } catch { return NextResponse.json({ error: "Voice clone request process नहीं हो पाई।" }, { status: 500 }); }
}