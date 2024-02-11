<h1 align="center">Rebebuca</h1>

## Rebebuca 是什么 ？

- Rebebuca 是一个使用 Rust 开发的 桌面端 FFMPEG 管理器
- **可以在30秒内完成创建、运行、管理你的 ffmpeg 命令**
- 帮助我们更好的管理繁多复杂的 ffmpeg 参数和 ffmpeg 命令运行状态

## 功能特性

- 基于项目列表 + 项目详情的交互模式，拥有更好的用户体验
- 支持对 ffmpeg 命令进行增删改查、对命令参数可视化配置、输入联想、手动选择、一键复制等操作
- 支持对 ffmpeg 执行进程进行运行、停止、重启等操作
- 支持对 ffmpeg 命令进行导入导出
- 拥有数据库储存能力，支持数据长期保存
- 支持软件自动更新
- 支持中英语言、深色浅色主题切换
- 支持 mac 和 window 平台

## 下载安装

- Windows 下载地址：[rebebuca.msi](https://download.m7s.live/rb/Rebebuca_0.1.0_x64_en-US.msi)
- Mac 安装下载地址：[rebebuca.dmg](https://download.m7s.live/rb/Rebebuca_0.1.0_x64.dmg)
- Mac(arm64) 安装下载地址：[rebebuca.dmg](https://download.m7s.live/rb/Rebebuca_0.1.0_aarch64.dmg)

## 启动软件

下载安装完成后，启动 rebebuca ，如果是 macOS 系统，启动后可能会出现显示「文件已损坏」现象，

这是因为 Rebebuca 没有签名，会被 macOS 的安全检查所拦下，请按如下方式操作：

信任开发者，会要求输入密码:

```bash
sudo spctl --master-disable
```

然后放行 Rebebuca :

```bash
xattr -cr /Applications/Rebebuca.app
```

然后就能正常打开。

如果提示以下内容

```sh
option -r not recognized

usage: xattr [-slz] file [file ...]
       xattr -p [-slz] attr_name file [file ...]
       xattr -w [-sz] attr_name attr_value file [file ...]
       xattr -d [-s] attr_name file [file ...]
       xattr -c [-s] file [file ...]

The first form lists the names of all xattrs on the given file(s).
The second form (-p) prints the value of the xattr attr_name.
The third form (-w) sets the value of the xattr attr_name to attr_value.
The fourth form (-d) deletes the xattr attr_name.
The fifth form (-c) deletes (clears) all xattrs.

options:
  -h: print this help
  -s: act on symbolic links themselves rather than their targets
  -l: print long format (attr_name: attr_value)
  -z: compress or decompress (if compressed) attribute value in zip format
```

执行命令

```bash
xattr -c /Applications/Rebebuca.app/*
```

如果上述命令依然没有效果，可以尝试下面的命令：

```bash
sudo xattr -d com.apple.quarantine /Applications/Rebebuca.app/
```

成功启动后，会出现下图所示界面：
