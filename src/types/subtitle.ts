import type { AudioMetadata } from "./metadata"

/**
 * Options for parsing and generating subtitles
 */
export interface ParseSubtitleOptions {
  /**
   * Method to split the text into subtitle cues
   * - 'word': splits by word count
   * - 'duration': splits by time duration
   * @default 'word'
   */
  splitBy: "word" | "duration"
  /**
   * Number of words per subtitle cue when using 'word' splitBy
   * @default 10
   */
  wordsPerCue?: number
  /**
   * Duration in milliseconds per subtitle cue when using 'duration' splitBy
   * @default 5000
   */
  durationPerCue?: number
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
