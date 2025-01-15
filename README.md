# @ericc/edge-tts

> A zero-dependency TypeScript library for generating speech using Microsoft Edge's text-to-speech API

[![npm version](https://badge.fury.io/js/@echristian%2Fedge-tts.svg)](https://www.npmjs.com/package/@echristian/edge-tts)

Generate high-quality speech from text using Microsoft Edge's text-to-speech service. This library works in any modern JavaScript environment (Browser, Node.js, Deno) and provides rich features like subtitle generation and voice customization.

## Key Features

- 🌐 **Universal Compatibility** - Works in browsers, Node.js, and Deno
- 📦 **Zero Dependencies** - Uses only standard Web APIs
- 🎭 **Multiple Voices** - Support for 400+ voices across 100+ languages
- 📝 **Subtitle Generation** - Automatic subtitle/caption generation with timing
- 🎛️ **Voice Customization** - Control pitch, rate, and volume
- 💪 **TypeScript Support** - Full type definitions included

## Installation

```bash
# npm
npm install @echristian/edge-tts

# pnpm 
pnpm install @echristian/edge-tts

# yarn
yarn add @echristian/edge-tts
```

## Quick Start

```typescript
import { generate } from '@echristian/edge-tts';

// Basic usage
const { audio, subtitle } = await generate({
  text: "Hello, world!",
  voice: "en-US-JennyNeural",
});

// Browser: Play audio
const audioUrl = URL.createObjectURL(audio);
const audioElement = new Audio(audioUrl);
await audioElement.play();

// Node.js: Save audio
const buffer = Buffer.from(await audio.arrayBuffer());
await fs.writeFile('output.mp3', buffer);

// Access synchronized subtitles
console.log(subtitle);
// [
//   {
//     text: "Hello, world!",
//     start: 0,
//     end: 1500,
//     duration: 1500
//   }
// ]
```

## API Reference

### generate(options: GenerateOptions): Promise<GenerateResult>

Main function to generate speech from text.

#### GenerateOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| text | string | (required) | Text to convert to speech |
| voice | string | "en-US-AvaNeural" | Voice ID to use |
| language | string | "en-US" | Language code |
| outputFormat | string | "audio-24khz-96kbitrate-mono-mp3" | Audio format |
| rate | string | "default" | Speaking rate ("x-slow" to "x-fast") |
| pitch | string | "default" | Voice pitch ("x-low" to "x-high") |
| volume | string | "default" | Audio volume ("silent" to "x-loud") |
| subtitle | SubtitleOptions | - | Subtitle generation options |

#### SubtitleOptions

| Option | Type | Description |
|--------|------|-------------|
| splitBy | "sentence" \| "word" \| "duration" | How to split subtitles |
| count | number | Words per subtitle or duration in ms |

#### GenerateResult

| Property | Type | Description |
|----------|------|-------------|
| audio | Blob | Generated audio as a Blob |
| subtitle | Array<SubtitleCue> | Generated subtitles |

#### SubtitleCue

| Property | Type | Description |
|----------|------|-------------|
| text | string | Subtitle text |
| start | number | Start time (ms) |
| end | number | End time (ms) |
| duration | number | Duration (ms) |

### Voice Options

#### Available Voices

Visit [Microsoft's Voice Gallery](https://speech.microsoft.com/portal/voicegallery) to explore available voices.

Popular voices include:
- `en-US-JennyNeural` - US English, female
- `en-GB-SoniaNeural` - British English, female
- `es-MX-JorgeNeural` - Mexican Spanish, male
- `fr-FR-DeniseNeural` - French, female
- `de-DE-KatjaNeural` - German, female

#### Speaking Rates

```typescript
// Available rate values
"x-slow" | "slow" | "medium" | "fast" | "x-fast" | "default"
// Or percentage/relative values
"50%" | "+50%" | "-50%"
```

#### Pitch Adjustment

```typescript
// Available pitch values
"x-low" | "low" | "medium" | "high" | "x-high" | "default"
// Or semitone values
"+2st" | "-2st"
```

#### Volume Levels

```typescript
// Available volume values
"silent" | "x-soft" | "soft" | "medium" | "loud" | "x-loud" | "default"
// Or percentage values
"50%" | "+50%" | "-50%"
```

## Advanced Usage

### Custom Subtitle Splitting

```typescript
// Split by duration (milliseconds)
const result = await generate({
  text: "This is a longer piece of text that will be split into multiple subtitles based on duration",
  subtitle: {
    splitBy: "duration",
    count: 2000 // Split every 2 seconds
  }
});

// Split by word count
const result = await generate({
  text: "Split this text into groups of words",
  subtitle: {
    splitBy: "word",
    count: 3 // Three words per subtitle
  }
});
```

### Voice Customization

```typescript
// Customize voice properties
const result = await generate({
  text: "This will be spoken with custom properties",
  voice: "en-US-JennyNeural",
  rate: "fast",
  pitch: "high",
  volume: "loud"
});
```

### Error Handling

```typescript
try {
  const result = await generate({
    text: "Sample text",
    voice: "en-US-JennyNeural"
  });
} catch (error) {
  if (error instanceof Error) {
    console.error("TTS generation failed:", error.message);
  }
}
```

## Browser Support

The library uses standard Web APIs and works in all modern browsers:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)
- ❌ Internet Explorer (not supported)

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

This project is inspired by and builds upon:
- [rany2/edge-tts](https://github.com/rany2/edge-tts)
- [SchneeHertz/node-edge-tts](https://github.com/SchneeHertz/node-edge-tts)

## Related Projects

- [Microsoft Speech SDK](https://github.com/Microsoft/cognitive-services-speech-sdk-js)
- [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/)
