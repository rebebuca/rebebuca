import dayjs from 'dayjs'
import { BaseDirectory, writeBinaryFile, exists } from '@tauri-apps/api/fs'


function stringToArrayBuffer(data: string): ArrayBuffer {
  return new TextEncoder().encode(data).buffer;
  // return new Promise(resolve => {
  //   const b = new Blob([data])
  //   const f = new FileReader()
  //   f.onload = e => {
  //     resolve(e.target?.result as ArrayBuffer)
  //   }
  //   f.readAsArrayBuffer(b)
  // })
}

export async function writeFileToDownload(file: string, data: ArrayBuffer) {
  // const arr = file.split('.')
  // let baseFileName = arr[0]
  // let ext = ''
  // if (arr.length >= 2) {
  //   baseFileName = arr.slice(0, arr.length - 1).join('.')
  //   ext = `.${arr[arr.length - 1]}`
  // }

  const [baseFileName, ext = ''] = file.lastIndexOf('.') !== -1
  ? [file.slice(0, file.lastIndexOf('.')), file.slice(file.lastIndexOf('.'))]
  : [file, ''];


  const opt = {
    dir: BaseDirectory.Download
  }

  // 如果有重名的，则数字+1
  for (let i = 0; ; i++) {
    // const file = (i === 0 ? baseFileName : `${baseFileName}-${i}`) + ext
    const newName = `${baseFileName}${i ? `-${i}` : ''}${ext}`;
    if (!await exists(newName, opt)) {
      await writeBinaryFile(newName, data, opt);
      return;
    }
    // const fileExists = await exists(file, opt)
    // if (!fileExists) {
    //   await writeBinaryFile(file, data, opt)
    //   return
    // }
  }
  // throw new Error(`file(${file}) exist`)
}

export async function writeSettingToDownload(arr: unknown, name: string) {
  // const now = dayjs()
  const unix = dayjs().unix()
  // const unix = now.unix()
  // const nowString = now.format('YY-MM-DD-HH-mm-ss')
  const data = JSON.stringify(arr, null, 4)
  const buf = await stringToArrayBuffer(data)
  await writeFileToDownload(`${name}-rb-${unix}.json`, buf)
}
