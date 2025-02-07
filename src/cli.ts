import { defineCommand, runMain } from "citty"

import { getVoices } from "./get-voices"

const getVoicesCommand = defineCommand({
  meta: {
    name: "get-voices",
    description: "Get all available voices",
  },
  run: async () => {
    const voices = await getVoices()
    console.log(JSON.stringify(voices))
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
