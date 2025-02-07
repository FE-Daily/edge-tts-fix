const AUDIO_PATH_SEPARATOR = "Path:audio\r\n"

export async function processAudioChunk(chunk: Blob): Promise<Uint8Array> {
  const bytes = new Uint8Array(await chunk.arrayBuffer())
  const binaryString = new TextDecoder().decode(bytes)
  const index = binaryString.indexOf(AUDIO_PATH_SEPARATOR) + AUDIO_PATH_SEPARATOR.length
  return bytes.subarray(index)
}

export async function processAudioChunks(
  chunks: Array<Blob>,
): Promise<Array<Uint8Array>> {
  const processed: Array<Uint8Array> = []

  for (const chunk of chunks) {
    processed.push(await processAudioChunk(chunk))
  }

  return processed
}

/**
 * Ensures binary data is converted to a Blob for consistent handling across platforms.
 * This is needed because WebSocket message.data can be different types:
 * - In browsers: Blob
 * - In Node.js: Buffer (which extends Uint8Array)
 * This helper provides a uniform Blob interface without relying on Node-specific APIs.
 */
export function toBlobLike(data: ArrayBuffer | Blob): Blob {
  if (data instanceof Blob) return data
  return new Blob([data])
}
