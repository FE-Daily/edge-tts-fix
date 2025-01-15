import { DEFAULT_OPTIONS } from "../constants/main"
import { connect } from "../services/tts"
import {
  GenerateOptions,
  GenerateResult,
  ParseSubtitleOptions,
} from "../types/main"
import { createSSMLString } from "./ssml"
import { setupWebSocketHandlers } from "./websocket-handlers"

/**
 * Asynchronously generates audio and subtitle data based on the provided options.
 *
 * @param options - The options for generating audio and subtitle data.
 * @return  A promise that resolves with the generated audio and subtitle data.
 */
export async function generate(
  options: GenerateOptions,
): Promise<GenerateResult> {
  const voice = options.voice ?? DEFAULT_OPTIONS.voice
  const language = options.language ?? DEFAULT_OPTIONS.language
  const outputFormat = options.outputFormat ?? DEFAULT_OPTIONS.outputFormat
  const rate = options.rate ?? DEFAULT_OPTIONS.rate
  const pitch = options.pitch ?? DEFAULT_OPTIONS.pitch
  const volume = options.volume ?? DEFAULT_OPTIONS.volume

  const subtitle: Omit<ParseSubtitleOptions, "metadata"> = {
    splitBy: "sentence",
    count: 1,
    ...options.subtitle,
  }

  const socket = await connect(outputFormat)
  const requestId = globalThis.crypto.randomUUID()

  const requestString = createSSMLString({
    requestId,
    text: options.text,
    voice,
    language,
    rate,
    pitch,
    volume,
  })

  const result = setupWebSocketHandlers(socket, subtitle)
  socket.send(requestString)

  return result
}
