import { DEFAULT_OPTIONS } from "../constants/main"
import { connect } from "../services/tts"
import {
  GenerateOptions,
  GenerateResult,
  AudioMetadata,
  ParseSubtitleOptions,
} from "../types/main"
import { parseSubtitle } from "./subtitle"

interface SSMLParams {
  requestId: string
  text: string
  voice: string
  language: string
  rate: string
  pitch: string
  volume: string
}

function createSSMLString(params: SSMLParams): string {
  const { requestId, text, voice, language, rate, pitch, volume } = params
  return `
  X-RequestId:${requestId}\r\n
  Content-Type:application/ssml+xml\r\n
  Path:ssml\r\n\r\n

  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
    <voice name="${voice}">
      <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
        ${text}
      </prosody>
    </voice>
  </speak>
  `
}

async function handleBinaryMessage(message: Blob): Promise<Uint8Array> {
  const separator = "Path:audio\r\n"
  const bytes = new Uint8Array(await message.arrayBuffer())
  const binaryString = new TextDecoder().decode(bytes)
  const index = binaryString.indexOf(separator) + separator.length
  return bytes.subarray(index)
}

function handleMetadataMessage(message: string): AudioMetadata | null {
  if (!message.includes("Path:audio.metadata")) return null
  const jsonString = message.split("Path:audio.metadata")[1].trim()
  return JSON.parse(jsonString) as AudioMetadata
}

/**
 * Ensures binary data is converted to a Blob for consistent handling across platforms.
 * This is needed because WebSocket message.data can be different types:
 * - In browsers: Blob
 * - In Node.js: Buffer (which extends Uint8Array)
 * This helper provides a uniform Blob interface without relying on Node-specific APIs.
 */
function toBlobLike(data: ArrayBuffer | Blob): Blob {
  if (data instanceof Blob) return data
  return new Blob([data])
}

function setupWebSocketHandlers(
  socket: WebSocket,
  options: Omit<ParseSubtitleOptions, "metadata">,
): Promise<GenerateResult> {
  const audioChunks: Array<Uint8Array> = []
  const subtitleChunks: Array<AudioMetadata> = []
  const { promise, resolve, reject } = Promise.withResolvers<GenerateResult>()

  socket.addEventListener("error", reject)

  const messageHandlers = {
    async handleBinaryData(data: Blob) {
      const audioData = await handleBinaryMessage(data)
      audioChunks.push(audioData)
    },

    handleTextData(data: string) {
      if (data.includes("Path:turn.end")) {
        resolve({
          audio: new Blob(audioChunks),
          subtitle: parseSubtitle({ metadata: subtitleChunks, ...options }),
        })
        return
      }

      const metadata = handleMetadataMessage(data)
      if (metadata) {
        subtitleChunks.push(metadata)
      }
    },
  }

  socket.addEventListener(
    "message",
    async ({ data }: MessageEvent<string | Blob>) => {
      if (typeof data === "string") {
        messageHandlers.handleTextData(data)
      } else {
        await messageHandlers.handleBinaryData(toBlobLike(data))
      }
    },
  )

  return promise
}

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
