export const DEFAULT_OPTIONS = {
  voice: "en-US-AvaNeural",
  language: "en-US",
  outputFormat: "audio-24khz-96kbitrate-mono-mp3",
  rate: "default",
  pitch: "default",
  volume: "default",
} as const

export const WEBSOCKET_CONFIG = {
  baseUrl: "wss://speech.platform.bing.com",
  path: "/consumer/speech/synthesize/readaloud/edge/v1",
  trustedClientToken: "6A5AA1D4EAFF4E9FB37E23D68491D6F4",
} as const

export const AUDIO_CONSTANTS = {
  TIME_FACTOR: 10_000,
} as const
