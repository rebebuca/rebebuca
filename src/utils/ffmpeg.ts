import { Command } from '@tauri-apps/api/shell'

// 定义回调函数的类型
type FFmpegCallback = (message: string, status: string) => void

export const runFFmpeg = async (command: Array<string>, callback: FFmpegCallback) => {
  const ffmpegFrom = localStorage.getItem('ffmpeg')
  const os = localStorage.getItem('os')
  let ffmpeg
  if (ffmpegFrom == 'local') {
    if (os == 'win32') {
      ffmpeg = new Command('ffmpeg', '/C ' + 'ffmpeg ' + command.join(' '))
    } else {
      // TODO: mac
      ffmpeg = new Command('ffmpeg', '/C ' + 'ffmpeg ' + command.join(' '))
    }
  } else {
    ffmpeg = Command.sidecar('bin/ffmpeg', command)
  }
  ffmpeg.on('close', async ({ code }) => {
    if (code == 0) callback('ffmpeg run success', '0')
    else if (code == 1) callback('ffmpeg run failed', '1')
    else if (code == 254) callback('ffmpeg run failed', '1')
    else callback('ffmpeg run end', '11')
  })

  // 处理标准输出和错误输出
  const handleOutput = async (line: string) => {
    callback(line, '12')
  }

  ffmpeg.stderr.on('data', handleOutput)
  ffmpeg.stdout.on('data', handleOutput)

  try {
    const child = await ffmpeg.spawn()
    return child
  } catch (error) {
    callback(`Error spawning ffmpeg process: ${error}`, '99')
  }
}
