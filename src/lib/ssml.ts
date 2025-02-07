export interface SSMLParams {
  requestId: string
  text: string
  voice: string
  language: string
  rate: string
  pitch: string
  volume: string
}

export function createSSMLString(params: SSMLParams): string {
  return `
  X-RequestId:${params.requestId}\r\n
  Content-Type:application/ssml+xml\r\n
  Path:ssml\r\n\r\n

  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${params.language}">
    <voice name="${params.voice}">
      <prosody rate="${params.rate}" pitch="${params.pitch}" volume="${params.volume}">
        ${params.text}
      </prosody>
    </voice>
  </speak>
  `
}
