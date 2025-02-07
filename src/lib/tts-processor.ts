import { AudioMetadata, GenerateResult, ParseSubtitleOptions } from "../main"
import { parseSubtitle } from "../subtitle"

const AUDIO_PATH_SEPARATOR = "Path:audio\r\n"

interface State {
  audioChunks: Array<Blob>
  subtitleChunks: Array<AudioMetadata>
}

function createInitialState(): State {
  return {
    audioChunks: [],
    subtitleChunks: [],
  }
}

async function processAudioChunks(
  chunks: Array<Blob>,
): Promise<Array<Uint8Array>> {
  const processed: Array<Uint8Array> = []

  for (const chunk of chunks) {
    const bytes = new Uint8Array(await chunk.arrayBuffer())
    const binaryString = new TextDecoder().decode(bytes)
    const index =
      binaryString.indexOf(AUDIO_PATH_SEPARATOR) + AUDIO_PATH_SEPARATOR.length
    processed.push(bytes.subarray(index))
  }

  return processed
}

function parseMetadataMessage(message: string): AudioMetadata | undefined {
  const hasMetadata = message.includes("Path:audio.metadata")
  if (!hasMetadata) return undefined

  const jsonString = message.split("Path:audio.metadata")[1].trim()
  return JSON.parse(jsonString) as AudioMetadata
}

function handleStringMessage(
  message: string,
  state: State,
  socket: WebSocket,
): void {
  if (message.includes("Path:turn.end")) {
    socket.close()
    return
  }

  const metadata = parseMetadataMessage(message)
  if (metadata !== undefined) {
    state.subtitleChunks.push(metadata)
  }
}

function handleBinaryMessage(data: ArrayBuffer | Blob, state: State): void {
  state.audioChunks.push(toBlobLike(data))
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

export function handleTTSConnection(
  socket: WebSocket,
  options: Omit<ParseSubtitleOptions, "metadata">,
): Promise<GenerateResult> {
  const state = createInitialState()
  const { promise, resolve, reject } = Promise.withResolvers<GenerateResult>()

  socket.addEventListener("error", reject)

  socket.addEventListener("close", async () => {
    const processedChunks = await processAudioChunks(state.audioChunks)
    resolve({
      audio: new Blob(processedChunks),
      subtitle: parseSubtitle({ metadata: state.subtitleChunks, ...options }),
    })
  })

  socket.addEventListener(
    "message",
    ({ data }: MessageEvent<string | Blob>) => {
      if (typeof data === "string") {
        handleStringMessage(data, state, socket)
      } else {
        handleBinaryMessage(data, state)
      }
    },
  )

  return promise
}
