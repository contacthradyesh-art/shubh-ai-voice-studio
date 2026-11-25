# Free mode notes

- No paid TTS provider is called by `local_app.py`.
- Model: `ai4bharat/IndicF5` (Hindi supported).
- The model is downloaded from Hugging Face on first use after accepting its access conditions.
- The user supplies a reference audio and exact transcript per generation.
- Male/female labels are user-selected reference profiles, not separately trained default voices.
- For persistent profile management, keep separate reference audio files and transcripts locally.
- Do not expose the Gradio app publicly without authentication and safeguards.
- Voice cloning must only be used with the speaker's consent.
