#!/usr/bin/env zx

import { $, fs, os, chalk, echo } from 'zx'
import process from 'process'
const arch = await `${os.arch()}`
const platform = await `${os.platform()}`

process.on('SIGINT', async () => {
  await $.spawn('rm', ['-rf', './src-tauri/bin'])
  console.log(
    chalk.red(
      '\n\nThe operation has been terminated. If you want to continue, please execute pnpm i again. \n'
    )
  )
})

let cargoVersion = await $`cargo version`.quiet()
let nodeVersion = await $`node -v`.quiet()
let pnpmVersion = await $`pnpm -v`.quiet()

nodeVersion = nodeVersion.stdout.replace(/[\r\n]+/g, '')
cargoVersion = cargoVersion.stdout.replace(/[\r\n]+/g, '')
pnpmVersion = pnpmVersion.stdout.replace(/[\r\n]+/g, '')
const versionRegex = /cargo\s+(\d+\.\d+\.\d+)/
cargoVersion = cargoVersion.match(versionRegex)[1]

if (cargoVersion < '1.70.0') {
  echo(
    chalk.red(
      `cargo version: ${cargoVersion}  --> [The minimum version needs to be above 1.70.0. Please execute "rustup update" command to upgrade.]`
    )
  )
} else {
  echo(chalk.blue(`cargo version: ${cargoVersion}`))
}

if (pnpmVersion < '8.0.0') {
  echo(
    chalk.red(
      `pnpm  version: ${pnpmVersion}  --> [The minimum version needs to be above 8.0.0. Please execute "npm i pnpm -g" command to upgrade.]`
    )
  )
} else {
  echo(chalk.blue(`pnpm  version: ${pnpmVersion}`))
}

if (nodeVersion < 'v20.0.0') {
  const str = chalk.red(
    `node  version: ${nodeVersion} --> [The minimum version needs to be above 20.0.0. Please upgrade.]`
  )
  echo(str)
} else {
  echo(chalk.blue(`node  version: ${nodeVersion}`))
}

if (nodeVersion >= 'v20.0.0' && pnpmVersion >= '8.0.0' && cargoVersion >= '1.70.0') {
  await fs.ensureDir('./src-tauri/bin')
  if (platform == 'darwin') {
    if (arch == 'x64') {
      const exist = await fs.pathExists('./src-tauri/bin/ffmpeg-x86_64-apple-darwin')
      if (!exist) {
        $`curl -o ./src-tauri/bin/ffmpeg-x86_64-apple-darwin https://download.m7s.live/bin/ffmpeg-x86_64-apple-darwin`
      }
      echo(chalk.green(`check success! please execute "pnpm tauri dev" to open rebebuca.`))
    }
    if (arch == 'arm64') {
      const exist = await fs.pathExists('./src-tauri/bin/ffmpeg-aarch64-apple-darwin')
      if (!exist)
        $`curl -o ./src-tauri/bin/ffmpeg-aarch64-apple-darwin https://download.m7s.live/bin/ffmpeg-aarch64-apple-darwin`
      echo(chalk.green(`check success! please execute "pnpm tauri dev" to open rebebuca.`))
    }
  }
  if (platform == 'win32') {
    const exist = await fs.pathExists('./src-tauri/bin/ffmpeg-x86_64-pc-windows-msvc.exe')
    if (!exist)
      $`curl -o ./src-tauri/bin/ffmpeg-x86_64-pc-windows-msvc.exe https://download.m7s.live/bin/ffmpeg-x86_64-pc-windows-msvc.exe`
    echo(chalk.green(`check success! please execute "pnpm tauri dev" to open rebebuca.`))
  }
} else {
  echo(chalk.yellow('\nExecution failed. Please fix the red content.'))
}
