import { Command } from '@tauri-apps/api/shell'

// 定义回调函数的类型
type FFmpegCallback = (message: string, status: string) => void;

export const runFFmpeg = async (command: Array<string>, callback: FFmpegCallback) => {
  const ffmpegFrom = localStorage.getItem('ffmpeg')
  let ffmpeg
  if (ffmpegFrom == 'local') {
    ffmpeg = new Command('ffmpeg', '/C ' + 'ffmpeg ' + command.join(' '));
    console.log('use local')
  } else {
    ffmpeg = Command.sidecar('bin/ffmpeg', command)
    console.log('use default')
  }
  ffmpeg.on('close', async ({ code }) => {
    if (code == 0) callback('ffmpeg run success', '0')
    else if (code == 1) callback('ffmpeg run failed', '1')
    else callback('ffmpeg run end', '11')
  })

  // 处理标准输出和错误输出
  const handleOutput = async (line: string) => {
    console.log('line: ', line);
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
