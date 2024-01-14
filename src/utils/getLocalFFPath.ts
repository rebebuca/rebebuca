import { Command } from "@tauri-apps/api/shell"

export const getLocalFFPath = async () => {
  const isDev = process.env.NODE_ENV === 'development'
  const os = localStorage.getItem('os')
  if (os == 'win32') {
    if (isDev) return 'ffmpeg'
    else {
      const ffPath = await new Command('ffmpeg', '/C where ffmpeg').execute()
      let path = ffPath.stdout.trim()
      const moreOne = path.includes('\r\n\n')
      if (!moreOne) {
        return ''
      } else {
        path = path.replace(/\r\n/g, '')
        path = path.split('\n')[1]
        return path
      }
    }
  } else return 'ffmpeg'
}