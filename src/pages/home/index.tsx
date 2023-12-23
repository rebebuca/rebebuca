import { FC } from 'react'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography

const Home: FC = () => {
  return (
    <div>
      <Title>FFMPEG管理器</Title>
      <Paragraph>欢迎使用 Rebebuca ! </Paragraph>
    </div>
  )
}

export default Home
