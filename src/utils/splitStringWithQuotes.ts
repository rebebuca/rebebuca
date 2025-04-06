export const splitStringWithQuotes = function (inputString: string): string[] {
  // 处理嵌套引号的正则表达式
  const regex = /[^\s"]+="[^"]+"|"[^"]+"|[^\s]+/g
  
  const matches = inputString?.match(regex) || []
  
  // 处理结果，保留内部引号但移除外部引号
  const result = matches.map(str => {
    // 如果是简单的引号字符串，移除外部引号
    if (/^".*"$/.test(str)) {
      return str.replace(/^"(.*)"$/, '$1')
    }
    // 对于key="value"格式，保持原样
    return str
  })
  
  return result
}
