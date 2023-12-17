import { http } from '@tauri-apps/api'

export class Request {
  constructor() {}
  interceptors = {
    baseURL: '/',
    requert: {
      headers: {},
      body: {},
      use: () => {},
    },
    response: (response: any) => {
      return new Promise((rec, _) => {
        if (response.status == 200) {
          rec(response.data)
        }
      })
    },
  }
  post = (url: string, data: any) => {
    return new Promise(resolve => {
      const requestBody = { ...data, ...this.interceptors.requert.body }
      const requestHeaders = { ...this.interceptors.requert.headers }
      this.interceptors.requert.use()
      http
        .fetch(this.interceptors.baseURL + url, {
          headers: requestHeaders,
          method: 'POST',
          body: http.Body.json(requestBody),
        })
        .then(res => {
          resolve(this.interceptors.response(res))
        })
    })
  }
  get = (url: string, data?: any) => {
    return new Promise(resolve => {
      const requestQuery = { ...data, ...this.interceptors.requert.body }
      const requestHeaders = { ...this.interceptors.requert.headers }
      this.interceptors.requert.use()
      http
        .fetch(this.interceptors.baseURL + url, {
          headers: requestHeaders,
          method: 'GET',
          query: requestQuery,
        })
        .then(res => {
          resolve(this.interceptors.response(res))
        })
    })
  }
}
