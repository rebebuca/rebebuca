import { message } from 'antd'
import _ from 'lodash'

type TResponseCallback = {
  onData?: (data: any) => void
  onEnd?: (data: any) => void
  onError?: (err: any) => void
  setAbortController?: (controller: AbortController) => void
  onAborted?: () => void
}

export const requestDeepseek = async (query: string, callback: TResponseCallback) => {
  const abortController = new AbortController()
  callback?.setAbortController?.(abortController)
  const url = 'https://api.deepseek.com/v1/chat/completions'
  let salt = localStorage.getItem('ai-key')
  if (salt == 'sk-f5b754a7d80849fa91aa02e3c9eba6174b') salt = 'sk-f5b754a7d80849fa91aa02e3c9eba617'
  const token = 'Bearer ' + salt
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
      return handleStream(response, callback)
    })
    .then(content => {
      console.log('concatenated content:', content)
    })
    .catch(err => {
      if (err.name === 'AbortError') {
        callback?.onAborted?.()
      } else {
        callback?.onError?.(err)
      }
    })

  async function handleStream(response: Response, callback: TResponseCallback) {
    if (!response.ok) {
      throw new Error('服务出错')
    }
    const reader = response.body?.getReader()
    const textDecoder = new TextDecoder()
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
