import { DEFAULT_OPTIONS } from "../constants"
import { connect } from "../services/tts"
import {
  GenerateOptions,
  GenerateResult,
  AudioMetadata,
  ParseSubtitleOptions,
} from "../types"
import { parseSubtitle } from "./subtitle"

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

  const requestString = `
  X-RequestId:${requestId}\r\n
  Content-Type:application/ssml+xml\r\n
  Path:ssml\r\n\r\n

  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
    <voice name="${voice}">
      <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
        ${options.text}
      </prosody>
    </voice>
  </speak>
  `

  const audioChunks: Array<Uint8Array> = []
  const subtitleChunks: Array<AudioMetadata> = []

  const { promise, resolve, reject } = Promise.withResolvers<GenerateResult>()

  socket.send(requestString)

  socket.addEventListener("error", reject)

  socket.addEventListener(
    "message",
    async (message: MessageEvent<string | Blob>) => {
      if (typeof message.data !== "string") {
        const blob = new Blob([message.data])

        const separator = "Path:audio\r\n"

        const bytes = new Uint8Array(await blob.arrayBuffer())
        const binaryString = new TextDecoder().decode(bytes)

        const index = binaryString.indexOf(separator) + separator.length
        const audioData = bytes.subarray(index)

        return audioChunks.push(audioData)
      }

      if (message.data.includes("Path:audio.metadata")) {
        const jsonString = message.data.split("Path:audio.metadata")[1].trim()
        const json = JSON.parse(jsonString) as AudioMetadata

        return subtitleChunks.push(json)
      }

      if (message.data.includes("Path:turn.end")) {
        resolve({
          audio: new Blob(audioChunks),
          subtitle: parseSubtitle({ metadata: subtitleChunks, ...subtitle }),
        })
        return
      }
    },
  )

  return promise
}
