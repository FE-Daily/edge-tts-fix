import { WEBSOCKET_CONFIG } from "./constants"

async function generateSecMsGec(trustedClientToken: string): Promise<string> {
  const ticks = Math.floor(Date.now() / 1000) + 11644473600
  const rounded = ticks - (ticks % 300)
  const windowsTicks = rounded * 10000000

  const encoder = new TextEncoder()
  const data = encoder.encode(`${windowsTicks}${trustedClientToken}`)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function createUrl(): Promise<URL> {
  const searchParams = new URLSearchParams({
    TrustedClientToken: WEBSOCKET_CONFIG.trustedClientToken,
    "Sec-MS-GEC": await generateSecMsGec(WEBSOCKET_CONFIG.trustedClientToken),
    "Sec-MS-GEC-Version": "1-130.0.2849.68",
    ConnectionId: generateUUID(),
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

export async function createSocket(outputFormat: string): Promise<WebSocket> {
  if (!outputFormat) throw new Error("Output format is required")
  const url = await createUrl()

  const ws = new WebSocket(url.toString())
  const initialMessage = createInitialMessage(outputFormat)
  const { promise, resolve } = Promise.withResolvers<WebSocket>()

  ws.addEventListener("open", () => {
    ws.send(initialMessage)
    resolve(ws)
  })

  return promise
}
