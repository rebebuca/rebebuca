import { Command } from '@tauri-apps/api/shell'

export const runFFmpeg = async (command: Array<string>, callback: Function) => {
  const ffmpeg = Command.sidecar('bin/ffmpeg', command)

  ffmpeg.on('close', async ({ code }) => {
    if (code == 0) callback('ffmpeg run success', '0')
    else if (code == 1) callback('ffmpeg run failed', '1')
    else callback('ffmpeg run end', '11')
  })

  async function fn(line: string) {
    callback(line, '12')
  }

  ffmpeg.stderr.on('data', fn)
  ffmpeg.stdout.on('data', fn)

  const child = await ffmpeg.spawn()
  return child
}
