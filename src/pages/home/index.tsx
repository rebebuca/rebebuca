import { FC, useEffect, useRef, useState } from 'react'
import { Typography } from 'antd'

const { Title, Paragraph } = Typography 

const Home: FC = () => {

  const [count, kun] = useState(0)

  const countRef = useRef(0)

  useEffect(() =>{
    countRef.current = count
  }, [count])

  function add() {
    // 函数为什么不会被合并
    kun(count + 1)   
    // kun(count => count + 1)   
    // kun(count => count + 1)   
    // kun(count => count + 1)   
    // kun(count => count + 1)   
    // kun(count + 1)    
    // kun(count + 1)   
    // kun(count + 1)   
    // kun(count + 1)   
    console.log(count)
  }

  function alertfn() {
    setTimeout(() => {
      alert(count) // 值类型
      alert(countRef.current) // ref引用类型
    }, 3000)
  }
  return (
    <div>
      {count} 
      <Title onClick={add}>FFMPEG管理器</Title>
      <Paragraph onClick={alertfn}>欢迎使用 Rebebuca! </Paragraph>
    </div>
  )
}

export default Home
