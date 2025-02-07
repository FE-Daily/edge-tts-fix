import { WEBSOCKET_CONFIG, API_CONFIG } from "./lib/constants"

interface VoiceTag {
  ContentCategories: Array<string>
  VoicePersonalities: Array<string>
}

interface Voice {
  Name: string
  ShortName: string
  Gender: "Female" | "Male"
  Locale: string
  SuggestedCodec: string
  FriendlyName: string
  Status: "GA"
  VoiceTag: VoiceTag
}

export async function getVoices(): Promise<Array<Voice>> {
  const url = `${API_CONFIG.baseUrl}/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${WEBSOCKET_CONFIG.trustedClientToken}`

  try {
    const response = await fetch(url, {
      headers: API_CONFIG.headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return (await response.json()) as Array<Voice>
  } catch (error) {
    console.error("Error fetching voices:", error)
    throw error
  }
}
