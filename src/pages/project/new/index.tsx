import React, { useRef, useState, useEffect } from 'react'
import { Tabs, Space, Button, Descriptions, Segmented, message } from 'antd'
import type { DescriptionsProps } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { ulid } from 'ulid'
import dayjs from 'dayjs'
import type { ProColumns } from '@ant-design/pro-components'
import { produce } from 'immer'
import { useNavigate } from 'react-router-dom'
import {
  EditableProTable,
  ProForm,
  ProFormText,
  ProCard,
  ProFormTextArea,
} from '@ant-design/pro-components'
import type { ProFormInstance } from '@ant-design/pro-components'

const descItems: DescriptionsProps['items'] = [
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
]

type DataSourceType = {
  id: React.Key
  title?: string
  decs?: string
  state?: string
  created_at?: number
  children?: DataSourceType[]
}

export interface IItem {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
  },
  {
    id: 624691229,
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
  },
]

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '参数key',
    width: '30%',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '参数value',
    dataIndex: 'title',
    width: '50%',
  },
  {
    title: '操作',
    valueType: 'option',
  },
]

const initialItems = [{ label: '新建接口', key: '1000', id: '', name: '', url: '' }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
}

const ProjectItemNew: React.FC = () => {
  const nav = useNavigate()
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>(initialItems)
  const [searchParams] = useSearchParams()
  const [segmentedLeft, setSegmentedLeft] = useState<string>('简单模式')
  const [segmentedRight, setSegmentedRight] = useState<string>('默认配置')

  const formRef = useRef<ProFormInstance>()

  const addProjectDeatail = async (opts: any) => {
    if (opts.name && opts.url) {
      const projectDetail = {
        id: ulid(),
        status: 'stop',
        project_id: searchParams.get('projectId'),
        updated_at: dayjs().format(),
        ...opts,
      }
      await invoke('add_project_detail', {
        projectDetail,
      })
      message.success('新建成功')
      nav({
        pathname: `/project/list`,
        search: `projectId=${searchParams.get('projectId')}&name=${searchParams.get('name')}`,
      })
    } else return
  }

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map(item => item.id)
  )

  const onChange = (newActiveKey: string) => {
    setItems(
      produce(draft => {
        let r = draft.find(i => i.key == activeKey)
        if (r) {
          let form = formRef.current?.getFieldsValue()
          r.name = form.name
          r.label = form.name || '新建接口'
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
    const type = searchParams.get('type')
    if (type == 'edit') {
      addProjectDeatailItem()
    }
  }, [])

  return (
    <div>
      <Tabs type="card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        if (item.key == activeKey)
          return (
            <ProCard key={item.key} split="vertical">
              <ProCard title="" colSpan="70%">
                <Space direction="vertical">
                  <Segmented
                    options={['简单模式', '高级模式']}
                    onChange={value => {
                      setSegmentedLeft(value as string)
                    }}
                  />
                  <ProForm<{
                    name: string
                    url: string
                  }>
                    grid
                    formRef={formRef}
                    submitter={{
                      resetButtonProps: {
                        style: {
                          display: 'none',
                        },
                      },
                      submitButtonProps: {},
                      render: (props, _) => {
                        // 点击新建，直接跳到接口列表或者接口详情
                        // 点击运行，则新建按钮disabled 直到运行结束，才可以继续新建
                        return [
                          <Button
                            type="primary"
                            key="save"
                            onClick={() => {
                              addProjectDeatail(props.form?.getFieldsValue())
                            }}
                          >
                            新建
                          </Button>,
                          <Button
                            type="primary"
                            key="run"
                            onClick={() => {
                              addProjectDeatail(props.form?.getFieldsValue())
                            }}
                          >
                            新建并运行
                          </Button>,
                        ]
                      },
                    }}
                  >
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="name"
                        label="接口名称"
                        initialValue={item.name}
                        placeholder="请输入名称"
                      />
                      {['简单模式'].includes(segmentedLeft) && (
                        <ProFormTextArea
                          width="md"
                          name="url"
                          initialValue={item.url}
                          label="接口参数"
                          placeholder="请输入参数"
                        />
                      )}
                    </ProForm.Group>

                    {segmentedLeft == '高级模式' && (
                      <ProForm.Item
                        label="FFMPEG参数设置"
                        name="dataSource"
                        initialValue={defaultData}
                        trigger="onValuesChange"
                      >
                        <EditableProTable<DataSourceType>
                          rowKey="id"
                          toolBarRender={false}
                          columns={columns}
                          recordCreatorProps={{
                            newRecordType: 'dataSource',
                            position: 'top',
                            record: () => ({
                              id: Date.now(),
                              addonBefore: 'ccccccc',
                              decs: 'testdesc',
                            }),
                          }}
                          editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                            actionRender: (__, _, dom) => {
                              return [dom.delete]
                            },
                          }}
                        />
                      </ProForm.Item>
                    )}
                  </ProForm>
                </Space>
              </ProCard>
              <ProCard title="">
                <Space direction="vertical">
                  <Segmented
                    options={['默认配置', '高级选项']}
                    onChange={value => {
                      setSegmentedRight(value as string)
                    }}
                  />
                  {segmentedRight == '默认配置' && <Descriptions items={descItems} />}
                  {segmentedRight == '高级选项' && <div>敬请期待</div>}
                </Space>
              </ProCard>
            </ProCard>
          )
      })}
    </div>
  )
}

export default ProjectItemNew
