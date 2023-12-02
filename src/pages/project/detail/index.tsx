import React, { useRef, useState, useEffect } from 'react'
import { Tabs, Space, Badge, Button, Descriptions, Segmented } from 'antd'
import type { DescriptionsProps } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { produce } from 'immer'
import { ProCard } from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'

const descItems: DescriptionsProps['items'] = [
  {
    key: '1',
    label: '接口 URL',
    children:
      'ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj',
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
  {
    key: '6',
    label: '运行状态',
    children: <Badge status="processing" text="Running" />,
    span: 3,
  },
  {
    key: 'action',
    label: '操作按钮',
    children: (
      <div>
        <Space>
          <Button type="primary" key="run" onClick={() => props.form?.submit?.()}>
            运行
          </Button>
          <Button type="primary" key="stop" onClick={() => props.form?.submit?.()}>
            停止
          </Button>
          <Button type="primary" key="runAgain" onClick={() => props.form?.submit?.()}>
            重启
          </Button>
        </Space>
      </div>
    ),
    span: 3,
  },
]

const runLog: DescriptionsProps['items'] = [
  {
    key: '10',
    label: '输出日志',
    children: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
        <br />
      </>
    ),
  },
]

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
}

const ProjectItemEdit: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>([])
  const [searchParams] = useSearchParams()
  const [segmentedLeft, setSegmentedLeft] = useState<string>('接口信息')
  const [segmentedRight, setSegmentedRight] = useState<string>('运行日志')

  const formRef = useRef<ProFormInstance>()

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

  const addProjectDeatailItem = async () => {
    const id = searchParams.get('id') as string
    const res: Array<IItem> = await invoke('get_project_detail_item', {
      id,
    })
    const { name, url } = res[0]
    setItems(
      produce(draft => {
        let r = draft.find(i => i.id == id)
        if (r) setActiveKey(r.key)
        else draft.unshift({ label: name, name, key: id, id, url })
      })
    )
  }

  useEffect(() => {
    addProjectDeatailItem()
  }, [])

  return (
    <div>
      <Tabs type="card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        if (item.key == activeKey)
          return (
            <ProCard key={item.key} split="vertical">
              <ProCard title="">
                <Space direction="vertical">
                  <Segmented
                    options={['接口信息', '其他信息']}
                    onChange={value => {
                      setSegmentedLeft(value as string)
                    }}
                  />
                  {segmentedLeft == '接口信息' && <Descriptions items={descItems} />}
                  {segmentedLeft == '其他信息' && <div>敬请期待</div>}
                </Space>
              </ProCard>
              <ProCard title="" colSpan="50%">
                <Space direction="vertical">
                  <Segmented
                    options={['运行日志', '其他操作']}
                    onChange={value => {
                      setSegmentedRight(value as string)
                    }}
                  />
                  {segmentedRight == '运行日志' && <Descriptions items={runLog} />}
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
