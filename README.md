# Edge TTS

> A TypeScript library for generating speech using Microsoft Edge's text-to-speech API

Generate speech from text using Microsoft Edge's text-to-speech service. This library provides access to Edge's TTS capabilities with subtitle generation support and voice customization options.

## Installation

```bash
npm install @echristian/edge-tts
```

## Usage

```typescript
import { generate } from "@echristian/edge-tts";

// Basic usage
const { audio, subtitle } = await generate({
  text: "Hello, world!",
});

// Advanced usage with options
const result = await generate({
  text: "Custom voice with specific settings",
  voice: "en-US-AvaNeural",
  language: "en-US",
  outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  rate: "fast",
  pitch: "high",
  volume: "loud",
  subtitle: {
    splitBy: "word",
    wordsPerCue: 5,
  },
});

// Browser: Play the audio
const url = URL.createObjectURL(result.audio);
const audio = new Audio(url);
await audio.play();

// Access subtitle data
console.log(result.subtitle);
```

## API

### generate(options): Promise<GenerateResult>

Main function to generate speech from text.

#### GenerateOptions

| Option       | Type            | Default                              | Description               |
| ------------ | --------------- | ------------------------------------ | ------------------------- |
| text         | string          | (required)                           | Text to convert to speech |
| voice        | string          | "en-US-AvaNeural"                    | Voice ID to use           |
| language     | string          | "en-US"                              | Language code             |
| outputFormat | string          | "audio-24khz-96kbitrate-mono-mp3"    | Audio format              |
| rate         | string          | "default"                            | Speaking rate             |
| pitch        | string          | "default"                            | Voice pitch               |
| volume       | string          | "default"                            | Audio volume              |
| subtitle     | SubtitleOptions | { splitBy: "word", wordsPerCue: 10 } | Subtitle options          |

#### SubtitleOptions

| Option         | Type                 | Default | Description                          |
| -------------- | -------------------- | ------- | ------------------------------------ |
| splitBy        | "word" \| "duration" | "word"  | How to split subtitles               |
| wordsPerCue    | number               | 10      | Words per subtitle when using 'word' |
| durationPerCue | number               | 5000    | Duration (ms) when using 'duration'  |

#### GenerateResult

| Property | Type                  | Description          |
| -------- | --------------------- | -------------------- |
| audio    | Blob                  | Generated audio data |
| subtitle | Array<SubtitleResult> | Generated subtitles  |

#### SubtitleResult

| Property | Type   | Description     |
| -------- | ------ | --------------- |
| text     | string | Subtitle text   |
| start    | number | Start time (ms) |
| end      | number | End time (ms)   |
| duration | number | Duration (ms)   |

## License

MIT
