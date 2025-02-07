import { defineCommand, runMain } from "citty"

import { getVoices } from "./get-voices"

const getVoicesCommand = defineCommand({
  meta: {
    name: "get-voices",
    description: "Get all available voices",
  },
  run: async () => {
    const voices = await getVoices()

    // Group voices by locale
    const voicesByLocale = voices.reduce<Record<string, typeof voices>>(
      (acc, voice) => {
        // When first inserting, value can be undefined
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!acc[voice.Locale]) {
          acc[voice.Locale] = []
        }
        acc[voice.Locale].push(voice)
        return acc
      },
      {},
    )

    // Print voices grouped by locale
    Object.entries(voicesByLocale)
      .sort(([localeA], [localeB]) => localeA.localeCompare(localeB))
      .forEach(([locale, localeVoices]) => {
        console.log(`\n${locale}:`)
        localeVoices.forEach((voice) => {
          console.log(`  ${voice.ShortName}`)
        })
      })
  },
})

const main = defineCommand({
  meta: {
    name: "@echristian/edge-tts",
    description: "CLI for @echristian/edge-tts",
  },
  subCommands: {
    voices: getVoicesCommand,
  },
})

void runMain(main)
