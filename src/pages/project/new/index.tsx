import React, { useRef, useState, useEffect } from 'react'
import { Tabs, Space, Button, Descriptions, Segmented, message, Tooltip, Typography } from 'antd'
import type { DescriptionsProps } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { ulid } from 'ulid'
import dayjs from 'dayjs'
import type { ProColumns } from '@ant-design/pro-components'
import { produce } from 'immer'
import { useNavigate } from 'react-router-dom'
import { open } from '@tauri-apps/api/dialog'
import { EditableProTable, ProForm, ProFormText, ProCard } from '@ant-design/pro-components'
import type { ProFormInstance, EditableFormInstance } from '@ant-design/pro-components'

import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { argList } from '../../../constants/keys'

const { Paragraph } = Typography

type DataSourceType = {
  id: number
  key?: string
  value?: string
}

export interface IItem {
  id: string
  project_id: string
  name: string
  url: string
  argList: Array<Object>
  log: ''
  updated_at: string
}

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '参数key',
    width: '30%',
    key: 'key',
    dataIndex: 'key',
    valueType: 'select',
    fieldProps: {
      showSearch: true,
      options: argList,
    },
  },
  {
    title: '参数value',
    dataIndex: 'value',
    width: '50%',
  },
  {
    title: '操作',
    valueType: 'option',
  },
]

const initialItems = [{ label: '新建接口', key: '1000', id: '', name: '', url: '', argList: [] }]

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
  const [segmentedLeft, setSegmentedLeft] = useState<string>('标准模式')
  const [segmentedRight, setSegmentedRight] = useState<string>('信息面板')
  const [argList, setArgList] = useState([])

  const editableFormRef = useRef<EditableFormInstance>()

  const formRef = useRef<ProFormInstance>()

  const [descItems, setDescItems] = useState<DescriptionsProps['items']>([
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
      key: '7',
      label: 'FFMPEG URL',
      children: '',
      span: 3,
    },
  ])

  const onValuesChange = () => {
    setDescItems(
      produce(draft => {
        let r = draft.find(i => i.key == '7')
        if (formRef.current?.getFieldsValue().url.length) {
          let arr = formRef.current?.getFieldsValue().url
          let url = arr.reduce((accumulator, item) => {
            if (item.key && item.value) {
              return accumulator + ' ' + item.key + ' ' + item.value
            } else if (item.key) {
              return accumulator + ' ' + item.key
            } else if (item.value) {
              return accumulator + ' ' + item.value
            }
            return accumulator
          }, '')
          if (url) r.children = <Paragraph copyable>ffmpeg {url}</Paragraph>
        }
      })
    )
  }

  const getUrl = () => {
    let arr = formRef.current?.getFieldsValue().url
    let url = arr.reduce((accumulator, item) => {
      if (item.key && item.value) {
        return accumulator + ' ' + item.key + ' ' + item.value
      } else if (item.key) {
        return accumulator + ' ' + item.key
      } else if (item.value) {
        return accumulator + ' ' + item.value
      }
      return accumulator
    }, '')
    return 'ffmpeg' + url
  }

  const addProjectDeatail = async (opts: any) => {
    if (opts.name && opts.url) {
      const projectDetail = {
        id: ulid(),
        status: '-1',
        project_id: searchParams.get('projectId'),
        updated_at: dayjs().format(),
        name: opts.name,
        url: getUrl(),
        log: '',
        arg_list: JSON.stringify(opts.url),
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

  const selectFileOrDir = async (row, type) => {
    try {
      const selected = await open({
        directory: type == 1 ? false : true,
      })
      if (selected) {
        editableFormRef.current?.setRowData?.(row.index, {
          value: selected,
        })
        const { url } = formRef.current?.getFieldsValue()
        url.forEach(item => {
          if (item.id == row.id) item.value = selected
        })
        formRef.current?.setFieldValue('url', url)
        setDescItems(
          produce(draft => {
            let r = draft.find(i => i.key == '7')
            if (formRef.current?.getFieldsValue().url.length) {
              let arr = formRef.current?.getFieldsValue().url
              let url = arr.reduce((accumulator, item) => {
                if (item.key && item.value) {
                  return accumulator + ' ' + item.key + ' ' + item.value
                } else if (item.key) {
                  return accumulator + ' ' + item.key
                } else if (item.value) {
                  return accumulator + ' ' + item.value
                }
                return accumulator
              }, '')
              if (url) r.children = <Paragraph copyable>ffmpeg {url}</Paragraph>
            }
          })
        )
      }
    } catch (err) {}
  }

  return (
    <div>
      <Tabs type="card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        if (item.key == activeKey)
          return (
            <ProCard key={item.key} split="vertical">
              <ProCard title="" colSpan="70%">
                <Space direction="vertical">
                  <Segmented options={['标准模式']} />
                  <ProForm<{
                    name: string
                    url: Array<Object>
                  }>
                    grid
                    formRef={formRef}
                    onValuesChange={onValuesChange}
                    submitter={{
                      render: (props, _) => {
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
                        required
                        initialValue={item.name}
                        placeholder="请输入名称"
                      />
                    </ProForm.Group>

                    {segmentedLeft == '标准模式' && (
                      <ProForm.Item
                        label="FFMPEG参数设置"
                        required
                        name="url"
                        initialValue={argList}
                        trigger="onValuesChange"
                      >
                        <EditableProTable<DataSourceType>
                          rowKey="id"
                          toolBarRender={false}
                          columns={columns}
                          editableFormRef={editableFormRef}
                          recordCreatorProps={{
                            newRecordType: 'dataSource',
                            position: 'bottom',
                            record: () => ({
                              id: Date.now(),
                              key: '',
                              value: '',
                            }),
                          }}
                          editable={{
                            type: 'multiple',
                            actionRender: (row, _, dom) => {
                              return [
                                dom.delete,
                                <Tooltip placement="top" title="选择文件路径">
                                  <FileOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      selectFileOrDir(row, 1)
                                    }}
                                  />
                                </Tooltip>,
                                <Tooltip placement="top" title="选择文件路径">
                                  <FolderOpenOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      selectFileOrDir(row, 2)
                                    }}
                                  />
                                </Tooltip>,
                              ]
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
                    options={['信息面板']}
                    onChange={value => {
                      setSegmentedRight(value as string)
                    }}
                  />
                  {segmentedRight == '信息面板' && (
                    <div>
                      <Descriptions items={descItems.slice(0, 2)} />
                      <Descriptions items={descItems.slice(2, 3)} layout="vertical" />
                    </div>
                  )}
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
