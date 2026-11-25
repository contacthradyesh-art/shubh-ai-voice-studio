import { NextResponse } from "next/server";

export async function GET() {
  const voices = [
    { id: process.env.ELEVENLABS_MALE_VOICE_ID || "", name: "My Male Voice", gender: "male" },
    { id: process.env.ELEVENLABS_FEMALE_VOICE_ID || "", name: "My Female Voice", gender: "female" }
  ].filter(v => v.id);
  return NextResponse.json({ voices });
}