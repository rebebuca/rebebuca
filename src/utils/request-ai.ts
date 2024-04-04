import { message } from 'antd'
import _ from 'lodash'
import { invoke } from '@tauri-apps/api'

type TResponseCallback = {
  onData?: (data: any) => void
  onEnd?: (data: any) => void
  onError?: (err: any) => void
  setAbortController?: (controller: AbortController) => void
  onAborted?: () => void
}

export const requestAI = async (query: string, callback: TResponseCallback) => {
  const abortController = new AbortController()
  callback?.setAbortController?.(abortController)

  let url
  let key
  let params
  const type = localStorage.getItem('ai-type')

  if (type == '2') {
    url = 'https://api.deepseek.com/v1/chat/completions'
    key = localStorage.getItem('ai-key')
    if (!key) {
      key = await invoke('get_env', { name: 'DEEPSEEK_API_KEY' })
    }
    params = {
      model: 'deepseek-coder'
    }
  }

  if (type == '3') {
    url = 'https://api.openai.com/v1/chat/completions'
    key = localStorage.getItem('ai-key')
    if (!key) {
      key = await invoke('get_env', { name: 'OPENAI_API_KEY' })
    }
    params = {
      model: 'gpt-3.5-turbo'
    }
  }

  const token = 'Bearer ' + key
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
    frequency_penalty: 0,
    max_tokens: 2048,
    presence_penalty: 0,
    stop: null,
    stream: true,
    temperature: 1,
    top_p: 1,
    ...params
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

  fetch(url!, options)
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
