import { FC, useEffect, useState } from 'react'
// import { Command } from '@tauri-apps/api/shell'
import { Button, Input, Image, Select, Space, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { invoke } from '@tauri-apps/api'
import { ulid } from 'ulid'
import dayjs from 'dayjs'
import { parseFFUrl } from '../../utils/parseFFUrl'
import { useNavigate } from 'react-router-dom'

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
  const nav = useNavigate()
  const { TextArea } = Input
  const { t } = useTranslation()

  const [list, setList] = useState<Array<IItem>>([])
  const [projectSelect, setProjectSelect] = useState<Array<IProjectSelect>>([])

  const [selectValue, setSelectValue] = useState('')

  const newProject = async () => {
    const project = {
      project_id: ulid(),
      updated_at: dayjs().format(),
      count: 0,
      name: t('默认项目'),
      desc: t('默认项目的介绍')
    }
    const res: Array<IItem> = await invoke('add_project', {
      project
    })
    setList(res)
  }

  const getProject = async () => {
    const res: Array<IItem> = await invoke('get_project')
    if (res.length == 0) {
      newProject()
    }
    setList(res)

    setSelectValue(res[0].project_id)

    const projectSelectList = res.map(item => {
      return {
        value: item.project_id,
        label: item.name
      }
    })
    setProjectSelect(projectSelectList)
  }

  const run = async () => {
    const isFFmpegCommand = ffmpegUrl.startsWith('ffmpeg')
    if (!isFFmpegCommand) {
      message.error(t('请粘贴以ffmpeg开头的命令行'))
      return
    } else {
      const result = parseFFUrl(ffmpegUrl)
      const selectItem: IItem = list.find(item => item.project_id === selectValue) as IItem

      const id = ulid()
      const projectDetail = {
        id,
        status: '-1',
        project_id: selectValue,
        updated_at: dayjs().format(),
        name: 'ffmpeg-api',
        url: ffmpegUrl,
        log: '',
        pid: 0,
        arg_list: JSON.stringify(result)
      }
      await invoke('add_project_detail', {
        projectDetail
      })

      nav({
        pathname: `/project/detail`,
        search: `name=${selectItem.name}&projectId=${selectValue}&id=${id}&fromHome=true`
      })
    }
  }

  const [ffmpegUrl, setFfmpegUurl] = useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFfmpegUurl(e.target.value)
  }

  const onChangeProject = (value: string) => {
    setSelectValue(value)
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <div>
      <Space direction="vertical" size="middle">
        <Title level={4}>{t('欢迎使用 Rebebuca ! ')}</Title>
        <div style={{ fontWeight: 'bold', color: '' }}>
          {t('30秒完成创建、运行、管理你的 ffmpeg 命令')}
        </div>
        <div>{t('请复制粘贴你的 ffmpeg 命令行到下面的输入框中')}</div>
        <div>
          <TextArea
            style={{ width: '500px', height: '150px' }}
            value={ffmpegUrl}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              onChangeValue(e)
            }}
            placeholder="ffmpeg -version"
          ></TextArea>
        </div>
        <Space>
          {t('选择项目')}
          {list.length && (
            <Select
              value={selectValue}
              onChange={e => onChangeProject(e)}
              style={{ width: 120 }}
              options={projectSelect}
            />
          )}
        </Space>
        <Space size="large" align="start">
          <Button type="primary" onClick={run}>
            {t('一键运行')}
          </Button>
          <Button type="primary">{t('教程文档')}</Button>
          <Button type="primary">{t('官方技术支持群')}</Button>
          <Image width={180} src="/wx.jpg" />
        </Space>
      </Space>
    </div>
  )
}

export default Home
