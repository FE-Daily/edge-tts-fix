import { AudioMetadata, ParseSubtitleOptions, SynthesizeResult } from "../main"
import { parseSubtitle } from "../subtitle"
import { processAudioChunks, toBlobLike } from "./audio-processor"
import { parseMetadataMessage } from "./metadata-processor"

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

export function handleTTSConnection(
  socket: WebSocket,
  options: Omit<ParseSubtitleOptions, "metadata">,
): Promise<SynthesizeResult> {
  const state = createInitialState()
  const { promise, resolve, reject } = Promise.withResolvers<SynthesizeResult>()

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
