import { ParseSubtitleOptions, ParseSubtitleResult } from "./subtitle"

/**
 * Configuration options for generating audio from text
 */
export interface GenerateOptions {
  /** The text that will be generated as audio */
  text: string
  /** Voice persona used to read the message
   * @default 'en-US-AvaNeural'
   */
  voice?: string
  /** Language code for the voice
   * @default 'en-US'
   */
  language?: string
  /** Audio output format
   * @default 'audio-24khz-96kbitrate-mono-mp3'
   */
  outputFormat?: string
  /** Speaking rate/speed of the voice
   * @default 'default'
   */
  rate?: string
  /** Voice pitch adjustment
   * @default 'default'
   */
  pitch?: string
  /** Voice volume level
   * @default 'default'
   */
  volume?: string
  /** Subtitle generation options (excluding metadata)
   * @default { splitBy: 'word', wordsPerCue: 10, durationPerCue: 5000 }
   */
  subtitle?: Omit<ParseSubtitleOptions, "metadata">
}

/**
 * Result of the text-to-speech generation process
 */
export interface GenerateResult {
  /** Generated audio blob */
  audio: Blob
  /** Generated subtitle cues */
  subtitle: Array<ParseSubtitleResult>
}
