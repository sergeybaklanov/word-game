"""Create standalone sentence-free review MP3s for words and infinitives."""

import asyncio
import json
import subprocess
import tempfile
from pathlib import Path

import av
import edge_tts
import numpy as np


SAMPLE_RATE = 24_000
NODE_COMMAND = [
    "node",
    "--input-type=module",
    "-e",
    "import vocabulary from './vocabulary.js'; console.log(JSON.stringify({words: vocabulary.words, infinitives: vocabulary.infinitives}));",
]


def load_groups():
    result = subprocess.run(NODE_COMMAND, check=True, capture_output=True, text=True, encoding="utf-8")
    return json.loads(result.stdout)


async def synthesize(text, voice, destination, limiter):
    async with limiter:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, voice=voice).save(destination)
                return
            except Exception:
                if attempt == 2:
                    raise
                await asyncio.sleep(2 * (attempt + 1))


def read_mono_audio(path):
    samples = []
    resampler = av.AudioResampler(format="s16", layout="mono", rate=SAMPLE_RATE)
    with av.open(path) as source:
        for frame in source.decode(audio=0):
            converted = resampler.resample(frame)
            if not isinstance(converted, list):
                converted = [converted]
            samples.extend(item.to_ndarray() for item in converted)
    return np.concatenate(samples, axis=1)


async def create_track(words, output_name):
    limiter = asyncio.Semaphore(5)
    with tempfile.TemporaryDirectory() as temporary_directory:
        temporary = Path(temporary_directory)
        tasks = []
        for index, word in enumerate(words):
            tasks.extend(
                [
                    synthesize(word["translation"], "uk-UA-PolinaNeural", temporary / f"{index}-uk.mp3", limiter),
                    synthesize(word["english"], "en-US-AvaNeural", temporary / f"{index}-en.mp3", limiter),
                ]
            )
        await asyncio.gather(*tasks)

        one_second = np.zeros((1, SAMPLE_RATE), dtype=np.int16)
        two_seconds = np.zeros((1, SAMPLE_RATE * 2), dtype=np.int16)
        parts = []
        for index, _word in enumerate(words):
            ukrainian = read_mono_audio(temporary / f"{index}-uk.mp3")
            english = read_mono_audio(temporary / f"{index}-en.mp3")
            parts.extend([ukrainian, two_seconds, english, one_second, english, two_seconds])

        track = np.concatenate(parts, axis=1)
        with av.open(output_name, "w") as output:
            stream = output.add_stream("mp3", rate=SAMPLE_RATE)
            stream.layout = "mono"
            stream.bit_rate = 48_000
            for start in range(0, track.shape[1], 1152):
                frame = av.AudioFrame.from_ndarray(track[:, start : start + 1152], format="s16", layout="mono")
                frame.sample_rate = SAMPLE_RATE
                for packet in stream.encode(frame):
                    output.mux(packet)
            for packet in stream.encode():
                output.mux(packet)


async def main():
    groups = load_groups()
    await create_track(groups["words"], "review-words.mp3")
    await create_track(groups["infinitives"], "review-infinitives.mp3")


asyncio.run(main())
