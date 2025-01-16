import { ParseSubtitleOptions, ParseSubtitleResult } from "./subtitle"

/**
 * Configuration options for generating audio from text
 */
export interface GenerateOptions {
  /** The text that will be generated as audio */
  text: string
  /** Voice persona used to read the message */
  voice?: string
  /** Language code for the voice */
  language?: string
  /** Audio output format */
  outputFormat?: string
  /** Speaking rate/speed of the voice */
  rate?: string
  /** Voice pitch adjustment */
  pitch?: string
  /** Voice volume level */
  volume?: string
  /** Subtitle generation options (excluding metadata) */
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
