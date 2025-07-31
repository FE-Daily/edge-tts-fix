# XML Voice Generation Format

This document provides a comprehensive guide to using XML format for voice generation with the Edge TTS library. The XML format used is **SSML (Speech Synthesis Markup Language)**, which is the W3C standard for controlling speech synthesis.

## Table of Contents

1. [Basic SSML Structure](#basic-ssml-structure)
2. [Core Elements](#core-elements)
3. [Voice Customization](#voice-customization)
4. [Advanced Features](#advanced-features)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Supported Voices](#supported-voices)

## Basic SSML Structure

All SSML documents must follow this basic structure:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      Your text content goes here
    </prosody>
  </voice>
</speak>
```

### Required Attributes

- `version="1.0"`: SSML version
- `xmlns="http://www.w3.org/2001/10/synthesis"`: SSML namespace
- `xml:lang`: Language code (e.g., "en-US", "es-ES", "fr-FR")

## Core Elements

### 1. `<speak>` - Root Element

The root element that contains all other SSML elements.

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <!-- All content goes here -->
</speak>
```

### 2. `<voice>` - Voice Selection

Specifies which voice to use for speech synthesis.

```xml
<voice name="en-US-AvaNeural">
  Your text here
</voice>
```

### 3. `<prosody>` - Speech Characteristics

Controls the rate, pitch, and volume of speech.

```xml
<prosody rate="slow" pitch="high" volume="loud">
  This text will be spoken slowly, with high pitch, and loud volume.
</prosody>
```

#### Prosody Attributes

- **rate**: `x-slow`, `slow`, `medium`, `fast`, `x-fast`, or percentage (e.g., `50%`, `150%`)
- **pitch**: `x-low`, `low`, `medium`, `high`, `x-high`, or frequency (e.g., `+50Hz`, `-20Hz`)
- **volume**: `silent`, `x-soft`, `soft`, `medium`, `loud`, `x-loud`, or decibel (e.g., `+6dB`, `-3dB`)

### 4. `<break>` - Pauses

Inserts pauses in speech.

```xml
<break time="2s"/>
<break strength="strong"/>
```

#### Break Attributes

- **time**: Duration in seconds (`1s`) or milliseconds (`500ms`)
- **strength**: `none`, `x-weak`, `weak`, `medium`, `strong`, `x-strong`

### 5. `<emphasis>` - Text Emphasis

Adds emphasis to specific words or phrases.

```xml
<emphasis level="strong">This is very important!</emphasis>
```

#### Emphasis Levels

- `strong`: Strong emphasis
- `moderate`: Moderate emphasis  
- `reduced`: Reduced emphasis

### 6. `<say-as>` - Text Interpretation

Controls how text should be interpreted and spoken.

```xml
<say-as interpret-as="cardinal">12345</say-as>
<say-as interpret-as="date" format="mdy">12/25/2023</say-as>
<say-as interpret-as="time" format="hms12">2:30pm</say-as>
```

#### Interpret-as Values

- `characters` / `spell-out`: Spell out each character
- `cardinal` / `number`: Read as cardinal number
- `ordinal`: Read as ordinal number (1st, 2nd, 3rd)
- `digits`: Read each digit separately
- `fraction`: Read as fraction
- `unit`: Read as unit/measurement
- `date`: Read as date
- `time`: Read as time
- `telephone`: Read as phone number
- `address`: Read as address

### 7. `<phoneme>` - Phonetic Pronunciation

Provides phonetic pronunciation for words.

```xml
<phoneme alphabet="ipa" ph="təˈmeɪtoʊ">tomato</phoneme>
```

#### Phoneme Attributes

- **alphabet**: `ipa` (International Phonetic Alphabet) or `sapi`
- **ph**: The phonetic representation

### 8. `<sub>` - Substitution

Replaces text with different pronunciation.

```xml
<sub alias="World Wide Web">WWW</sub>
<sub alias="Microsoft">MSFT</sub>
```

## Voice Customization

### Microsoft Speech Platform Extensions

For enhanced control, you can use Microsoft-specific extensions:

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <mstts:express-as style="cheerful" role="narrator">
      Welcome to our amazing voice generation system!
    </mstts:express-as>
  </voice>
</speak>
```

#### Available Styles

- `cheerful`: Happy, upbeat tone
- `sad`: Melancholy tone
- `angry`: Frustrated tone
- `fearful`: Scared, nervous tone
- `calm`: Relaxed, composed tone
- `friendly`: Warm, welcoming tone
- `excited`: Energetic, enthusiastic tone

#### Available Roles

- `narrator`: Storytelling voice
- `customer`: Customer service voice
- `assistant`: Helpful assistant voice

## Advanced Features

### 1. Complex Nested Elements

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium" volume="medium">
      Welcome to our service. <break time="1s"/>
      <emphasis level="strong">Please listen carefully</emphasis> 
      to the following options:
      <break time="0.5s"/>
      <prosody rate="slow" volume="loud">
        Press <say-as interpret-as="digits">1</say-as> for billing,
        Press <say-as interpret-as="digits">2</say-as> for support.
      </prosody>
    </prosody>
  </voice>
</speak>
```

### 2. Multi-language Support

```xml
<!-- English -->
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AvaNeural">
    <prosody rate="medium">Hello, welcome to our service.</prosody>
  </voice>
</speak>

<!-- Spanish -->
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-ES">
  <voice name="es-ES-ElviraNeural">
    <prosody rate="medium">Hola, bienvenido a nuestro servicio.</prosody>
  </voice>
</speak>
```

## Usage Examples

### 1. Basic Voice Generation

```typescript
import { createVoiceXML } from '@echristian/edge-tts'

const xml = createVoiceXML({
  text: "Hello, this is a test message.",
  voice: "en-US-AvaNeural",
  language: "en-US",
  rate: "medium",
  pitch: "medium",
  volume: "medium"
})
```

### 2. Customer Service IVR

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    <mstts:express-as style="friendly">
      <prosody rate="medium" volume="medium">
        Thank you for calling TechCorp customer service.
        <break time="1s"/>
        Your call is important to us.
        <break time="0.5s"/>
        <emphasis level="moderate">Please listen carefully</emphasis>
        as our menu options have changed.
        <break time="1s"/>
        <prosody rate="slow" volume="loud">
          Press <say-as interpret-as="digits">1</say-as> for account information.
          Press <say-as interpret-as="digits">2</say-as> for technical support.
          Press <say-as interpret-as="digits">3</say-as> for billing inquiries.
        </prosody>
      </prosody>
    </mstts:express-as>
  </voice>
</speak>
```

### 3. Educational Content

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    <prosody rate="slow" volume="medium">
      Today we're learning about 
      <phoneme alphabet="ipa" ph="ˌfoʊtoʊˈsɪnθəsɪs">photosynthesis</phoneme>.
      <break time="1s"/>
      Photosynthesis is the process by which plants convert 
      <sub alias="carbon dioxide">CO2</sub> and water into glucose using sunlight.
      <break time="1s"/>
      <emphasis level="strong">Remember</emphasis>: 
      sunlight plus water plus carbon dioxide equals glucose plus oxygen.
    </prosody>
  </voice>
</speak>
```

### 4. News Reading

```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AriaNeural">
    <prosody rate="medium" pitch="medium" volume="medium">
      <emphasis level="strong">Breaking News:</emphasis>
      <break time="0.5s"/>
      Scientists have discovered a new species of butterfly in the Amazon rainforest.
      <break time="1s"/>
      The discovery was made on 
      <say-as interpret-as="date" format="mdy">12/15/2023</say-as>
      by a team of researchers from the University of California.
    </prosody>
  </voice>
</speak>
```

## Best Practices

### 1. Structure and Organization

- Always use proper SSML structure with required namespaces
- Nest elements logically (prosody → emphasis → text)
- Use consistent indentation for readability

### 2. Performance Optimization

- Keep SSML documents concise
- Avoid excessive nesting
- Use appropriate break durations (not too long)
- Test with different voices for optimal results

### 3. Accessibility

- Provide phonetic pronunciations for complex words
- Use appropriate emphasis for important information
- Include natural pauses for better comprehension
- Consider different speaking rates for different audiences

### 4. Voice Selection

- Choose voices appropriate for your content type
- Use consistent voices within a single application
- Consider regional accents for localized content
- Test voices with your specific content

### 5. Content Guidelines

- Write text as you would speak it naturally
- Use punctuation to guide natural pauses
- Spell out abbreviations that might be unclear
- Provide context for numbers and dates

## Supported Voices

### English Voices

- `en-US-AvaNeural` - Female, clear, versatile
- `en-US-AriaNeural` - Female, professional, news-style
- `en-US-JennyNeural` - Female, friendly, conversational
- `en-US-GuyNeural` - Male, professional, clear
- `en-US-DavisNeural` - Male, warm, conversational

### Spanish Voices

- `es-ES-ElviraNeural` - Female, European Spanish
- `es-MX-DaliaNeural` - Female, Mexican Spanish
- `es-AR-ElenaNeural` - Female, Argentinian Spanish

### French Voices

- `fr-FR-DeniseNeural` - Female, European French
- `fr-CA-SylvieNeural` - Female, Canadian French

### Other Languages

- `de-DE-KatjaNeural` - German, Female
- `it-IT-ElsaNeural` - Italian, Female
- `pt-BR-FranciscaNeural` - Portuguese (Brazil), Female
- `ja-JP-NanamiNeural` - Japanese, Female
- `ko-KR-SunHiNeural` - Korean, Female
- `zh-CN-XiaoxiaoNeural` - Chinese (Mandarin), Female

## Error Handling and Validation

### Common SSML Errors

1. **Missing required attributes**
   ```xml
   <!-- Wrong -->
   <speak><voice>Text</voice></speak>
   
   <!-- Correct -->
   <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
     <voice name="en-US-AvaNeural">Text</voice>
   </speak>
   ```

2. **Unclosed tags**
   ```xml
   <!-- Wrong -->
   <prosody rate="slow">Text
   
   <!-- Correct -->
   <prosody rate="slow">Text</prosody>
   ```

3. **Invalid attribute values**
   ```xml
   <!-- Wrong -->
   <prosody rate="super-fast">Text</prosody>
   
   <!-- Correct -->
   <prosody rate="x-fast">Text</prosody>
   ```

### Validation

Use the built-in validation function:

```typescript
import { validateSSML } from '@echristian/edge-tts'

const result = validateSSML(yourSSMLString)
if (!result.isValid) {
  console.error('SSML Errors:', result.errors)
}
```

## Integration with Edge TTS

The XML voice format integrates seamlessly with the existing Edge TTS generate function:

```typescript
import { generate } from '@echristian/edge-tts'

// The generate function already uses SSML internally
const result = await generate({
  text: "Your text here",
  voice: "en-US-AvaNeural",
  rate: "medium",
  pitch: "medium",
  volume: "medium"
})

// For more complex SSML, you can create it manually and pass as text
import { createAdvancedVoiceXML } from '@echristian/edge-tts'

const complexSSML = createAdvancedVoiceXML([
  { type: "text", content: "Welcome " },
  { type: "break", options: { time: "1s" } },
  { type: "emphasis", content: "to our service", options: { level: "strong" } }
])

// Extract just the inner content for the generate function
const textContent = complexSSML.match(/<voice[^>]*>(.*)<\/voice>/s)?.[1] || ""

const result = await generate({
  text: textContent,
  voice: "en-US-AvaNeural"
})
```

This comprehensive XML voice format provides powerful control over speech synthesis, enabling you to create natural, expressive, and accessible voice applications.