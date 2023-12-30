import { FC } from 'react'
import { Command } from '@tauri-apps/api/shell'
import { Button, Input, Space, Typography } from 'antd'

const { Title, Paragraph } = Typography

const Home: FC = () => {

  const { TextArea } = Input

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

      <div>30秒完成创建 运行 管理你的ffmpeg</div>
      <br />
      <div>请复制粘贴你的ffmpeg命令行到下面的输入框中 一键运行</div>
      <br />
      <div>
      <TextArea></TextArea>
      </div>
      <br />

      <Space size="large">
      <Button type="primary">一键运行</Button>
        <Button type="primary">教程文档</Button>
      </Space>
    </div>
  )
}

export default Home
