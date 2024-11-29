# @ericc/edge-tts

> Generate speech audio from text using Microsoft Edge's text-to-speech API.

[![JSR](https://jsr.io/badges/@ericc/edge-tts)](https://jsr.io/@ericc/edge-tts)
[![JSR Score](https://jsr.io/badges/@ericc/edge-tts/score)](https://jsr.io/@ericc/edge-tts)

Heavily inspired by [rany2/edge-tts](https://github.com/rany2/edge-tts) and [SchneeHertz/node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)

## Features

- Zero dependencies
- Using standard web APIs. Should work in all (modern) JS environment
- Provides subtitle/caption data

## Installation

```bash
# Deno
deno add @ericc/edge-tts

# NPM
npx jsr add @ericc/edge-tts

# Yarn
yarn dlx jsr add @ericc/edge-tts

# PNPM
pnpm dlx jsr add @ericc/edge-tts

# Bun
bunx jsr add @ericc/edge-tts

```

## Usage

Check out the example usage and docs at the [JSR page](https://jsr.io/@ericc/edge-tts).

## API Reference

### Basic Usage

```typescript
// Web
const { audio, subtitle } = await generate({
  text: "Hello, world!",
  voice: "en-US-JennyNeural",
  language: "en-US",
});

// Create an audio element and play the generated audio
const audioElement = new Audio(URL.createObjectURL(audio));
audioElement.play();

// Access subtitle data
console.log(subtitle);
```

### Options

#### GenerateOptions

Options that will be sent alongside the websocket request:

- `text` (required): The text that will be generated as audio
- `voice` (optional): Voice persona used to read the message. Defaults to `"en-US-AvaNeural"`
  - Please refer to [Language and voice support for the Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)
- `language` (optional): Language of the message. Defaults to `"en-US"`
  - Please refer to [Language and voice support for the Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)
- `outputFormat` (optional): Format of the audio output. Defaults to `"audio-24khz-96kbitrate-mono-mp3"`
  - Please refer to [SpeechSynthesisOutputFormat Enum](https://learn.microsoft.com/en-us/dotnet/api/microsoft.cognitiveservices.speech.speechsynthesisoutputformat?view=azure-dotnet)
- `rate` (optional): Indicates the speaking rate of the text. Defaults to `"default"`
  - Please refer to [Customize voice and sound with SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#adjust-prosody)
- `pitch` (optional): Indicates the baseline pitch for the text. Defaults to `"default"`
  - Please refer to [Customize voice and sound with SSML](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#adjust-prosody)

#### ParseSubtitleOptions

Options for parsing the subtitle:

- `splitBy` (required): The function will split the cues based on this option
  - `"sentence"`: will split the text using `Intl.Segmenter`
  - `"word"`: will split the text to X count of words for each cue
  - `"duration"`: will split the text to X duration of milliseconds for each cue
- `count` (optional): Used when splitting by `"words"` or `"duration"`
  - When splitting by `"words"`, count means the amount of words for each cue
  - When splitting by `"duration"`, count means the duration in milliseconds for each cue
- `metadata` (required): Array of metadata received throughout the websocket connection

## Credits

- [rany2/edge-tts](https://github.com/rany2/edge-tts)
- [SchneeHertz/node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)
