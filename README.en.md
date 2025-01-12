<h1 align="center">Rebebuca</h1>

https://rebebuca.com

## What is Rebebuca?

- Rebebuca is a desktop FFMPEG manager developed in Rust
- **Create, run, and manage your ffmpeg commands in 30 seconds**
![](./docs/quick.gif)
- Help us better manage the numerous and complex ffmpeg parameters and ffmpeg command running status

## Features

- ffmpeg command full cycle management
   - Supports ffmpeg command operations such as running, stopping, and restarting
   - Supports visual configuration of ffmpeg command parameters and import of terminal commands
   - Support management of various ffmpeg commands by project dimensions
   - Support data export
- List + details interactive mode
- Supports ffmpeg source switching, Chinese and English languages, dark and light theme switching, and window closing method selection
![](./docs/config.gif)
- Support automatic software updates
- Support mac and window platforms
- Easy to use, rich in capabilities, and long-term maintenance

## Download and install

- Windows download address: [rebebuca.msi](https://download.m7s.live/rb/Rebebuca_0.2.2_x64_en-US.msi)
- Mac installation download address: [rebebuca.dmg](https://download.m7s.live/rb/Rebebuca_0.2.2_x64.dmg)
- Mac(arm64) installation download address: [rebebuca-arm64.dmg](https://download.m7s.live/rb/Rebebuca_0.2.2_aarch64.dmg)

## Get started quickly

Please click on the official document link below to view:

https://rebebuca.com/guide/startup.html

## Sponsor

<table>
<tr>
<td>Alipay</td>
<td>WeChat</td>
</tr>
<tr>
<td>
<img src="./docs/zfb-pay.jpg" width="180" height="180" alt="Alipay appreciation code">
</td>
<td>
<img src="./docs/wx-pay.jpg" width="180" height="180" alt="WeChat Appreciation Code"></td>
</tr>
</table>

## Technical Support

<img src="https://rebebuca.com/author.jpg" alt="author" width="200" height="200">

## Contribute code

## Contribute code

- Build environment:
   - cargo version >= 1.70.0
   - pnpm version >= 8
   - node version >= 20

- Pull code: `git clone git@github.com:rebebuca/rebebuca.git`
- Install dependencies: `pnpm i`
   - After executing `pnpm i`, the `preintsall` command will be automatically executed to check whether the environment meets the requirements and download the `ffmpeg` binary file to the `src-tauri/bin` directory.
- Start Rebebuca: `pnpm tauri dev`