import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { Command } from '@tauri-apps/api/shell'
import { useSearchParams } from 'react-router-dom'
import { ProCard } from '@ant-design/pro-components'
import { useSelector, useDispatch } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import type { ProFormInstance } from '@ant-design/pro-components'
import { Tabs, Space, Badge, Button, Descriptions, Segmented, Typography, FloatButton } from 'antd'
import { useTranslation } from 'react-i18next'

const { Paragraph } = Typography

import { runFFmpeg } from '../../../utils'
import { addCommand, updateCommand, resetCommandLog } from '../../../store/commandList'

import type { CommandItemType } from '../../../store/commandList'
import type { StateType } from '../../../store'

const initialItems = [{ label: '', key: '', id: '', name: '', url: '' }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
  project_id: string
  updated_at: string
  status: string
  log: string
}

export interface IDescItem {
  key: string
  label: string
  span: number
  children: React.ReactNode
}

type StatusType = {
  status: 'processing' | 'success' | 'error' | 'default'
  text: string
}

const ProjectItemEdit: React.FC = () => {
  const { t } = useTranslation()
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>([])
  const [searchParams] = useSearchParams()
  const [segmentedLeft, setSegmentedLeft] = useState<string>('接口信息')
  const [segmentedRight, setSegmentedRight] = useState<string>('运行日志')
  const commandList = useSelector<StateType>(state => state.commandList) as CommandItemType[]
  const settings = useSelector(state => state.settings.settingsData)

  // 创建一个引用来指向你想要点击的元素
  const myElementRef = useRef<HTMLButtonElement | null>(null)

  // 函数来触发点击
  const triggerClick = () => {
    // 使用 current 属性来访问 DOM 元素，并触发点击
    if (myElementRef.current instanceof HTMLButtonElement) {
      myElementRef.current.click()
    }
  }

  const dispatch = useDispatch()

  const [descItems, setDescItems] = useState<Array<IDescItem>>([
    {
      key: '1',
      label: t('接口 URL'),
      children: '',
      span: 3
    }
  ])

  const formRef = useRef<ProFormInstance>()

  const onChange = (newActiveKey: string) => {
    setItems(
      produce(draft => {
        const r = draft.find(i => i.key == activeKey)
        if (r) {
          const form = formRef.current?.getFieldsValue()
          r.name = form.name
          r.label = form.name
          r.url = form.url
        }
      })
    )
    setActiveKey(newActiveKey)
  }

  const getProjectDeatailItem = async () => {
    const id = searchParams.get('id') as string
    const res: Array<ITabItem> = await invoke('get_project_detail_item', {
      id
    })
    const { url } = res[0]
    setItems(res)
    add(res[0])
    setDescItems(
      produce(draft => {
        draft[0].children = <Paragraph copyable>{url}</Paragraph>
      })
    )

    if (searchParams.get('fromHome')) {
      setTimeout(() => {
        triggerClick()
      }, 200)
    }
  }

  const add = (item: ITabItem) => {
    dispatch(
      addCommand({
        id: item.id,
        status: item.status,
        log: (item.log && JSON.parse(item.log)) || [''],
        pid: 0,
        url: ''
      })
    )
  }

  const getStatus = (commandList: Array<CommandItemType>): StatusType => {
    const a = commandList[0]
    if (a.status == '12')
      return {
        status: 'processing',
        text: t('运行中')
      }
    else if (a.status == '0')
      return {
        status: 'success',
        text: t('成功')
      }
    else if (a.status == '1')
      return {
        status: 'error',
        text: t('失败')
      }
    else if (a.status == '-1')
      return {
        status: 'default',
        text: t('未运行')
      }
    else
      return {
        status: 'default',
        text: t('停止')
      }
  }

  useEffect(() => {
    getProjectDeatailItem()
  }, [])

  return (
    <div>
      <Tabs type="card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        return (
          <ProCard key={item.id} split="vertical" style={{ height: '500px' }}>
            <ProCard title="">
              <Space direction="vertical">
                <Segmented
                  options={[t('接口信息')]}
                  onChange={value => {
                    setSegmentedLeft(value as string)
                  }}
                />
                {segmentedLeft == t('接口信息') && (
                  <Descriptions
                    items={descItems.concat([
                      {
                        key: '6',
                        label: t('FFMPEG 来源'),
                        children: settings.ffmpeg == 'default' ? t('软件自带') : t('本机自带'),
                        span: 3
                      }
                    ])}
                    size="middle"
                  />
                )}
                <Space direction="vertical" size="large">
                  <div>
                    {t('运行状态：')}
                    <Badge
                      status={getStatus(commandList).status}
                      text={getStatus(commandList).text}
                    />
                  </div>
                </Space>
                <Space direction="vertical" style={{ marginTop: '5px' }}>
                  <div>{t('操作按钮：')}</div>
                </Space>
                <Space size="large" style={{ marginTop: '5px' }}>
                  <Button
                    type="primary"
                    key="run"
                    ref={myElementRef}
                    onClick={async () => {
                      const showStop = commandList[0].status == '12'
                      if (showStop) {
                        const cmd = `/C taskkill /f /t /pid ${commandList[0].pid}`
                        const command = await new Command('ffmpeg', cmd)
                        command.spawn()
                        command.on('close', () => {})
                      } else {
                        dispatch(
                          resetCommandLog({
                            id: item.id
                          })
                        )
                        const argArr = item.url.split(' ')
                        argArr.shift()
                        if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                        const s = await runFFmpeg(argArr, (line: string, status: string) => {
                          dispatch(
                            updateCommand({
                              id: item.id,
                              status: status,
                              pid: s.pid,
                              log: line,
                              item: items[0]
                            })
                          )
                        })
                      }
                    }}
                  >
                    {commandList[0].status == '12' ? t('停止') : t('运行')}
                  </Button>
                  <Button
                    disabled={commandList[0].status != '12'}
                    type="primary"
                    key="runAgain"
                    onClick={async () => {
                      const showStop = commandList[0].status == '12'
                      if (showStop) {
                        const cmd = `/C taskkill /f /t /pid ${commandList[0].pid}`
                        const command = await new Command('ffmpeg', cmd)
                        command.spawn()
                        command.on('close', async () => {
                          dispatch(
                            resetCommandLog({
                              id: item.id
                            })
                          )
                          // TODO:
                          const argArr = item.url.split(' ')
                          argArr.shift()
                          if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                          const s = await runFFmpeg(argArr, (line: string, status: string) => {
                            dispatch(
                              updateCommand({
                                id: item.id,
                                status: status,
                                pid: s.pid,
                                log: line,
                                item: items[0]
                              })
                            )
                          })
                        })
                      } else {
                        dispatch(
                          resetCommandLog({
                            id: item.id
                          })
                        )
                        const argArr = item.url.split(' ')
                        argArr.shift()
                        if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                        const s = await runFFmpeg(argArr, (line: string, status: string) => {
                          dispatch(
                            updateCommand({
                              id: item.id,
                              status: status,
                              pid: s.pid,
                              log: line,
                              item: items[0]
                            })
                          )
                        })
                      }
                    }}
                  >
                    {t('重启')}
                  </Button>
                </Space>
                {segmentedLeft == '其他信息' && <div>敬请期待</div>}
              </Space>
            </ProCard>
            <ProCard title="" colSpan="50%">
              <Space direction="vertical">
                <Segmented
                  options={[t('运行日志')]}
                  onChange={value => {
                    setSegmentedRight(value as string)
                  }}
                />
                <div></div>
                <div
                  id="rizhi"
                  style={{
                    height: '400px',
                    overflow: 'auto',
                    fontSize: '12px',
                    position: 'relative'
                  }}
                >
                  {commandList[0].log.map((text, index) => (
                    <div key={index}>{text}</div>
                  ))}

                  <FloatButton.BackTop
                    visibilityHeight={200}
                    // @ts-expect-error nocheck
                    target={() => document.getElementById('rizhi')}
                  />
                </div>

                {segmentedRight == '其他操作' && <div>敬请期待</div>}
              </Space>
            </ProCard>
          </ProCard>
        )
      })}
    </div>
  )
}

export default ProjectItemEdit
