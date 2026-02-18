import asyncio
import json
import logging
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import AgentSession, Agent, room_io
from livekit.plugins import noise_cancellation, silero, openai
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

logger = logging.getLogger("meditation-voice-agent")
logging.basicConfig(level=logging.INFO)

DEFAULT_INSTRUCTIONS = """You are a calm meditation voice guide.
You speak gently, slowly, and clearly.
Keep responses short and natural for spoken audio.
Do not use emojis or special characters.
Create a peaceful atmosphere in every response.
"""


class MeditationAssistant(Agent):
    def __init__(self, instructions: str):
        super().__init__(instructions=instructions)


def parse_room_metadata(raw_metadata: str) -> dict:
    if not raw_metadata:
        return {}
    try:
        return json.loads(raw_metadata)
    except Exception:
        logger.warning("Invalid room metadata")
        return {}


async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()

    metadata = parse_room_metadata(ctx.room.metadata or "")

    preferred_voice = metadata.get("preferredVoice", "alloy")
    language = metadata.get("language", "en-US")
    meditation_type = metadata.get("meditationType", "breathing")
    duration = metadata.get("duration", 5)

    lang_code = language.split("-")[0]

    instructions = f"""
{DEFAULT_INSTRUCTIONS}

Meditation Type: {meditation_type}
Duration: {duration} minutes.

Guide the user through the session calmly.
"""

    session = AgentSession(
        stt=openai.STT(
            model="gpt-4o-mini-transcribe",
            language=lang_code,
        ),
        llm=openai.LLM(
            model="gpt-4.1-mini",
            temperature=0.4,
        ),
        tts=openai.TTS(
            model="gpt-4o-mini-tts",
            voice=preferred_voice,
            speed=0.92,
            instructions="Speak slowly and calmly.",
        ),
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )

    assistant = MeditationAssistant(instructions=instructions)

    await session.start(
        room=ctx.room,
        agent=assistant,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVC(),
            ),
        ),
    )

    @session.on("response")
    def on_response(resp):
        if resp.output_text:
            asyncio.create_task(
                ctx.room.local_participant.publish_data(
                    json.dumps({
                        "type": "transcript",
                        "text": resp.output_text
                    }).encode("utf-8")
                )
            )

    @ctx.room.on("data_received")
    def on_data(packet):
        async def handle():
            try:
                message = json.loads(packet.data.decode())
            except Exception:
                return

            try:
                if message.get("command") == "start_prep":
                    await session.generate_reply(
                        instructions="Explain what this breathing exercise is about."
                    )

                if message.get("command") == "start_breathing":
                    await session.generate_reply(
                        instructions="Begin guiding the breathing exercise now."
                    )
            except RuntimeError:
                pass  # session already closed

        asyncio.create_task(handle())

    await session.generate_reply(
        instructions="Greet the user calmly and say we will begin shortly."
    )


if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(
        entrypoint_fnc=entrypoint,
        agent_name="meditation-voice-agent",
    ))
