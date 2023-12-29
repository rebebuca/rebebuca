import { message } from 'antd'

type FFmpegArgument = {
    key: string;
    value: string;
};

export function parseFFUrl(ffmpegCmd: string): FFmpegArgument[] | undefined {

    ffmpegCmd = ffmpegCmd.trim()
    const isFFmpegCommand = ffmpegCmd.startsWith('ffmpeg')
    if (!isFFmpegCommand) {
        message.error('粘贴内容不符合ffmpeg命令行格式')
        return
    }


    // 分割命令行为单词数组
    const words: string[] = ffmpegCmd.split(/\s+/);

    // 初始化结果数组
    const result: FFmpegArgument[] = [];

    // 用于记录当前处理的key和是否已经找到对应的value
    let currentKey: string | null = null;
    let foundValueForCurrentKey: boolean = false;

    // 遍历单词数组
    for (let i = 0; i < words.length; i++) {
        const word: string = words[i];

        if (word === 'ffmpeg') {
            // 忽略命令本身
            continue;
        } else if (word.startsWith('-') && (!currentKey || foundValueForCurrentKey)) {
            // 如果单词以'-'开头，且没有当前key或者当前key已经找到了value，则视为新的key
            currentKey = word;
            foundValueForCurrentKey = false;
            result.push({ key: currentKey, value: '' });
        } else {
            // 否则，视为当前key的value
            if (currentKey && !foundValueForCurrentKey) {
                result[result.length - 1].value = word;
                foundValueForCurrentKey = true;
            } else {
                // 单独处理输出文件
                // 如果是最后一个参数且不是以'-'开头的选项，视为输出文件
                if (i === words.length - 1 && !word.startsWith('-')) {
                    result.push({ key: '', value: word });
                }
            }
        }
    }

    return result;
}
