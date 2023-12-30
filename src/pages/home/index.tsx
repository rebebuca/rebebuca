import { FC } from 'react'
import { Command } from '@tauri-apps/api/shell'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const Home: FC = () => {
  const run = async () => {
    console.log(888)
    const cmd = new Command('ffmpeg', '/C ffmpeg -version')
    await cmd.spawn()
    cmd.stderr.on('data', str => {
      console.log(111, str)
    })

    cmd.on('error', error => console.error(`command error: "${error}"`))

    cmd.stdout.on('data', str => {
      console.log(111, str)
    })

    cmd.on('close', async ({ code }) => {
      console.log('code: ', code)
    })
  }

  return (
    <div>
      <Title onClick={run}>FFMPEG管理器</Title>
      <Paragraph>欢迎使用 Rebebuca ! </Paragraph>
      请复制粘贴你的ffmpeg命令行到下面的输入框中 一键运行
      <div>30秒完成创建 运行 管理你的ffmpeg</div>
    </div>
  )
}

export default Home
