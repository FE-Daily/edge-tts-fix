import type { AudioMetadata } from './metadata'

/**
 * Options for parsing and generating subtitles
 */
export interface ParseSubtitleOptions {
  /**
   * Method to split the text into subtitle cues
   * - 'sentence': splits using Intl.Segmenter
   * - 'word': splits by word count
   * - 'duration': splits by time duration
   */
  splitBy: "sentence" | "word" | "duration"
  /** Number of words or duration in milliseconds per subtitle (used with 'word' or 'duration' splitBy) */
  count?: number
  /** Audio metadata used for timing information */
  metadata: Array<AudioMetadata>
}

/**
 * Represents a single subtitle entry with timing information
 */
export interface ParseSubtitleResult {
  /** The text content of the subtitle */
  text: string
  /** Start time in milliseconds */
  start: number
  /** End time in milliseconds */
  end: number
  /** Duration in milliseconds */
  duration: number
}
