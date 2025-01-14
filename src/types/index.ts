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
 * Metadata structure for audio processing
 */
export interface AudioMetadata {
  /** Array of word boundary information */
  Metadata: [WordBoundary]
}

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

/**
 * Word boundary information from the TTS service
 */
export interface WordBoundary {
  /** Type of boundary marker */
  Type: "WordBoundary"
  /** Detailed boundary data */
  Data: {
    /** Time offset in milliseconds */
    Offset: number
    /** Duration in milliseconds */
    Duration: number
    /** Text information */
    text: {
      /** The word text */
      Text: string
      /** Length of the text */
      Length: number
      /** Type of boundary */
      BoundaryType: "WordBoundary"
    }
  }
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
