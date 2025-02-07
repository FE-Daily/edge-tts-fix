import { DEFAULT_OPTIONS } from "./lib/constants"
import { createSocket } from "./lib/connection"
import { createSSMLString } from "./lib/ssml"
import { SynthesizeOptions } from "./types/synthesize"
import { processAudioChunk, toBlobLike } from "./lib/audio-processor"

export async function* synthesizeStream(
  options: SynthesizeOptions,
): AsyncGenerator<Uint8Array> {
  const voice = options.voice ?? DEFAULT_OPTIONS.voice
  const language = options.language ?? DEFAULT_OPTIONS.language
  const outputFormat = options.outputFormat ?? DEFAULT_OPTIONS.outputFormat
  const rate = options.rate ?? DEFAULT_OPTIONS.rate
  const pitch = options.pitch ?? DEFAULT_OPTIONS.pitch
  const volume = options.volume ?? DEFAULT_OPTIONS.volume

  const socket = await createSocket(outputFormat)
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

  const { promise: done, resolve, reject } = Promise.withResolvers<void>()

  const queue: Blob[] = []
  let isDone = false
  let error: Error | null = null

  socket.addEventListener("error", (err) => {
    error = err instanceof Error ? err : new Error("WebSocket error");
    reject(error);
  })

  socket.addEventListener("message", async ({ data }: MessageEvent<string | Blob>) => {
    if (typeof data === "string") {
      if (data.includes("Path:turn.end")) {
        socket.close()
        isDone = true
        resolve()
      }
    } else {
      queue.push(toBlobLike(data))
    }
  })

  socket.send(requestString)

  try {
    while (!isDone || queue.length > 0) {
      if (error) throw error;
      
      if (queue.length > 0) {
        const chunk = queue.shift()!
        const processed = await processAudioChunk(chunk)
        yield processed
      } else {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    }

    await done
  } finally {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
  }
}
