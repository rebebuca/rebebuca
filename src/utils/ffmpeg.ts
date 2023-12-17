import { shell, dialog } from '@tauri-apps/api'
const { Command } = shell
export const { open, message } = dialog

export const runFFmpeg = async (command: Array<string>, callback: Function) => {
  // 拿到对象
  const ffmpeg = Command.sidecar('bin/ffmpeg', command)
  // const ffmpeg = Command.sidecar('bin/ffmpeg', ['-version'])
  // const ffmpeg = Command.sidecar('bin/ffmpeg', ['-i', '/Users/vivo/Desktop/kun.flv', '-f', 'flv', '-c:v', 'h264', 'rtmp://localhost/live/test'])
  // const ffmpeg = Command.sidecar('bin/ffmpeg', ['-i', 'file:///Users/vivo/Downloads/6b25b1db2d4abcb6f1ef3cdcebefa791.mp4', '-acodec', 'aac', 'test.flv'])
  // 注册子进程关闭事件
  ffmpeg.on('close', async ({ code }) => {
    // callback(`ffmpeg params：${command.join(' ')}`, '12')
    if (code == 0) callback('ffmpeg run success', '0')
    else if (code == 1) callback('ffmpeg run failed', '1')
    else callback('ffmpeg run end', '11')
  })

  // ffmpeg.stdout.on('data', line => {
  //   callback(line, '12')
  // })

  // 注册子进程异常事件
  // ffmpeg.on('error', async (error) => {
  // })

  async function fn(line: string) {
    callback(line, '12')
  }

  ffmpeg.stderr.on('data', fn)
  ffmpeg.stdout.on('data', fn)

  // ffmpeg.stderr.on('data', throttle(fn, 10))
  // ffmpeg.stdout.on('data', throttle(fn, 10))

  const child1 = await ffmpeg.spawn()
  return child1
}
