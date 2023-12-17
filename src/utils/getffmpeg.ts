import { resourceDir, join } from '@tauri-apps/api/path'

/**
 * @description  获取`ffmpeg`的路径
 * @returns      返回`ffmpeg`的路径
 */
export async function getffmpeg() {
  const resourcePath = await resourceDir()
  const ffmpeg = await join(resourcePath, '_up_', 'ffmpeg', 'bin', 'ffmpeg.exe')
  const realesrgan = await join(resourcePath, '_up_', 'realesrgan', 'realesrgan-ncnn-vulkan.exe')
  return [ffmpeg.replaceAll('\\', '/').slice(4), realesrgan.replaceAll('\\', '/').slice(4)]
}
