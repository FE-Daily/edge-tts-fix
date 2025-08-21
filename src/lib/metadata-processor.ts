import { AudioMetadata } from "../main"

export function parseMetadataMessage(
  message: string,
): AudioMetadata | undefined {
  const hasMetadata = message.includes("Path:audio.metadata")
  if (!hasMetadata) return undefined

  const jsonString = message.split("Path:audio.metadata")[1].trim()
  return JSON.parse(jsonString) as AudioMetadata
}
