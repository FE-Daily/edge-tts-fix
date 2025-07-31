/**
 * XML Voice Generation Examples
 * Demonstrates how to use the XML voice format utilities
 */

import {
  createVoiceXML,
  createBreak,
  createProsody,
  createEmphasis,
  createSayAs,
  createPhoneme,
  createSubstitution,
  createMSTTSExpress,
  createAdvancedVoiceXML,
  validateSSML,
  VOICE_XML_EXAMPLES,
  type VoiceXMLOptions
} from '../src/lib/xml-voice-format'

// Example 1: Basic voice XML generation
export function basicVoiceExample(): string {
  const options: VoiceXMLOptions = {
    text: "Hello, welcome to our voice generation system!",
    voice: "en-US-AvaNeural",
    language: "en-US",
    rate: "medium",
    pitch: "medium",
    volume: "medium"
  }
  
  return createVoiceXML(options)
}

// Example 2: Voice with emphasis
export function emphasisExample(): string {
  const options: VoiceXMLOptions = {
    text: "This is very important information that you should remember!",
    voice: "en-US-AvaNeural",
    language: "en-US",
    rate: "slow",
    pitch: "high",
    volume: "loud",
    emphasis: "strong"
  }
  
  return createVoiceXML(options)
}

// Example 3: Creating complex voice XML with multiple elements
export function complexVoiceExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "text",
      content: "Welcome to our customer service. "
    },
    {
      type: "break",
      options: { time: "1s" }
    },
    {
      type: "emphasis",
      content: "Please listen carefully",
      options: { level: "strong" }
    },
    {
      type: "text",
      content: " to the following options. "
    },
    {
      type: "break",
      options: { strength: "medium" }
    },
    {
      type: "prosody",
      content: "Press 1 for billing, press 2 for technical support.",
      options: { rate: "slow", volume: "loud" }
    }
  ])
}

// Example 4: Numbers and dates
export function numbersAndDatesExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "text",
      content: "Your order number is "
    },
    {
      type: "say-as",
      content: "12345",
      options: { interpretAs: "digits" }
    },
    {
      type: "text",
      content: ". Your delivery date is "
    },
    {
      type: "say-as",
      content: "12/25/2023",
      options: { interpretAs: "date", format: "mdy" }
    },
    {
      type: "text",
      content: ". The total amount is "
    },
    {
      type: "say-as",
      content: "$99.99",
      options: { interpretAs: "cardinal" }
    },
    {
      type: "text",
      content: "."
    }
  ])
}

// Example 5: Phonetic pronunciation
export function phoneticExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "text",
      content: "The pronunciation of "
    },
    {
      type: "phoneme",
      content: "tomato",
      options: { phoneme: "təˈmeɪtoʊ", alphabet: "ipa" }
    },
    {
      type: "text",
      content: " can vary by region. Some people say "
    },
    {
      type: "phoneme",
      content: "tomato",
      options: { phoneme: "təˈmɑːtoʊ", alphabet: "ipa" }
    },
    {
      type: "text",
      content: " instead."
    }
  ])
}

// Example 6: Substitutions and abbreviations
export function substitutionExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "text",
      content: "I work at "
    },
    {
      type: "sub",
      content: "MSFT",
      options: { substitute: "Microsoft" }
    },
    {
      type: "text",
      content: " in the "
    },
    {
      type: "sub",
      content: "AI",
      options: { substitute: "Artificial Intelligence" }
    },
    {
      type: "text",
      content: " department. You can reach us at "
    },
    {
      type: "say-as",
      content: "555-123-4567",
      options: { interpretAs: "telephone" }
    }
  ])
}

// Example 7: Emotional expression with MSTTS
export function emotionalExpression(): string {
  return createAdvancedVoiceXML([
    {
      type: "mstts-express",
      content: "Congratulations! You have won the lottery!",
      options: { style: "excited" }
    },
    {
      type: "break",
      options: { time: "2s" }
    },
    {
      type: "mstts-express",
      content: "Please remain calm and follow the instructions carefully.",
      options: { style: "calm" }
    }
  ])
}

// Example 8: Multi-language support
export function multiLanguageExample(): string {
  const englishXML = createVoiceXML({
    text: "Hello, welcome to our international service.",
    voice: "en-US-AvaNeural",
    language: "en-US",
    rate: "medium"
  })
  
  const spanishXML = createVoiceXML({
    text: "Hola, bienvenido a nuestro servicio internacional.",
    voice: "es-ES-ElviraNeural",
    language: "es-ES",
    rate: "medium"
  })
  
  const frenchXML = createVoiceXML({
    text: "Bonjour, bienvenue dans notre service international.",
    voice: "fr-FR-DeniseNeural",
    language: "fr-FR",
    rate: "medium"
  })
  
  return `English: ${englishXML}\n\nSpanish: ${spanishXML}\n\nFrench: ${frenchXML}`
}

// Example 9: Voice customization for different scenarios
export function voiceCustomizationExamples(): Record<string, string> {
  return {
    // News reading style
    news: createVoiceXML({
      text: "Breaking news: Scientists have discovered a new species of butterfly in the Amazon rainforest.",
      voice: "en-US-AriaNeural",
      language: "en-US",
      rate: "medium",
      pitch: "medium",
      volume: "medium"
    }),
    
    // Children's story style
    story: createVoiceXML({
      text: "Once upon a time, in a magical forest far, far away, there lived a friendly dragon named Sparkles.",
      voice: "en-US-JennyNeural",
      language: "en-US",
      rate: "slow",
      pitch: "high",
      volume: "medium",
      emphasis: "moderate"
    }),
    
    // Technical documentation style
    technical: createVoiceXML({
      text: "To configure the API endpoint, set the base URL parameter to https://api.example.com/v1/",
      voice: "en-US-GuyNeural",
      language: "en-US",
      rate: "slow",
      pitch: "low",
      volume: "medium"
    }),
    
    // Meditation/relaxation style
    meditation: createVoiceXML({
      text: "Breathe in slowly through your nose, hold for three seconds, then breathe out gently through your mouth.",
      voice: "en-US-AriaNeural",
      language: "en-US",
      rate: "x-slow",
      pitch: "low",
      volume: "soft"
    })
  }
}

// Example 10: XML validation example
export function validationExample(): void {
  const validXML = createVoiceXML({
    text: "This is valid SSML XML.",
    voice: "en-US-AvaNeural"
  })
  
  const invalidXML = `<speak>
    <voice name="en-US-AvaNeural">
      <prosody rate="medium">
        This XML is missing required attributes
      </prosody>
    </voice>
  </speak>`
  
  console.log("Valid XML validation:", validateSSML(validXML))
  console.log("Invalid XML validation:", validateSSML(invalidXML))
}

// Example 11: Using pre-built templates
export function templateExamples(): void {
  console.log("Basic template:", VOICE_XML_EXAMPLES.basic)
  console.log("With emphasis:", VOICE_XML_EXAMPLES.withEmphasis)
  console.log("With breaks:", VOICE_XML_EXAMPLES.withBreaks)
  console.log("With numbers:", VOICE_XML_EXAMPLES.withNumbers)
  console.log("Complex example:", VOICE_XML_EXAMPLES.complex)
}

// Example 12: Interactive voice response (IVR) system
export function ivrSystemExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "mstts-express",
      content: "Thank you for calling TechCorp customer service.",
      options: { style: "friendly" }
    },
    {
      type: "break",
      options: { time: "1s" }
    },
    {
      type: "prosody",
      content: "Your call is important to us.",
      options: { rate: "medium", volume: "medium" }
    },
    {
      type: "break",
      options: { time: "0.5s" }
    },
    {
      type: "emphasis",
      content: "Please listen carefully",
      options: { level: "moderate" }
    },
    {
      type: "text",
      content: " as our menu options have changed. "
    },
    {
      type: "break",
      options: { time: "1s" }
    },
    {
      type: "prosody",
      content: "Press 1 for account information. Press 2 for technical support. Press 3 for billing inquiries.",
      options: { rate: "slow", volume: "loud" }
    },
    {
      type: "break",
      options: { time: "2s" }
    },
    {
      type: "text",
      content: "Or stay on the line to speak with a representative."
    }
  ])
}

// Example 13: Educational content with pronunciation guides
export function educationalExample(): string {
  return createAdvancedVoiceXML([
    {
      type: "text",
      content: "Today we're learning about photosynthesis. "
    },
    {
      type: "phoneme",
      content: "Photosynthesis",
      options: { phoneme: "ˌfoʊtoʊˈsɪnθəsɪs", alphabet: "ipa" }
    },
    {
      type: "text",
      content: " is the process by which plants convert "
    },
    {
      type: "sub",
      content: "CO2",
      options: { substitute: "carbon dioxide" }
    },
    {
      type: "text",
      content: " and water into glucose using sunlight. "
    },
    {
      type: "break",
      options: { time: "1s" }
    },
    {
      type: "emphasis",
      content: "Remember",
      options: { level: "strong" }
    },
    {
      type: "text",
      content: ": sunlight plus water plus carbon dioxide equals glucose plus oxygen."
    }
  ])
}

// Export all examples for easy access
export const ALL_EXAMPLES = {
  basic: basicVoiceExample,
  emphasis: emphasisExample,
  complex: complexVoiceExample,
  numbersAndDates: numbersAndDatesExample,
  phonetic: phoneticExample,
  substitution: substitutionExample,
  emotional: emotionalExpression,
  multiLanguage: multiLanguageExample,
  voiceCustomization: voiceCustomizationExamples,
  validation: validationExample,
  templates: templateExamples,
  ivr: ivrSystemExample,
  educational: educationalExample
}