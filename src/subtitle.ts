import { AUDIO_CONSTANTS } from "./lib/constants"
import { ParseSubtitleOptions, ParseSubtitleResult } from "./types/subtitle"

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
  wordsPerCue,
  durationPerCue,
  metadata,
}: ParseSubtitleOptions): Array<ParseSubtitleResult> {
  const simplified = metadata.map((meta) => ({
    text: meta.Metadata[0].Data.text.Text,
    offset: convertToMs(meta.Metadata[0].Data.Offset),
    duration: convertToMs(meta.Metadata[0].Data.Duration),
  }))

  if (splitBy === "duration") {
    if (durationPerCue === undefined)
      throw new Error(
        "durationPerCue option must be provided when splitting by duration",
      )

    return simplified.reduce<Array<ParseSubtitleResult>>(
      (prev, curr, index) => {
        if (
          (prev.at(-1)?.duration ?? 0) + curr.duration > durationPerCue ||
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

  // Because in runtime there is no type checking
  // we need to explicitly check if splitBy is equals to "word"
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (splitBy === "word") {
    if (wordsPerCue === undefined)
      throw new Error(
        "wordsPerCue option must be provided when splitting by word",
      )

    return simplified.reduce<Array<ParseSubtitleResult>>(
      (prev, curr, index) => {
        const wordCount = prev.at(-1)?.text.split(/\s+/).length ?? 0

        if (wordCount >= wordsPerCue || index === 0) {
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

  throw new Error("Invalid splitBy option")
}
