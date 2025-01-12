<h1 align="center">Rebebuca</h1>

<p align="center">
<b> 简体中文 </b> | <a href="https://github.com/rebebuca/rebebuca/blob/main/README.en.md"> English </a>
</p>

https://rebebuca.com

## Rebebuca 是什么

- Rebebuca 是一个使用 Rust 开发的 桌面端 FFMPEG 管理器
- **可以在30秒内完成创建、运行、管理你的 ffmpeg 命令**
![](./docs/quick.gif)
- 帮助我们更好的管理繁多复杂的 ffmpeg 参数和 ffmpeg 命令运行状态

## 功能特性

- ffmpeg 命令全周期管理
  - 支持 ffmpeg 命令运行、停止、重启等操作
  - 支持 ffmpeg 命令参数可视化配置、导入终端命令
  - 支持 按项目维度管理各种 ffmpeg 命令
  - 支持 数据导出
- 列表+详情交互模式
- 支持 ffmpeg 源切换、中英语言、深色浅色主题切换、窗口关闭方式选择
![](./docs/config.gif)
- 支持软件自动更新
- 支持 mac 和 window 平台
- 简单好用、能力丰富、长期维护

## 下载安装

- Windows 下载地址：[rebebuca.msi](https://download.m7s.live/rb/Rebebuca_0.2.1_x64_en-US.msi)
- Mac 安装下载地址：[rebebuca.dmg](https://download.m7s.live/rb/Rebebuca_0.2.1_x64.dmg)
- Mac(arm64) 安装下载地址：[rebebuca-arm64.dmg](https://download.m7s.live/rb/Rebebuca_0.2.1_aarch64.dmg)

## 快速上手

请点击下方官方文档链接进行查看：

https://rebebuca.com/guide/startup.html


## 赞助作者

<table>
<tr>
<td>支付宝</td>
<td>微信</td>
</tr>
<tr>
<td>
<img src="./docs/zfb-pay.jpg" width="180" height="180" alt="支付宝赞赏码">
</td>
<td>
<img src="./docs/wx-pay.jpg" width="180" height="180" alt="微信赞赏码"></td>
</tr>
</table>

## 技术支持

<img src="https://rebebuca.com/author.jpg" alt="author" width="200" height="200">


## 贡献代码

- 搭建环境：
  - cargo version >= 1.70.0
  - pnpm version >= 8
  - node version >= 20

- 拉取代码：`git clone git@github.com:rebebuca/rebebuca.git`
- 安装依赖：`pnpm i`
  - 执行完 `pnpm i` 后，会自动执行 `preintsall` 命令，检测环境是否符合要求以及下载 `ffmpeg` 二进制文件到 `src-tauri/bin` 目录下
- 启动 Rebebuca ：`pnpm tauri dev`





