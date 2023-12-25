import { message } from 'antd'

// ffmpeg -i input.mp4 -c:v h264 -b:v 500k -s 640x480 -f mp4 output.mp4

export function parseFFUrl(ffmpegCmd: string): { key: string; value: string }[] | undefined {
  ffmpegCmd = ffmpegCmd.trim()
  const isFF = ffmpegCmd.startsWith('ffmpeg')
  if (!isFF) {
    message.error('粘贴内容不符合ffmpeg命令行格式')
    return
  }
  const ffmpegArgs: { key: string; value: string }[] = []
  const regex = /-([\w:]+)\s+([\w.]+)|([\w.]+\.[\w.]+)/g
  let match
  while ((match = regex.exec(ffmpegCmd)) !== null) {
    if (match[1] && match[2]) {
      ffmpegArgs.push({ key: match[1], value: match[2] })
    } else if (match[3]) {
      ffmpegArgs.push({ key: '', value: match[3] })
    }
  }
  return ffmpegArgs
}
