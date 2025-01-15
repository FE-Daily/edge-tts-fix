import { AudioMetadata, GenerateResult, ParseSubtitleOptions } from "../types/main"
import { parseSubtitle } from "./subtitle"

async function processAudioChunks(
  chunks: Array<Blob>,
): Promise<Array<Uint8Array>> {
  const separator = "Path:audio\r\n"
  const processed: Array<Uint8Array> = []

  for (const chunk of chunks) {
    const bytes = new Uint8Array(await chunk.arrayBuffer())
    const binaryString = new TextDecoder().decode(bytes)
    const index = binaryString.indexOf(separator) + separator.length
    processed.push(bytes.subarray(index))
  }

  return processed
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

export function setupWebSocketHandlers(
  socket: WebSocket,
  options: Omit<ParseSubtitleOptions, "metadata">,
): Promise<GenerateResult> {
  const audioChunks: Array<Blob> = []
  const subtitleChunks: Array<AudioMetadata> = []
  const { promise, resolve, reject } = Promise.withResolvers<GenerateResult>()

  socket.addEventListener("error", reject)

  const messageHandlers = {
    handleBinaryData(data: Blob) {
      audioChunks.push(data)
    },

    async handleTextData(data: string) {
      if (data.includes("Path:turn.end")) {
        const processedChunks = await processAudioChunks(audioChunks)
        resolve({
          audio: new Blob(processedChunks),
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
        await messageHandlers.handleTextData(data)
      } else {
        messageHandlers.handleBinaryData(toBlobLike(data))
      }
    },
  )

  return promise
}
