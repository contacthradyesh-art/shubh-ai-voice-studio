import os
import tempfile
import gradio as gr
import numpy as np
import soundfile as sf
from transformers import AutoModel

MODEL_ID = "ai4bharat/IndicF5"
_model = None

def load_model():
    global _model
    if _model is None:
        _model = AutoModel.from_pretrained(MODEL_ID, trust_remote_code=True)
    return _model

def generate_hindi(text, gender, reference_audio, reference_text):
    if not text or not text.strip():
        raise gr.Error("कृपया हिंदी टेक्स्ट लिखें।")
    if len(text) > 1500:
        raise gr.Error("अभी एक बार में 1500 characters तक लिखें।")
    if not reference_audio:
        raise gr.Error("अपनी चुनी हुई voice (male/female) की साफ़ recording upload करें।")
    if not reference_text or not reference_text.strip():
        raise gr.Error("Recording में बोले गए exact शब्द लिखें।")
    try:
        model = load_model()
        audio = model(text.strip(), ref_audio_path=reference_audio, ref_text=reference_text.strip())
        audio = np.asarray(audio, dtype=np.float32)
        if audio.ndim > 1:
            audio = np.squeeze(audio)
        fd, output_path = tempfile.mkstemp(suffix=".wav", prefix="shubh_voice_")
        os.close(fd)
        sf.write(output_path, audio, samplerate=24000)
        return output_path, f"आपकी {gender} voice में audio तैयार है।"
    except Exception as exc:
        raise gr.Error(f"Generation failed: {exc}")

with gr.Blocks(title="Shubh AI Voice Studio", theme=gr.themes.Soft(primary_hue="violet")) as demo:
    gr.Markdown("# ✦ Shubh AI Voice Studio\n### Free local Hindi AI voice generation · No paid API key")
    gr.Markdown("यह मॉडल आपके दिए हुए reference sample की आवाज़/बोलने के अंदाज़ से speech बनाता है। Male और Female के लिए अलग-अलग अपनी अनुमति वाली recordings चुनें।")
    with gr.Row():
        with gr.Column():
            text = gr.Textbox(label="हिंदी में क्या बुलवाना है?", lines=5, value="नमस्ते! यह मेरी अपनी AI voice है। Shubh AI Voice Studio में आपका स्वागत है।", max_lines=10)
            gender = gr.Radio(["Male", "Female"], value="Male", label="Voice profile")
            ref_audio = gr.Audio(label="अपनी voice की साफ़ recording upload करें", type="filepath")
            ref_text = gr.Textbox(label="Recording में बोले गए exact शब्द (जैसे के तैसे)", lines=2, placeholder="यहाँ recording का transcript लिखें")
            run = gr.Button("✦ Generate Hindi Voice", variant="primary")
        with gr.Column():
            output = gr.Audio(label="Generated audio", type="filepath")
            status = gr.Textbox(label="Status", interactive=False)
            gr.Markdown("**अच्छे परिणाम के लिए:** शांत जगह में 10–20 सेकंड की साफ़ recording दें। Transcript बिल्कुल सही रखें।")
    run.click(generate_hindi, inputs=[text, gender, ref_audio, ref_text], outputs=[output, status])

if __name__ == "__main__":
    demo.queue().launch(server_name="127.0.0.1", server_port=7860, inbrowser=True)
