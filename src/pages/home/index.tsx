import React, { FC } from 'react'
import { Typography } from 'antd'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Title>FFMPEG管理器</Title>
        <Paragraph>欢迎使用Rebebuca!</Paragraph>
      </div>
    </div>
  )
}

export default Home
