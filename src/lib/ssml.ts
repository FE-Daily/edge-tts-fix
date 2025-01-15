interface SSMLParams {
  requestId: string
  text: string
  voice: string
  language: string
  rate: string
  pitch: string
  volume: string
}

export function createSSMLString(params: SSMLParams): string {
  const { requestId, text, voice, language, rate, pitch, volume } = params
  return `
  X-RequestId:${requestId}\r\n
  Content-Type:application/ssml+xml\r\n
  Path:ssml\r\n\r\n

  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
    <voice name="${voice}">
      <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
        ${text}
      </prosody>
    </voice>
  </speak>
  `
}
