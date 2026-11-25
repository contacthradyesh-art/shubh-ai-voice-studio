# Shubh AI Voice Studio

Personal Hindi AI voice studio with a **free local mode**. The free mode uses AI4Bharat IndicF5 on your own computer: no ElevenLabs subscription, no API key, no per-character billing, and reference audio stays on your machine.

## Free local mode (recommended for no recurring cost)

This runs on your own Windows computer. It is not hosted on Vercel. It uses the open-source [AI4Bharat IndicF5](https://github.com/AI4Bharat/IndicF5) model, which supports Hindi and reference-audio voice cloning. Model weights download the first time and can take several GB of disk space. The model repository is gated: sign in to Hugging Face and accept its access conditions first.

### Windows setup

1. Install 64-bit Python 3.10.
2. Download this repository.
3. Double-click `START_FREE_WINDOWS.bat` to create a virtual environment and install CPU PyTorch, IndicF5 and Gradio.
4. Visit https://huggingface.co/ai4bharat/IndicF5, sign in, and accept the model conditions.
5. In the project terminal, activate the environment and run `hf auth login` (paste a Hugging Face read token).
6. Double-click `RUN_FREE_WINDOWS.bat`.
7. Open http://127.0.0.1:7860 if it does not open automatically.

The first model download can be large and take time. CPU generation can be slow. A computer with 8 GB RAM may run out of memory; 16 GB+ RAM and a supported GPU are preferable. This local setup is free but uses your computer's electricity, storage and processing power.

### Voice setup

Choose Male or Female and upload a clear sample of that voice, then type the exact words spoken in that sample. IndicF5 uses the reference sample to guide the generated voice; it does not create two built-in studio voices. For both profiles, keep separate recordings that you own or have explicit permission to use. A clean 10–20 second clip with matching transcript is a useful starting point.

### Cloud option

Vercel's free tier is not suitable for hosting this large speech model for inference. Free hosted GPU notebooks/spaces may have changing usage limits, queues, sleep timeouts, or availability; do not assume unlimited free cloud generation.

## Existing online/API mode

The original Next.js app and ElevenLabs API routes remain in the repository. They require an API key and may incur provider charges. **For a no-payment setup, use the local Gradio app above**, not the original ElevenLabs API route.

## Privacy and consent

Local mode processes the reference recording on your computer. Only clone your own voice or a voice for which you have explicit permission. AI4Bharat also states that unauthorized voice cloning is prohibited. Review model terms before use.

## Files

- `local_app.py`: local Hindi speech generation UI
- `START_FREE_WINDOWS.bat`: one-time setup
- `RUN_FREE_WINDOWS.bat`: launch local app
- `requirements-local.txt`: Python dependencies
- `app/`: original Next.js + optional ElevenLabs online implementation
