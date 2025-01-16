import { describe, it, expect, beforeEach } from "vitest"

import { createSSMLString, SSMLParams } from "../../src/lib/ssml"

describe("createSSMLString", () => {
  let defaultParams: SSMLParams

  beforeEach(() => {
    defaultParams = {
      requestId: "test-id",
      text: "Hello world",
      voice: "en-US-AvaNeural",
      language: "en-US",
      rate: "default",
      pitch: "default",
      volume: "default",
    }
  })

  describe("basic functionality", () => {
    it("should create correct SSML string with default parameters", () => {
      const result = createSSMLString(defaultParams)

      expect(result).toContain(`X-RequestId:${defaultParams.requestId}`)
      expect(result).toContain(`xml:lang="${defaultParams.language}"`)
      expect(result).toContain(`voice name="${defaultParams.voice}"`)
      expect(result).toContain(defaultParams.text)
      expect(result).toContain(`<speak`)
      expect(result).toContain(`</speak>`)
    })
  })

  describe("input validation", () => {
    it("should throw error for empty text", () => {
      expect(() => createSSMLString({ ...defaultParams, text: "" })).toThrow(
        "Text cannot be empty",
      )
    })

    it("should throw error for text exceeding maximum length", () => {
      const longText = "a".repeat(10001)
      expect(() =>
        createSSMLString({ ...defaultParams, text: longText }),
      ).toThrow("Text exceeds maximum length of 10000 characters")
    })

    it("should throw error for invalid voice format", () => {
      expect(() =>
        createSSMLString({
          ...defaultParams,
          voice: "invalid-voice",
        }),
      ).toThrow("Invalid voice format")
    })
  })
})
