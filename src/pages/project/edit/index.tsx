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
  arg_list: string
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

const initialItems = [{ label: '', key: '', id: '', name: '', url: '', arg_list: [] }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
  log: ''
  pid: number
  arg_list: Array<Object>
}

const ProjectItemEdit: React.FC = () => {
  const nav = useNavigate()
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>([])
  const [searchParams] = useSearchParams()
  const [segmentedLeft, setSegmentedLeft] = useState<string>('编辑模式')
  const [segmentedRight, setSegmentedRight] = useState<string>('信息面板')
  const [argList, setArgList] = useState([])

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

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

  const updateProjectDeatailItem = async (opts: any) => {
    if (opts.name && opts.url) {
      const id = searchParams.get('id') as string
      const res: Array<IItem> = await invoke('get_project_detail_item', {
        id,
      })
      let defaultOpts = res[0]
      const projectDetail = {
        ...defaultOpts,
        updated_at: dayjs().format(),
        name: opts.name,
        url: getUrl(),
        arg_list: JSON.stringify(opts.url),
      }
      await invoke('update_project_detail', {
        projectDetail,
      })
      message.success('保存成功')
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
    const { name, url, arg_list } = res[0]
    const argList = JSON.parse(arg_list)
    setArgList(
      produce(draft => {
        draft = JSON.parse(arg_list)
      })
    )
    let idList = argList.map(i => i.id)
    setEditableRowKeys(idList)
    setItems(
      produce(draft => {
        let r = draft.find(i => i.id == id)
        if (r) setActiveKey(r.key)
        else draft.unshift({ label: name, name, key: id, id, url: url, arg_list: argList })
      })
    )
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
        let newUrl = url.map(k => {
          if (k.id == row.id) {
            return {
              ...k,
              value: selected,
            }
          } else {
            return k
          }
        })
        formRef.current?.setFieldValue('url', newUrl)
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

  useEffect(() => {
    addProjectDeatailItem()
  }, [])

  return (
    <div>
      <Tabs type="card" onChange={onChange} activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        return (
          <ProCard key={item.key} split="vertical">
            <ProCard title="" colSpan="70%">
              <Space direction="vertical">
                <Segmented options={['编辑模式']} />
                <ProForm<{
                  name: string
                  url: string
                  argList: Array<Object>
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
                            updateProjectDeatailItem(props.form?.getFieldsValue())
                          }}
                        >
                          保存
                        </Button>,
                        <Button type="primary" key="run" onClick={() => {}}>
                          保存并运行
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

                  {segmentedLeft == '编辑模式' && (
                    <ProForm.Item
                      label="FFMPEG参数设置"
                      required
                      name="url"
                      initialValue={item.arg_list}
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
                          editableKeys,
                          onChange: setEditableRowKeys,
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

export default ProjectItemEdit
