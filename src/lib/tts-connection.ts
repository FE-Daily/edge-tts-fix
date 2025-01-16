import { WEBSOCKET_CONFIG } from "./config"

function createUrl(): URL {
  const searchParams = new URLSearchParams({
    TrustedClientToken: WEBSOCKET_CONFIG.trustedClientToken,
  })

  const url = new URL(WEBSOCKET_CONFIG.path, WEBSOCKET_CONFIG.baseUrl)
  url.search = searchParams.toString()
  return url
}

function createInitialMessage(outputFormat: string): string {
  return `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n
    {
      "context": {
        "synthesis": {
          "audio": {
            "metadataoptions": {
              "sentenceBoundaryEnabled": "false",
              "wordBoundaryEnabled": "true"
            },
            "outputFormat": "${outputFormat}"
          }
        }
      }
    }`
}

export function createSocket(outputFormat: string): Promise<WebSocket> {
  if (!outputFormat) throw new Error("Output format is required")

  const ws = new WebSocket(createUrl().toString())
  const initialMessage = createInitialMessage(outputFormat)
  const { promise, resolve } = Promise.withResolvers<WebSocket>()

  ws.addEventListener("open", () => {
    ws.send(initialMessage)
    resolve(ws)
  })

  return promise
}
