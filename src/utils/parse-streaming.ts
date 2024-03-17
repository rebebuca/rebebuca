import { message } from 'antd'
import _ from 'lodash'

const url = 'https://api.deepseek.com/v1/chat/completions'
const token = 'Bearer sk-108a5cc8be67469986dda1ff49502b6e'

type TResponseCallback = {
  onData?: (data: any) => void
  onEnd?: (data: any) => void
  onError?: (err: any) => void
  setAbortController?: (controller: AbortController) => void
  onAborted?: () => void
}

export const parseStreaming = async (query: string, callback: TResponseCallback) => {
  const abortController = new AbortController()
  callback?.setAbortController?.(abortController)
  const data = JSON.stringify({
    messages: [
      {
        content: 'You are a helpful assistant',
        role: 'system'
      },
      {
        content: query,
        role: 'user'
      }
    ],
    model: 'deepseek-coder',
    frequency_penalty: 0,
    max_tokens: 2048,
    presence_penalty: 0,
    stop: null,
    stream: true,
    temperature: 1,
    top_p: 1
  })

  let fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token
    },
    body: data
  }

  let options = _.merge({ signal: abortController.signal }, fetchOptions)

  // 假设你已经有了一个fetch请求的URL和配置
  // 发起fetch请求
  fetch(url, options)
    .then(response => {
      if (response.status == 401) {
        message.error('API key 错误，认证失败')
      }
      if (response.status == 403) {
        message.error('账号 token 配额不足')
      }
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // 处理流式数据
      return handleStream(response, callback)
    })
    .then(content => {
      console.log('Concatenated content:', content)
    })
    .catch(err => {
      if (err.name === 'AbortError') {
        callback?.onAborted?.()
      } else {
        callback?.onError?.(err)
      }
    })

  // 处理流式数据的函数
  async function handleStream(response: Response, callback: TResponseCallback) {
    if (!response.ok) {
      throw new Error('服务出错')
    }
    const reader = response.body?.getReader()
    const textDecoder = new TextDecoder()
    // const textDecoder = new TextDecoder("utf-8");
    let content = ''
    while (reader) {
      const chunk = await reader.read()
      if (chunk?.done) {
        callback?.onEnd?.(content)
        break
      }
      const chunkText = textDecoder.decode(chunk?.value, { stream: true })
      const lines = chunkText.split('\n')
      for (let line of lines) {
        if (line.startsWith('data:')) {
          const str = line.substring(5).trim()
          if (str != '[DONE]') {
            const data = JSON.parse(line.substring(5).trim())
            if (
              data.choices &&
              data.choices[0] &&
              data.choices[0].delta &&
              data.choices[0].delta.content
            ) {
              content += data.choices[0].delta.content
            }
          }
        }
      }
      callback?.onData?.(content)
    }
  }
}
