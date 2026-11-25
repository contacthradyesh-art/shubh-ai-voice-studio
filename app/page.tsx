"use client";

import { useEffect, useRef, useState } from "react";

type Voice = { id: string; name: string; gender: "male" | "female" };

export default function Home() {
  const [text, setText] = useState("नमस्ते! Shubh AI Voice Studio में आपका स्वागत है। आज हम एक नई शुरुआत कर रहे हैं।");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [voiceId, setVoiceId] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [cloneName, setCloneName] = useState("");
  const [consent, setConsent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/voices").then(r => r.json()).then(d => setVoices(d.voices ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    const selected = voices.find(v => v.gender === gender);
    setVoiceId(selected?.id ?? "");
  }, [gender, voices]);

  async function generate() {
    if (!text.trim()) return setMessage("पहले कुछ टेक्स्ट लिखें।");
    if (!voiceId) return setMessage("इस voice के लिए ElevenLabs Voice ID सेट करें। README देखें।");
    setBusy(true); setMessage("आपकी आवाज़ तैयार हो रही है…");
    try {
      const res = await fetch("/api/speech", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voiceId }) });
      if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.error || "Audio generate नहीं हो पाया।"); }
      const blob = await res.blob();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      const url = URL.createObjectURL(blob); setAudioUrl(url); setMessage("आपका audio तैयार है। सुनें या डाउनलोड करें।");
    } catch (e) { setMessage(e instanceof Error ? e.message : "कुछ गलत हुआ।"); }
    finally { setBusy(false); }
  }

  async function cloneVoice() {
    const file = fileRef.current?.files?.[0];
    if (!file) return setMessage("अपनी voice recording चुनें।");
    if (!cloneName.trim()) return setMessage("Voice का नाम लिखें।");
    if (!consent) return setMessage("कृपया पुष्टि करें कि recording आपकी है या आपके पास स्पष्ट अनुमति है।");
    const form = new FormData(); form.append("name", cloneName); form.append("audio", file); form.append("consent", "true");
    setBusy(true); setMessage("Voice sample सुरक्षित तरीके से provider को भेजा जा रहा है…");
    try {
      const res = await fetch("/api/clone", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voice clone नहीं बन पाया।");
      setMessage(`Voice clone बन गया! ID: ${data.voice_id}. इसे अपने hosting environment में ELEVENLABS_MALE_VOICE_ID या ELEVENLABS_FEMALE_VOICE_ID में सेट करें।`);
    } catch (e) { setMessage(e instanceof Error ? e.message : "कुछ गलत हुआ।"); }
    finally { setBusy(false); }
  }

  return <main className="shell">
    <header className="topbar"><a className="brand" href="#"><span className="brandIcon">✦</span> SHUBH <b>VOICE STUDIO</b></a><span className="privateTag"><i/> PERSONAL STUDIO</span></header>
    <section className="hero"><div className="eyebrow"><span/> YOUR PERSONAL AI VOICE LAB</div><h1>अपनी बात को <em>आवाज़</em> दो।</h1><p>Natural Hindi AI voices बनाएं, सुनें और अपनी audio library में रखें।</p></section>
    <section className="workspace">
      <div className="panel composer">
        <div className="panelHead"><div><small>01 / CREATE AUDIO</small><h2>Text to Speech</h2></div><span className="live">● READY</span></div>
        <label className="fieldLabel" htmlFor="script">अपना हिंदी टेक्स्ट लिखें</label>
        <textarea id="script" value={text} onChange={e => setText(e.target.value)} maxLength={5000} placeholder="यहाँ अपना टेक्स्ट लिखें…"/>
        <div className="underText"><span>देवनागरी हिंदी सबसे बेहतर काम करती है</span><span>{text.length}/5000</span></div>
        <div className="fieldLabel voiceLabel">अपनी आवाज़ चुनें</div>
        <div className="voiceChoices">
          <button className={gender === "male" ? "voiceCard selected" : "voiceCard"} onClick={() => setGender("male")}><span className="avatar blue">♂</span><span><b>पुरुष आवाज़</b><small>गहरी और स्पष्ट</small></span><span className="radio">{gender === "male" ? "✓" : ""}</span></button>
          <button className={gender === "female" ? "voiceCard selected" : "voiceCard"} onClick={() => setGender("female")}><span className="avatar pink">♀</span><span><b>महिला आवाज़</b><small>नरम और स्वाभाविक</small></span><span className="radio">{gender === "female" ? "✓" : ""}</span></button>
        </div>
        {voices.length > 0 && <><label className="fieldLabel" htmlFor="voice">Voice profile</label><select id="voice" value={voiceId} onChange={e => setVoiceId(e.target.value)}>{voices.filter(v => v.gender === gender).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></>}
        <button className="generate" disabled={busy} onClick={generate}><span>✦</span> {busy ? "आवाज़ बन रही है…" : "Generate Natural Voice"} <b>→</b></button>
        <p className="micro">Powered by your configured voice provider · API key stays server-side</p>
        {message && <div className="notice" role="status">{message}</div>}
        {audioUrl && <div className="audioResult"><div className="resultTitle">✦ GENERATED AUDIO</div><audio controls src={audioUrl}/><a className="download" href={audioUrl} download="shubh-ai-voice.mp3">↓ Download MP3</a></div>}
      </div>
      <aside className="side">
        <div className="panel quality"><small>VOICE ENGINE</small><div className="wave">▂▅▃▇▅▂▆▃▅▇▂▅▃▆▂▇▅▃</div><h3>Ultra Natural AI</h3><p>High-quality Hindi speech generation through ElevenLabs.</p><div className="qualityLine"><span>Language</span><b>Hindi</b></div><div className="qualityLine"><span>Output</span><b>MP3 Audio</b></div><div className="qualityLine"><span>Voices</span><b>Male + Female</b></div></div>
        <div className="panel clone">
          <div className="cloneIcon">◉</div><small>02 / PERSONAL VOICE</small><h2>अपनी Voice Clone करें</h2><p>अपनी साफ़ recording upload करें। केवल अपनी आवाज़ या स्पष्ट अनुमति वाली आवाज़ का उपयोग करें।</p>
          <label className="fieldLabel" htmlFor="cloneName">Voice का नाम</label><input id="cloneName" value={cloneName} onChange={e => setCloneName(e.target.value)} placeholder="जैसे: Shubh Hindi Voice"/>
          <label className="upload"><input ref={fileRef} type="file" accept="audio/*" /><span>＋</span><b>Audio recording चुनें</b><small>MP3, WAV, M4A · साफ़ recording बेहतर</small></label>
          <label className="consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/><span>मैं पुष्टि करता/करती हूँ कि यह मेरी आवाज़ है या मेरे पास इसे clone करने की स्पष्ट अनुमति है।</span></label>
          <button className="cloneButton" disabled={busy} onClick={cloneVoice}>Create My Voice Clone →</button>
        </div>
      </aside>
    </section>
    <footer><span>SHUBH VOICE STUDIO</span><span>Private by design · Use only voices you have rights to</span></footer>
  </main>;
}