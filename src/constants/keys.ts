export const argKeyList = [
  {
    label: '指定输入文件',
    value: '-i'
  },
  {
    label: '指定输出文件的格式',
    value: '-f'
  },
  {
    label: '覆盖输出文件',
    value: '-y'
  },
  {
    label: '禁止覆盖输出文件',
    value: '-n'
  },
  {
    label: '指定视频编码器',
    value: '-c:v'
  },
  {
    label: '指定输出文件的时间长度',
    value: '-t'
  },
  {
    label: '显示FFmpeg的版本号',
    value: '-version'
  },
  {
    label: '显示FFmpeg支持的格式',
    value: '-formats'
  },
  {
    label: '显示FFmpeg支持的编码器和解码器',
    value: '-codecs'
  },
  {
    label: '显示FFmpeg支持的解码器',
    value: '-decoders'
  },
  {
    label: '显示FFmpeg支持的编码器',
    value: '-encoders'
  },
  {
    label: '显示FFmpeg支持的比特流过滤器',
    value: '-bsfs'
  },
  {
    label: '指定FFmpeg支持的网络协议',
    value: '-protocols'
  },
  {
    label: '指定FFmpeg在处理视频或音频时使用的过滤器',
    value: '-filters'
  },

  {
    label: '指定FFmpeg在处理视频时使用的像素格式',
    value: '-pix_fmts'
  },

  {
    label: '指定音频样本的格式',
    value: '-sample_fmts'
  },
  {
    label: '指定音频通道的布局',
    value: '-layouts'
  },
  {
    label: '控制台输出中隐藏版权和版本信息的横幅',
    value: '-hide_banner'
  },
  {
    label: '控制 FFmpeg 在终端输出中的详细程度',
    value: '-v'
  },

  {
    label: '指定输入文件中开始读取的位置',
    value: '-ss'
  },
  {
    label: '显示许可证信息',
    value: '-L'
  },
  {
    label: '设置输出文件的标题元数据',
    value: '-title'
  },
  {
    label: '设置输出文件的元数据',
    value: '-metadata'
  },
  {
    label: '指定编码目标',
    value: '-target'
  },
  {
    label: '调整输入时间戳',
    value: '-itsoffset'
  },
  {
    label: '设置音频比特率',
    value: '-ab'
  },
  {
    label: '设置音频采样率',
    value: '-ar'
  },
  {
    label: '设置音频通道数',
    value: '-ac'
  },
  {
    label: '禁止音频流',
    value: '-an'
  },
  {
    label: '指定音频编解码器',
    value: '-acodec'
  },
  {
    label: '指定使用哪种 FireWire (IEEE 1394) 设备',
    value: '-dv1394'
  },
  {
    label: '设置视频流的比特率',
    value: '-b:v'
  },
  {
    label: '设置音频流的比特率',
    value: '-b:a'
  },
  {
    label: '设置帧率',
    value: '-r'
  },
  {
    label: '设置视频的分辨率',
    value: '-s'
  },
  {
    label: '以本地帧率读取数据，主要用来模拟一个采集设备，或者实时输入流',
    value: '-re'
  },
  {
    label:
      '设置视频的纵横比（Aspect Ratio），纵横比是指视频帧的宽高比，它决定了视频在播放器中显示时的形状',
    value: '-aspect'
  },
  {
    label: '用于裁剪视频帧的顶部。这个参数可以用来去除视频帧顶部不需要的部分，例如黑边或标题栏',
    value: '-croptop'
  },
  {
    label: '设置顶部补齐的大小 像素单位 -padbottom size –padleft size –padright size',
    value: '-padtop '
  },
  {
    label: '在视频帧的顶部添加填充',
    value: '-padcolor'
  },
  {
    label: '禁用视频流',
    value: '-vn'
  },
  {
    label: '设置视频编码的码率控制模式',
    value: '-bt'
  },
  {
    label: '设置视频编码的最大码率',
    value: '-maxrate'
  },
  {
    label: '设置视频编码的最小码率',
    value: '-minrate'
  },
  {
    label: '设置视频编码的缓冲区大小',
    value: '-bufsize'
  },
  {
    label: '指定视频编解码器',
    value: '-vcodec'
  },
  {
    label: '控制多传（Multi-pass）编码过程',
    value: '-pass'
  },
  {
    label: '指定多传编码过程中用于存储日志文件的文件名',
    value: '-passlogfile'
  },
  {
    label: '设置关键帧之间的间隔',
    value: '-g'
  },
  {
    label: '启用或禁用帧内预测编码',
    value: '-intra'
  },
  {
    label: '设置编码器的量化缩放值',
    value: '-qscale'
  },
  {
    label: '设置视频编码的最小量化值',
    value: '-qmin'
  },
  {
    label: '设置视频编码的最大量化值',
    value: '-qmax'
  },
  {
    label: '设置视频编码的量化值差',
    value: '-qdiff'
  },
  {
    label: '设置视频编码的量化值补偿',
    value: '-qcomp'
  },
  {
    label:
      '设置初始复杂度（Initial Complexity）的值，它是 H.264 编码器中的一个参数，用于控制编码器的初始复杂度',
    value: '-rc_init_cplx'
  },
  {
    label: '设置量化因子（Quality Factor）',
    value: '-b_qfactor'
  },
  {
    label: '设置帧内（Intra）帧的量化因子',
    value: '-i_qfactor'
  },
  {
    label: '设置量化偏移',
    value: '-b_qoffset'
  },
  {
    label: '设置帧内（Intra）帧的量化偏移',
    value: '-i_qoffset'
  },
  {
    label: '设置恒定量化参数（Constant Rate Factor, CRF）的等价模式',
    value: '-rc_eq'
  },
  {
    label: '覆盖恒定量化参数（Constant Rate Factor, CRF）的默认行为',
    value: '-rc_override'
  },
  {
    label: '设置运动估计方法',
    value: '-me'
  },
  {
    label: '设置离散余弦变换（Discrete Cosine Transform, DCT）的算法',
    value: '-dct_algo'
  },
  {
    label: '设置逆离散余弦变换（Inverse Discrete Cosine Transform, IDCT）的算法',
    value: '-idct_algo'
  },
  {
    label: '设置错误恢复（Error Resilience）的级别',
    value: '-er'
  },
  {
    label: '设置错误 concealment（错误掩蔽）的级别',
    value: '-ec'
  },
  {
    label: '设置帧间预测（B帧）的数量',
    value: '-bf'
  },
  {
    label: '设置宏块决策（Macroblock Decision）的模式',
    value: '-mbd'
  },
  {
    label: '启用或禁用四运动矢量（4MV）的使用',
    value: '-4mv'
  },
  {
    label: '启用或禁用划分（Partition）模式',
    value: '-part'
  },
  {
    label: '启用或禁用编码器的 bug 修复',
    value: '-bug'
  },
  {
    label: '设置严格的标准兼容性',
    value: '-strict'
  },
  {
    label: '启用或禁用无运动矢量（Unidirectional Motion Vectors）的使用',
    value: '-umv'
  },
  {
    label: '启用或禁用去隔行扫描（Deinterlacing）的处理',
    value: '-deinterlace'
  },
  {
    label: '启用或禁用隔行扫描（Interlacing）的处理',
    value: '-interlace'
  },
  {
    label: '启用或禁用峰值信噪比（Peak Signal-to-Noise Ratio, PSNR）的计算',
    value: '-psnr'
  },
  {
    label: '复制视频编码统计信息到vstats_HHMMSS.log',
    value: '-vstats'
  },
  {
    label: '选择输入文件中的哪些流（streams）应该被处理',
    value: '-map'
  },
  {
    label: '设置调试级别',
    value: '-debug'
  },
  {
    label: '运行基准测试',
    value: '-benchmark'
  },
  {
    label: '将媒体文件的各个组成部分（如视频、音频、字幕等）转储到文件中，以便于分析和调试',
    value: '-dump'
  },
  {
    label: '设置输入文件的循环次数',
    value: '-loop'
  },
  {
    label: '设置用于视频编码和解码的线程数',
    value: '-threads'
  },
  {
    label: '显示帮助信息',
    value: '-h'
  }
]
