/**
 * XML Voice Generation Format Utilities
 * Provides SSML (Speech Synthesis Markup Language) XML format for voice generation
 */

export interface VoiceXMLOptions {
  /** The text content to be spoken */
  text: string
  /** Voice name (e.g., "en-US-AvaNeural") */
  voice?: string
  /** Language code (e.g., "en-US") */
  language?: string
  /** Speaking rate: "x-slow", "slow", "medium", "fast", "x-fast" or percentage like "50%" */
  rate?: string
  /** Pitch: "x-low", "low", "medium", "high", "x-high" or frequency like "+50Hz" */
  pitch?: string
  /** Volume: "silent", "x-soft", "soft", "medium", "loud", "x-loud" or decibel like "+6dB" */
  volume?: string
  /** Emphasis level: "strong", "moderate", "reduced" */
  emphasis?: string
  /** Pause duration in seconds or milliseconds (e.g., "2s", "500ms") */
  pause?: string
  /** Audio effects and filters */
  effects?: AudioEffect[]
}

export interface AudioEffect {
  /** Effect type */
  type: "reverb" | "echo" | "chorus" | "distortion" | "filter"
  /** Effect parameters */
  parameters?: Record<string, string | number>
}

export interface VoiceBreak {
  /** Break duration: "none", "x-weak", "weak", "medium", "strong", "x-strong" or time like "2s" */
  strength?: string
  /** Exact time duration (e.g., "1s", "500ms") */
  time?: string
}

export interface VoiceProsody {
  /** Speaking rate */
  rate?: string
  /** Voice pitch */
  pitch?: string
  /** Voice volume */
  volume?: string
  /** Content to apply prosody to */
  content: string
}

export interface VoiceEmphasis {
  /** Emphasis level */
  level: "strong" | "moderate" | "reduced"
  /** Content to emphasize */
  content: string
}

export interface VoiceSayAs {
  /** How to interpret the text */
  interpretAs: "characters" | "spell-out" | "cardinal" | "number" | "ordinal" | "digits" | "fraction" | "unit" | "date" | "time" | "telephone" | "address"
  /** Format hint for interpretation */
  format?: string
  /** Content to interpret */
  content: string
}

/**
 * Creates a complete SSML XML document for voice generation
 */
export function createVoiceXML(options: VoiceXMLOptions): string {
  const {
    text,
    voice = "en-US-AvaNeural",
    language = "en-US",
    rate = "default",
    pitch = "default",
    volume = "default",
    emphasis,
    effects = []
  } = options

  let content = text

  // Apply emphasis if specified
  if (emphasis) {
    content = `<emphasis level="${emphasis}">${content}</emphasis>`
  }

  // Apply prosody settings
  content = `<prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${content}</prosody>`

  // Apply audio effects if any
  if (effects.length > 0) {
    content = applyAudioEffects(content, effects)
  }

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
  <voice name="${voice}">
    ${content}
  </voice>
</speak>`
}

/**
 * Creates a voice break (pause) element
 */
export function createBreak(breakOptions: VoiceBreak): string {
  const { strength, time } = breakOptions
  
  if (time) {
    return `<break time="${time}"/>`
  }
  
  if (strength) {
    return `<break strength="${strength}"/>`
  }
  
  return `<break/>`
}

/**
 * Creates a prosody element with custom speech characteristics
 */
export function createProsody(prosodyOptions: VoiceProsody): string {
  const { rate, pitch, volume, content } = prosodyOptions
  
  const attributes = []
  if (rate) attributes.push(`rate="${rate}"`)
  if (pitch) attributes.push(`pitch="${pitch}"`)
  if (volume) attributes.push(`volume="${volume}"`)
  
  const attributeString = attributes.length > 0 ? ` ${attributes.join(' ')}` : ''
  
  return `<prosody${attributeString}>${content}</prosody>`
}

/**
 * Creates an emphasis element
 */
export function createEmphasis(emphasisOptions: VoiceEmphasis): string {
  const { level, content } = emphasisOptions
  return `<emphasis level="${level}">${content}</emphasis>`
}

/**
 * Creates a say-as element for specific text interpretation
 */
export function createSayAs(sayAsOptions: VoiceSayAs): string {
  const { interpretAs, format, content } = sayAsOptions
  
  const formatAttr = format ? ` format="${format}"` : ''
  
  return `<say-as interpret-as="${interpretAs}"${formatAttr}>${content}</say-as>`
}

/**
 * Creates a phoneme element for custom pronunciation
 */
export function createPhoneme(text: string, phoneme: string, alphabet: "ipa" | "sapi" = "ipa"): string {
  return `<phoneme alphabet="${alphabet}" ph="${phoneme}">${text}</phoneme>`
}

/**
 * Creates a substitution element to replace text with different pronunciation
 */
export function createSubstitution(originalText: string, substituteText: string): string {
  return `<sub alias="${substituteText}">${originalText}</sub>`
}

/**
 * Wraps text with MSTTS (Microsoft Speech Platform) specific elements
 */
export function createMSTTSExpress(text: string, style?: string, role?: string): string {
  const attributes = []
  if (style) attributes.push(`style="${style}"`)
  if (role) attributes.push(`role="${role}"`)
  
  const attributeString = attributes.length > 0 ? ` ${attributes.join(' ')}` : ''
  
  return `<mstts:express-as${attributeString}>${text}</mstts:express-as>`
}

/**
 * Creates a complex voice XML with multiple elements
 */
export function createAdvancedVoiceXML(elements: Array<{
  type: "text" | "break" | "prosody" | "emphasis" | "say-as" | "phoneme" | "sub" | "mstts-express"
  content?: string
  options?: any
}>): string {
  const content = elements.map(element => {
    switch (element.type) {
      case "text":
        return element.content || ""
      case "break":
        return createBreak(element.options || {})
      case "prosody":
        return createProsody({ content: element.content || "", ...element.options })
      case "emphasis":
        return createEmphasis({ content: element.content || "", ...element.options })
      case "say-as":
        return createSayAs({ content: element.content || "", ...element.options })
      case "phoneme":
        return createPhoneme(element.content || "", element.options?.phoneme || "", element.options?.alphabet)
      case "sub":
        return createSubstitution(element.content || "", element.options?.substitute || "")
      case "mstts-express":
        return createMSTTSExpress(element.content || "", element.options?.style, element.options?.role)
      default:
        return element.content || ""
    }
  }).join("")
  
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    ${content}
  </voice>
</speak>`
}

/**
 * Applies audio effects to content (placeholder for future implementation)
 */
function applyAudioEffects(content: string, effects: AudioEffect[]): string {
  // This is a placeholder - actual audio effects would depend on the TTS service capabilities
  // For now, we'll just return the content as-is
  return content
}

/**
 * Validates SSML XML format
 */
export function validateSSML(ssmlXML: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Basic validation checks
  if (!ssmlXML.includes('<speak')) {
    errors.push('Missing required <speak> root element')
  }
  
  if (!ssmlXML.includes('version="1.0"')) {
    errors.push('Missing version attribute in <speak> element')
  }
  
  if (!ssmlXML.includes('xmlns="http://www.w3.org/2001/10/synthesis"')) {
    errors.push('Missing required namespace in <speak> element')
  }
  
  // Check for unclosed tags (basic check)
  const openTags = (ssmlXML.match(/<[^\/][^>]*>/g) || []).length
  const closeTags = (ssmlXML.match(/<\/[^>]*>/g) || []).length
  const selfClosingTags = (ssmlXML.match(/<[^>]*\/>/g) || []).length
  
  if (openTags !== closeTags + selfClosingTags) {
    errors.push('Mismatched opening and closing tags')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Example usage and templates
 */
export const VOICE_XML_EXAMPLES = {
  basic: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      Hello, this is a basic voice generation example.
    </prosody>
  </voice>
</speak>`,

  withEmphasis: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      This is <emphasis level="strong">very important</emphasis> information.
    </prosody>
  </voice>
</speak>`,

  withBreaks: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      First sentence. <break time="2s"/> Second sentence after a pause.
    </prosody>
  </voice>
</speak>`,

  withNumbers: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      The number <say-as interpret-as="cardinal">12345</say-as> is read as twelve thousand three hundred forty-five.
      The date <say-as interpret-as="date" format="mdy">12/25/2023</say-as> is Christmas.
    </prosody>
  </voice>
</speak>`,

  withPhonetics: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      The word <phoneme alphabet="ipa" ph="ˈtoʊmeɪtoʊ">tomato</phoneme> can be pronounced differently.
    </prosody>
  </voice>
</speak>`,

  withSubstitution: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      I work at <sub alias="Microsoft">MSFT</sub> corporation.
    </prosody>
  </voice>
</speak>`,

  complex: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <mstts:express-as style="cheerful">
      <prosody rate="medium" pitch="+10%" volume="loud">
        Welcome to our <emphasis level="strong">amazing</emphasis> voice generation system!
        <break time="1s"/>
        Today is <say-as interpret-as="date" format="mdy">12/25/2023</say-as>.
        <break strength="medium"/>
        The temperature is <say-as interpret-as="cardinal">25</say-as> degrees.
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`
}