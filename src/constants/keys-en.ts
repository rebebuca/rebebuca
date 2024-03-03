export const argKeyListEn = [
  {
    label: 'Specify input file',
    value: '-i'
  },
  {
    label: 'Specify the format of the output file',
    value: '-f'
  },
  {
    label: 'Overwrite output file',
    value: '-y'
  },
  {
    label: 'Prohibit overwriting of output files',
    value: '-n'
  },
  {
    label: 'Specify video encoder',
    value: '-c:v'
  },
  {
    label: 'Specify the time length of the output file',
    value: '-t'
  },
  {
    label: 'Display FFmpeg version number',
    value: '-version'
  },
  {
    label: 'Show formats supported by FFmpeg',
    value: '-formats'
  },
  {
    label: 'Show FFmpeg supported encoders and decoders',
    value: '-codecs'
  },
  {
    label: 'Show decoders supported by FFmpeg',
    value: '-decoders'
  },
  {
    label: 'Show FFmpeg supported encoders',
    value: '-encoders'
  },
  {
    label: 'Show bitstream filters supported by FFmpeg',
    value: '-bsfs'
  },
  {
    label: 'Specify the network protocols supported by FFmpeg',
    value: '-protocols'
  },
  {
    label: 'Specify the filter used by FFmpeg when processing video or audio',
    value: '-filters'
  },

  {
    label: 'Specify the pixel format used by FFmpeg when processing videos',
    value: '-pix_fmts'
  },

  {
    label: 'Specify the format of the audio sample',
    value: '-sample_fmts'
  },
  {
    label: 'Specify the layout of the audio channel',
    value: '-layouts'
  },
  {
    label: 'Banner that hides copyright and version information in console output',
    value: '-hide_banner'
  },
  {
    label: 'Control the verbosity of FFmpeg in terminal output',
    value: '-v'
  },

  {
    label: 'Specify the position in the input file to start reading',
    value: '-ss'
  },
  {
    label: 'Display license information',
    value: '-L'
  },
  {
    label: 'Set the title metadata of the output file',
    value: '-title'
  },
  {
    label: 'Set the metadata of the output file',
    value: '-metadata'
  },
  {
    label: 'Specify encoding target',
    value: '-target'
  },
  {
    label: 'Adjust input timestamp',
    value: '-itsoffset'
  },
  {
    label: 'Set audio bitrate',
    value: '-ab'
  },
  {
    label: 'Set audio sampling rate',
    value: '-ar'
  },
  {
    label: 'Set the number of audio channels',
    value: '-ac'
  },
  {
    label: 'Disable audio streaming',
    value: '-an'
  },
  {
    label: 'Specify audio codec',
    value: '-acodec'
  },
  {
    label: 'Specify which FireWire (IEEE 1394) device to use',
    value: '-dv1394'
  },
  {
    label: 'Set the bitrate of the video stream',
    value: '-b:v'
  },
  {
    label: 'Set the bitrate of the audio stream',
    value: '-b:a'
  },
  {
    label: 'Set frame rate',
    value: '-r'
  },
  {
    label: 'Set the resolution of the video',
    value: '-s'
  },
  {
    label:
      'Read data at local frame rate, mainly used to simulate a collection device, or real-time input stream',
    value: '-re'
  },
  {
    label:
      'Set the aspect ratio of the video (Aspect Ratio). The aspect ratio refers to the aspect ratio of the video frame, which determines the shape of the video when displayed in the player',
    value: '-aspect'
  },
  {
    label:
      'Used to crop the top of the video frame. This parameter can be used to remove unwanted parts at the top of the video frame, such as black borders or title bars',
    value: '-croptop'
  },
  {
    label:
      'Set the size of the top padding in pixel units -padbottom size –padleft size –padright size',
    value: '-padtop '
  },
  {
    label: 'Add padding on top of video frame',
    value: '-padcolor'
  },
  {
    label: 'Disable video streaming',
    value: '-vn'
  },
  {
    label: 'Set the rate control mode of video encoding',
    value: '-bt'
  },
  {
    label: 'Set the maximum bit rate for video encoding',
    value: '-maxrate'
  },
  {
    label: 'Set the minimum bit rate for video encoding',
    value: '-minrate'
  },
  {
    label: 'Set the buffer size for video encoding',
    value: '-bufsize'
  },
  {
    label: 'Specify video codec',
    value: '-vcodec'
  },
  {
    label: 'Control multi-pass encoding process',
    value: '-pass'
  },
  {
    label:
      'Specify the file name used to store the log file during the multi-pass encoding process',
    value: '-passlogfile'
  },
  {
    label: 'Set the interval between keyframes',
    value: '-g'
  },
  {
    label: 'Enable or disable intra prediction encoding',
    value: '-intra'
  },
  {
    label: 'Set the quantization scaling value of the encoder',
    value: '-qscale'
  },
  {
    label: 'Set the minimum quantization value for video encoding',
    value: '-qmin'
  },
  {
    label: 'Set the maximum quantization value of video encoding',
    value: '-qmax'
  },
  {
    label: 'Set the quantization value difference of video encoding',
    value: '-qdiff'
  },
  {
    label: 'Set quantization value compensation for video encoding',
    value: '-qcomp'
  },
  {
    label:
      'Set the value of Initial Complexity, which is a parameter in the H.264 encoder and is used to control the initial complexity of the encoder',
    value: '-rc_init_cplx'
  },
  {
    label: 'Set quantization factor (Quality Factor)',
    value: '-b_qfactor'
  },
  {
    label: 'Set the quantization factor of intra frame',
    value: '-i_qfactor'
  },
  {
    label: 'Set quantization offset',
    value: '-b_qoffset'
  },
  {
    label: 'Set the quantization offset of intra frame',
    value: '-i_qoffset'
  },
  {
    label: 'Set the equivalent mode of Constant Rate Factor (CRF)',
    value: '-rc_eq'
  },
  {
    label: 'Override the default behavior of Constant Rate Factor (CRF)',
    value: '-rc_override'
  },
  {
    label: 'Set motion estimation method',
    value: '-me'
  },
  {
    label: 'Set the algorithm of Discrete Cosine Transform (DCT)',
    value: '-dct_algo'
  },
  {
    label: 'Set the algorithm of Inverse Discrete Cosine Transform (IDCT)',
    value: '-idct_algo'
  },
  {
    label: 'Set the level of error recovery (Error Resilience)',
    value: '-er'
  },
  {
    label: 'Set the level of error concealment',
    value: '-ec'
  },
  {
    label: 'Set the number of inter-frame predictions (B frames)',
    value: '-bf'
  },
  {
    label: 'Set the mode of Macroblock Decision',
    value: '-mbd'
  },
  {
    label: 'Enable or disable the use of four motion vectors (4MV)',
    value: '-4mv'
  },
  {
    label: 'Enable or disable partition mode',
    value: '-part'
  },
  {
    label: 'Enable or disable encoder bug fixes',
    value: '-bug'
  },
  {
    label: 'Set strict standards compatibility',
    value: '-strict'
  },
  {
    label: 'Enable or disable the use of Unidirectional Motion Vectors',
    value: '-umv'
  },
  {
    label: 'Enable or disable deinterlacing processing',
    value: '-deinterlace'
  },
  {
    label: 'Enable or disable interlacing processing',
    value: '-interlace'
  },
  {
    label: 'Enable or disable the calculation of Peak Signal-to-Noise Ratio (PSNR)',
    value: '-psnr'
  },
  {
    label: 'Copy video encoding statistics to vstats_HHMMSS.log',
    value: '-vstats'
  },
  {
    label: 'Select which streams in the input file should be processed',
    value: '-map'
  },
  {
    label: 'Set debugging level',
    value: '-debug'
  },
  {
    label: 'Run benchmark',
    value: '-benchmark'
  },
  {
    label:
      'Dump various components of media files (such as video, audio, subtitles, etc.) into files for easy analysis and debugging',
    value: '-dump'
  },
  {
    label: 'Set the number of loops for the input file',
    value: '-loop'
  },
  {
    label: 'Set the number of threads used for video encoding and decoding',
    value: '-threads'
  },
  {
    label: 'Show help information',
    value: '-h'
  }
]
