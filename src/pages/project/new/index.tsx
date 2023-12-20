import dayjs from 'dayjs'
import { ulid } from 'ulid'
import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import React, { useRef, useState } from 'react'
import type { ProColumns } from '@ant-design/pro-components'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import type { ProFormInstance, EditableFormInstance } from '@ant-design/pro-components'
import { EditableProTable, ProForm, ProFormText, ProCard } from '@ant-design/pro-components'
import { Tabs, Space, Button, Descriptions, Segmented, message, Tooltip, Typography } from 'antd'

import { argKeyList } from '../../../constants/keys'

const { Paragraph } = Typography

type DataSourceType = {
  id: number
  index: string
  key?: string
  value?: string
}

export interface IItem {
  id: string
  project_id: string
  name: string
  url: string
  pid: number
  argList: Array<object>
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
      options: argKeyList
    }
  },
  {
    title: '参数value',
    dataIndex: 'value',
    width: '50%'
  },
  {
    title: '操作',
    valueType: 'option'
  }
]

const initialItems = [{ label: '新建接口', key: '1000', id: '', name: '', url: '', argList: [] }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
}

export interface IDescItem {
  key: string
  label: string
  span: number
  children: React.ReactNode
}

const ProjectItemNew: React.FC = () => {
  const nav = useNavigate()
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>(initialItems)
  const [searchParams] = useSearchParams()
  const [segmentedRight, setSegmentedRight] = useState<string>('信息面板')

  const editableFormRef = useRef<EditableFormInstance>()

  const formRef = useRef<ProFormInstance>()

  const [descItems, setDescItems] = useState<Array<IDescItem>>([
    {
      key: '6',
      label: 'FFMPEG版本',
      children: '16',
      span: 3
    },
    {
      key: '9',
      label: '失败重启次数',
      children: '0',
      span: 3
    },
    {
      key: '7',
      label: 'FFMPEG URL',
      children: '',
      span: 3
    }
  ])

  const onValuesChange = () => {
    setDescItems(
      produce(draft => {
        const r: IDescItem | undefined = draft.find(i => i.key == '7')
        if (formRef.current?.getFieldsValue().url.length) {
          const arr = formRef.current?.getFieldsValue().url
          const url = arr.reduce((accumulator: string, item: DataSourceType) => {
            if (item.key && item.value) {
              return accumulator + ' ' + item.key + ' ' + item.value
            } else if (item.key) {
              return accumulator + ' ' + item.key
            } else if (item.value) {
              return accumulator + ' ' + item.value
            }
            return accumulator
          }, '')
          // @ts-expect-error no error
          if (url) r.children = <Paragraph copyable>ffmpeg {url}</Paragraph>
        }
      })
    )
  }

  const getUrl = () => {
    const arr = formRef.current?.getFieldsValue().url
    const url = arr.reduce((accumulator: string, item: DataSourceType) => {
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

  const addProjectDeatail = async (opts: { name: string; url: string }) => {
    if (opts.name && opts.url) {
      const projectDetail = {
        id: ulid(),
        status: '-1',
        project_id: searchParams.get('projectId'),
        updated_at: dayjs().format(),
        name: opts.name,
        url: getUrl(),
        log: '',
        pid: 0,
        arg_list: JSON.stringify(opts.url)
      }
      await invoke('add_project_detail', {
        projectDetail
      })
      message.success('新建成功')
      nav({
        pathname: `/project/list`,
        search: `projectId=${searchParams.get('projectId')}&name=${searchParams.get('name')}`
      })
    } else return
  }

  const onChange = (newActiveKey: string) => {
    setItems(
      produce(draft => {
        const r = draft.find(i => i.key == activeKey)
        if (r) {
          const form = formRef.current?.getFieldsValue()
          r.name = form.name
          r.label = form.name || '新建接口'
          r.url = form.url
        }
      })
    )
    setActiveKey(newActiveKey)
  }

  const selectFileOrDir = async (row: DataSourceType, type: number) => {
    try {
      const selected = await open({
        directory: type == 1 ? false : true
      })
      if (selected) {
        editableFormRef.current?.setRowData?.(row.index, {
          value: selected
        })
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { url } = formRef.current?.getFieldsValue()
        url.forEach((item: { id: string; value: string | unknown }) => {
          // @ts-expect-error no error
          if (item.id == row.id) item.value = selected
        })
        formRef.current?.setFieldValue('url', url)
        setDescItems(
          produce(draft => {
            const r = draft.find(i => i.key == '7')
            if (formRef.current?.getFieldsValue().url.length) {
              const arr = formRef.current?.getFieldsValue().url
              const url = arr.reduce((accumulator: string, item: DataSourceType) => {
                if (item.key && item.value) {
                  return accumulator + ' ' + item.key + ' ' + item.value
                } else if (item.key) {
                  return accumulator + ' ' + item.key
                } else if (item.value) {
                  return accumulator + ' ' + item.value
                }
                return accumulator
              }, '')
              // @ts-expect-error no error
              if (url) r.children = <Paragraph copyable>ffmpeg {url}</Paragraph>
            }
          })
        )
      }
    } catch (err) {
      /* empty */
    }
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
                    url: Array<object>
                  }>
                    grid
                    formRef={formRef}
                    onValuesChange={onValuesChange}
                    submitter={{
                      render: props => {
                        return [
                          <Button
                            type="primary"
                            key="save"
                            onClick={() => {
                              // eslint-disable-next-line react/prop-types
                              addProjectDeatail(props.form?.getFieldsValue())
                            }}
                          >
                            新建
                          </Button>,
                          <Button
                            type="primary"
                            key="run"
                            onClick={() => {
                              // eslint-disable-next-line react/prop-types
                              addProjectDeatail(props.form?.getFieldsValue())
                            }}
                          >
                            新建并运行
                          </Button>
                        ]
                      }
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

                    <ProForm.Item
                      label="FFMPEG参数设置"
                      required
                      name="url"
                      initialValue={[]}
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
                          // @ts-expect-error no error
                          record: () => ({
                            id: Date.now(),
                            key: '',
                            value: ''
                          })
                        }}
                        editable={{
                          type: 'multiple',
                          actionRender: (row, _, dom) => {
                            return [
                              dom.delete,
                              <Tooltip placement="top" title="选择文件路径" key="file-path">
                                <FileOutlined
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    selectFileOrDir(row, 1)
                                  }}
                                />
                              </Tooltip>,
                              <Tooltip placement="top" title="选择文件路径" key="dir-path">
                                <FolderOpenOutlined
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    selectFileOrDir(row, 2)
                                  }}
                                />
                              </Tooltip>
                            ]
                          }
                        }}
                      />
                    </ProForm.Item>
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
