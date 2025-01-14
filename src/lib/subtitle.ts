import { AUDIO_CONSTANTS } from "../constants"
import { ParseSubtitleOptions, ParseSubtitleResult } from "../types"

const convertToMs = (duration: number) =>
  Math.floor(duration / AUDIO_CONSTANTS.TIME_FACTOR)

/**
 * Parses the metadata sent throughout the websocket connection and returns it as an array of object.
 *
 * @param options Options for parsing the subtitle
 * @returns The parsed subtitle array
 */
export function parseSubtitle({
  splitBy,
  count,
  metadata,
}: ParseSubtitleOptions): Array<ParseSubtitleResult> {
  const simplified = metadata.map((meta) => ({
    text: meta.Metadata[0].Data.text.Text,
    offset: convertToMs(meta.Metadata[0].Data.Offset),
    duration: convertToMs(meta.Metadata[0].Data.Duration),
  }))

  if (splitBy === "duration") {
    if (count === undefined)
      throw new Error(
        "Count option must be provided when splitting by duration",
      )

    return simplified.reduce<Array<ParseSubtitleResult>>(
      (prev, curr, index) => {
        if (
          (prev.at(-1)?.duration ?? 0) + curr.duration > count ||
          index === 0
        ) {
          prev.push({
            text: curr.text,
            start: curr.offset,
            duration: curr.duration,
            end: curr.offset + curr.duration,
          })
        } else {
          prev[prev.length - 1].end = curr.offset + curr.duration
          prev[prev.length - 1].text += ` ${curr.text}`
          prev[prev.length - 1].duration =
            prev[prev.length - 1].end - prev[prev.length - 1].start
        }

        return prev
      },
      [],
    )
  }

  if (splitBy === "word") throw new Error("Not implemented")
  if (splitBy === "sentence") throw new Error("Not implemented")

  throw new Error("Invalid splitBy option")
}
