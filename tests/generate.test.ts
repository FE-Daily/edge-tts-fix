import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { generate } from "../src/generate"
import { DEFAULT_OPTIONS } from "../src/lib/config"
import * as ttsConnection from "../src/lib/tts-connection"
import * as ttsProcessor from "../src/lib/tts-processor"

// Mock WebSocket
class MockWebSocket {
  addEventListener = vi.fn()
  send = vi.fn()
  close = vi.fn()
}

describe("generate", () => {
  beforeEach(() => {
    // Mock the crypto.randomUUID
    vi.stubGlobal("crypto", {
      randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it("should generate audio with default options", async () => {
    // Mock the WebSocket creation
    const mockSocket = new MockWebSocket()
    vi.spyOn(ttsConnection, "createSocket").mockResolvedValue(
      mockSocket as unknown as WebSocket,
    )

    // Mock the TTS processor
    const mockResult = {
      audio: new Blob(["test-audio"]),
      subtitle: [
        {
          text: "test",
          start: 0,
          end: 1000,
          duration: 1000,
        },
      ],
    }
    vi.spyOn(ttsProcessor, "handleTTSConnection").mockResolvedValue(mockResult)

    const result = await generate({
      text: "Hello world",
    })

    expect(ttsConnection.createSocket).toHaveBeenCalledWith(
      DEFAULT_OPTIONS.outputFormat,
    )
    expect(mockSocket.send).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResult)
  })

  it("should generate audio with custom options", async () => {
    const mockSocket = new MockWebSocket()
    vi.spyOn(ttsConnection, "createSocket").mockResolvedValue(
      mockSocket as unknown as WebSocket,
    )

    const mockResult = {
      audio: new Blob(["custom-audio"]),
      subtitle: [
        {
          text: "test",
          start: 0,
          end: 1000,
          duration: 1000,
        },
      ],
    }
    vi.spyOn(ttsProcessor, "handleTTSConnection").mockResolvedValue(mockResult)

    const customOptions = {
      text: "Hello world",
      voice: "en-US-ChristopherNeural",
      rate: "slow",
      pitch: "high",
      volume: "loud",
      subtitle: {
        splitBy: "duration" as const,
        durationPerCue: 3000,
      },
    }

    const result = await generate(customOptions)

    expect(ttsConnection.createSocket).toHaveBeenCalledWith(
      DEFAULT_OPTIONS.outputFormat,
    )
    expect(mockSocket.send).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockResult)
  })

  it("should handle errors gracefully", async () => {
    vi.spyOn(ttsConnection, "createSocket").mockRejectedValue(
      new Error("Connection failed"),
    )

    await expect(
      generate({
        text: "Hello world",
      }),
    ).rejects.toThrow("Connection failed")
  })
})
