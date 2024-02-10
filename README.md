<h1 align="center">Rebebuca</h1>

> 一个好用的 ffmpeg 管理器

## FAQ

### 1. macOS 系统安装完后显示「文件已损坏」或者安装完打开没有反应

因为 Rebebuca 没有签名，所以会被 macOS 的安全检查所拦下。

1. 安装后打开遇到「文件已损坏」的情况，请按如下方式操作：

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

