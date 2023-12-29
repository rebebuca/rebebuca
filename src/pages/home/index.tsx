import { FC } from 'react'
import { Command } from '@tauri-apps/api/shell'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const Home: FC = () => {

  const run = async () => {
    console.log(888)
    const cmd = new Command('run-ffmpeg', ['/C', 'ffmpeg -version'])
    await cmd.spawn();
    // console.log('ffmpeg: ', ffmpeg);
    // const ffmpeg = await new Command('run-node', ['-v']).execute();
    // console.log('ffmpeg: ', ffmpeg);

    cmd.stderr.on('data', str => {
      console.log(111, str)
    })

    cmd.on('error', error => console.error(`command error: "${error}"`));

    cmd.stdout.on('data', str => {
      console.log(111, str)
    })
  
    cmd.on('close', async ({ code }) => {
      console.log('code: ', code);
    })
  }


  return (
    <div>
      <Title onClick={run}>FFMPEG管理器</Title>
      <Paragraph>欢迎使用 Rebebuca ! </Paragraph>
      请复制粘贴你的ffmpeg命令行到现在输入框中
      一键运行
    </div>
  )
}

export default Home
