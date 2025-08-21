/**
 * Metadata structure for audio processing
 */
export interface AudioMetadata {
  /** Array of word boundary information */
  Metadata: [WordBoundary]
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
