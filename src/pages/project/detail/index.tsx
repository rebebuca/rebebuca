import React, { useRef, useState, useEffect } from 'react'
import { Tabs, Space, Badge, Button, Descriptions, Segmented, Typography } from 'antd'
import type { DescriptionsProps } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { Command } from '@tauri-apps/api/shell'
import { produce } from 'immer'
import { ProCard } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'

const { Paragraph } = Typography

import { runFFmpeg } from '../../../utils'
import { addCommand, updateCommand, resetCommandLog } from '../../../store/commandList'

import { useSelector, useDispatch } from 'react-redux'

import type { CommandItemType } from '../../../store/commandList'
import type { StateType } from '../../../store'

export interface ILogMapValue {
  log: string[]
  statusText: string
  code: number
  child?: any
}

const logMap: Map<string, ILogMapValue> = new Map()
logMap.set('0', {
  log: [],
  statusText: '',
  code: 1,
  child: null,
})

export interface IItem {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
}

const initialItems = [{ label: '', key: '', id: '', name: '', url: '' }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
  updated_at: string
}
type StatusType = {
  status: 'processing' | 'success' | 'error' | 'default'
  text: string
}

const ProjectItemEdit: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>([])
  const [searchParams] = useSearchParams()
  const [segmentedLeft, setSegmentedLeft] = useState<string>('接口信息')
  const [segmentedRight, setSegmentedRight] = useState<string>('运行日志')
  const commandList = useSelector<StateType>(state => state.commandList) as CommandItemType[]

  const dispatch = useDispatch()

  const [descItems, setDescItems] = useState<DescriptionsProps['items']>([
    {
      key: '1',
      label: '接口 URL',
      children: '',
      span: 3,
    },
    {
      key: '6',
      label: 'FFMPEG版本',
      children: '16',
      span: 3,
    },
    {
      key: '9',
      label: '失败重启次数',
      children: '0',
      span: 3,
    },
  ])

  const formRef = useRef<ProFormInstance>()

  const list = useRef([])

  const onChange = (newActiveKey: string) => {
    setItems(
      produce(draft => {
        let r = draft.find(i => i.key == activeKey)
        if (r) {
          let form = formRef.current?.getFieldsValue()
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
    const res: Array<IItem> = await invoke('get_project_detail_item', {
      id,
    })
    const { url } = res[0]
    setItems(res)
    list.current = res
    console.log(111, list)
    add(res[0])
    setDescItems(
      produce(draft => {
        draft[0].children = <Paragraph copyable>{url}</Paragraph>
      })
    )
  }

  const add = item => {
    dispatch(
      addCommand({
        id: item.id,
        status: item.status,
        log: (item.log && JSON.parse(item.log)) || [''],
        pid: 0,
        url: '',
        statusText: '',
      })
    )
  }

  const updateProjectDeatailItem = async (status: string) => {
    const item = items[0]
    if (status == '1' || status == '0' || status == '11') {
      const projectDetail = {
        ...item,
        status: status,
      }
      await invoke('update_project_detail', {
        projectDetail,
      })
    } else return
  }

  const getStatus = (commandList: Array<CommandItemType>): StatusType => {
    let a = commandList[0]
    if (a.status == '12')
      return {
        status: 'processing',
        text: '运行中',
      }
    else if (a.status == '0')
      return {
        status: 'success',
        text: '成功',
      }
    else if (a.status == '1')
      return {
        status: 'error',
        text: '失败',
      }
    else if (a.status == '-1')
      return {
        status: 'default',
        text: '未运行',
      }
    else
      return {
        status: 'default',
        text: '停止',
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
                  options={['接口信息']}
                  onChange={value => {
                    setSegmentedLeft(value as string)
                  }}
                />
                {segmentedLeft == '接口信息' && <Descriptions items={descItems} size="middle" />}
                <Space direction="vertical" size="large">
                  <div>
                    运行状态：
                    <Badge
                      status={getStatus(commandList).status}
                      text={getStatus(commandList).text}
                    />
                  </div>
                </Space>
                <Space direction="vertical" style={{ marginTop: '5px' }}>
                  <div>操作按钮：</div>
                </Space>
                <Space size="large" style={{ marginTop: '5px' }}>
                  <Button
                    type="primary"
                    key="run"
                    onClick={async () => {
                      // { commandList[0].status == '12' ? '停止' : '运行' }
                      let showStop = commandList[0].status == '12'
                      if (showStop) {
                        const cmd = `/C taskkill /f /t /pid ${commandList[0].pid}`
                        const command = await new Command('ffmpeg', cmd);
                        command.spawn()
                        command.on('close', () => {
                          console.log("进程关闭")
                        })
                      } else {
                        dispatch(
                          resetCommandLog({
                            id: item.id,
                          })
                        )
                        let argArr = item.url.split(' ')
                        argArr.shift()
                        if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                        let s = await runFFmpeg(argArr, (line: string, status: string) => {
                          dispatch(
                            updateCommand({
                              id: item.id,
                              status: status,
                              pid: s.pid,
                              log: line,
                              item: items[0],
                            })
                          )
                        })
                      }
                    }}
                  >
                    {commandList[0].status == '12' ? '停止' : '运行'}
                  </Button>
                  {/* <Button
                    type="primary"
                    key="stop"
                    onClick={async () => {
                      console.log(666, commandList[0].status)
                      const cmd = `/C taskkill /f /t /pid ${commandList[0].pid}`
                      const command = await new Command('ffmpeg', cmd);
                      command.spawn()
                      command.on('close', () => {
                        console.log("进程关闭")
                      })
                    }}
                  >
                    {commandList[0].status == '12' ? '停止' : '运行'}
                  </Button> */}
                  <Button
                    type="primary"
                    key="runAgain"
                    onClick={async () => {
                      let showStop = commandList[0].status == '12'
                      if (showStop) {
                        const cmd = `/C taskkill /f /t /pid ${commandList[0].pid}`
                        const command = await new Command('ffmpeg', cmd);
                        command.spawn()
                        command.on('close', async () => {
                          console.log("进程关闭")
                          dispatch(
                            resetCommandLog({
                              id: item.id,
                            })
                          )
                          let argArr = item.url.split(' ')
                          argArr.shift()
                          if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                          let s = await runFFmpeg(argArr, (line: string, status: string) => {
                            dispatch(
                              updateCommand({
                                id: item.id,
                                status: status,
                                pid: s.pid,
                                log: line,
                                item: items[0],
                              })
                            )
                          })
                        })
                      } else {
                        dispatch(
                          resetCommandLog({
                            id: item.id,
                          })
                        )
                        let argArr = item.url.split(' ')
                        argArr.shift()
                        if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                        let s = await runFFmpeg(argArr, (line: string, status: string) => {
                          dispatch(
                            updateCommand({
                              id: item.id,
                              status: status,
                              pid: s.pid,
                              log: line,
                              item: items[0],
                            })
                          )
                        })
                      }
                    }}
                  >
                    重启
                  </Button>
                </Space>
                {segmentedLeft == '其他信息' && <div>敬请期待</div>}
              </Space>
            </ProCard>
            <ProCard title="" colSpan="50%">
              <Space direction="vertical">
                <Segmented
                  options={['运行日志']}
                  onChange={value => {
                    setSegmentedRight(value as string)
                  }}
                />
                <div style={{ height: '400px', overflow: 'auto', fontSize: '12px' }}>
                  {commandList[0].log.map((text, index) => (
                    <div key={index}>{text}</div>
                  ))}
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
