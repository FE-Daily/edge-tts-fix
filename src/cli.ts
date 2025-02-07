#!/usr/bin/env node

import { defineCommand, runMain } from "citty"
import { Buffer } from "node:buffer"
import { writeFile } from "node:fs/promises"

import { getVoices } from "./get-voices"
import { synthesize } from "./synthesize"

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

const synthesizeCommand = defineCommand({
  meta: {
    name: "synthesize",
    description: "Synthesize audio and subtitles from text",
  },
  args: {
    text: {
      type: "positional",
      required: true,
      description: "Text to synthesize",
    },
    audio: {
      type: "string",
      description: "Output audio file name",
      required: true,
    },
    subtitle: {
      type: "string",
      description: "Output subtitle file name",
      required: false,
    },
    voice: {
      type: "string",
      description: "Voice to use (default: en-US-AvaNeural)",
    },
  },
  async run({ args }) {
    try {
      const result = await synthesize({
        text: args.text,
        voice: args.voice,
      })

      // Convert Blob to Buffer and write audio file
      const arrayBuffer = await result.audio.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      await writeFile(args.audio, buffer)

      // Only write subtitle file if subtitle argument was provided
      if (args.subtitle) {
        await writeFile(args.subtitle, JSON.stringify(result.subtitle))
        console.log(`Generated subtitles: ${args.subtitle}`)
      }

      console.log(`Generated audio: ${args.audio}`)
    } catch (error) {
      console.error("Error generating audio:", error)
      process.exit(1)
    }
  },
})

const main = defineCommand({
  meta: {
    name: "@echristian/edge-tts",
    description: "CLI for @echristian/edge-tts",
  },
  subCommands: {
    voices: getVoicesCommand,
    synthesize: synthesizeCommand,
  },
})

void runMain(main)
