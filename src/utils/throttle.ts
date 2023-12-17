/**
 * @description  节流函数
 * @param fn     回调函数
 * @param delay  延迟时间
 * @returns      返回闭包函数
 */
export const throttle = (fn: (data: string) => void, delay = 1000) => {
  let lastTime = 0
  return function (data: string) {
    let nowTime = Date.now()
    if (nowTime - lastTime > delay) {
      fn(data)
      lastTime = nowTime
    }
  }
}
