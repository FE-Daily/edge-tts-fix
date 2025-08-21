export const API_CONFIG = {
  baseUrl: "https://speech.platform.bing.com",
  headers: {
    Authority: "speech.platform.bing.com",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-CH-UA":
      '" Not;A Brand";v="99", "Microsoft Edge";v="130", "Chromium";v="130"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
  },
} as const

export const DEFAULT_OPTIONS = {
  voice: "en-US-AvaNeural",
  language: "en-US",
  outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  rate: "default",
  pitch: "default",
  volume: "default",
  subtitle: {
    splitBy: "word",
    wordsPerCue: 10,
    durationPerCue: 5000,
  },
} as const

export const WEBSOCKET_CONFIG = {
  baseUrl: "wss://speech.platform.bing.com",
  path: "/consumer/speech/synthesize/readaloud/edge/v1",
  trustedClientToken: "6A5AA1D4EAFF4E9FB37E23D68491D6F4",
} as const

export const AUDIO_CONSTANTS = {
  TIME_FACTOR: 10_000,
} as const
