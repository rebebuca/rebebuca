import { FC, useEffect, useState } from 'react'
// import { Command } from '@tauri-apps/api/shell'
import { Button, Input, QRCode, Select, Space, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api'
import { ulid } from 'ulid'
import dayjs from 'dayjs'

const { Title } = Typography

export interface IItem {
  project_id: string
  name: string
  desc: string
  count: string
  updated_at: string
}

export interface IProjectSelect {
  value: string
  label: string
}

const Home: FC = () => {
  const { TextArea } = Input
  const { t } = useTranslation()

  const [list, setList] = useState<Array<IItem>>([])
  const [projectSelect, setProjectSelect] = useState<Array<IProjectSelect>>([])

  const newProject = async () => {
    const project = {
      project_id: ulid(),
      updated_at: dayjs().format(),
      count: 0,
      name: '默认项目',
      desc: '默认项目的介绍'
    }
    const res: Array<IItem> = await invoke('add_project', {
      project
    })
    setList(res)
  }

  const getProject = async () => {
    const res: Array<IItem> = await invoke('get_project')
    console.log('res: ', res)
    if (res.length == 0) {
      newProject()
    }
    setList(res)

    const projectSelectList = res.map(item => {
      return {
        value: item.project_id,
        label: item.name
      }
    })
    console.log('projectSelect: ', projectSelectList)
    setProjectSelect(projectSelectList)
  }

  const run = async() => {
    console.log(888, ffmpegUrl)
  }

  const [ffmpegUrl, setFfmpegUurl] = useState('')
  // @ts-expect-error no check
  const onChangeNew = e => {
    setFfmpegUurl(() => e.target.value)
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <div>
      <Space direction="vertical" size="middle">
        <Title level={4}>欢迎使用 Rebebuca ! </Title>
        <div>30秒完成创建、运行、管理你的 ffmpeg 命令</div>
        <div>请复制粘贴你的 ffmpeg 命令行到下面的输入框中</div>
        <div>
          <TextArea
            style={{ width: '500px', height: '150px' }}
            value={ffmpegUrl}
            onChange={e => {
              onChangeNew(e)
            }}
            placeholder="ffmpeg -version"
          ></TextArea>
        </div>
        <Space>
          选择项目
          {list.length && (
            <Select
              defaultValue={list[0].project_id}
              style={{ width: 120 }}
              options={projectSelect}
            />
          )}
        </Space>
        <Space size="large" align="start">
          <Button type="primary" onClick={run}>一键运行</Button>
          <Button type="primary">教程文档</Button>
          <Button type="primary">{t('官方技术支持群')}</Button>
          <QRCode errorLevel="H" value="https://ant.design/" icon="/rebebuca.ico" />
        </Space>
      </Space>
    </div>
  )
}

export default Home
