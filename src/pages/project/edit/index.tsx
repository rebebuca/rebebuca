import dayjs from 'dayjs'
import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React, { useRef, useState, useEffect } from 'react'
import type { ProColumns } from '@ant-design/pro-components'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import type { ProFormInstance, EditableFormInstance } from '@ant-design/pro-components'
import { EditableProTable, ProForm, ProFormText, ProCard } from '@ant-design/pro-components'
import { Tabs, Space, Button, Descriptions, Segmented, message, Tooltip, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

import { argKeyList } from '@/constants/keys'
import { StateType } from '@/store'

const { Paragraph, Text } = Typography

type DataSourceType = {
  id: string | number
  index?: string
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
  pid: number
  log: string
}

const initialItems = [{ label: '', key: '', id: '', name: '', url: '', arg_list: [] }]

export interface ITabItem {
  label: string
  key: string
  id: string
  name: string
  url: string
  log: string
  pid: number
  arg_list: Array<object>
}

export interface IDescItem {
  key: string
  label: string
  span: number
  children: React.ReactNode
}

const ProjectItemEdit: React.FC = () => {
  const { t } = useTranslation()
  const nav = useNavigate()
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState<Array<ITabItem>>([])
  const [searchParams] = useSearchParams()

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])

  const editableFormRef = useRef<EditableFormInstance>()

  const formRef = useRef<ProFormInstance>()
  const settings = useSelector((state: StateType) => state.settings.settingsData)

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: t('参数key'),
      width: '30%',
      key: 'key',
      dataIndex: 'key',
      valueType: 'select',
      tooltip: t('不能自定义，如果下拉选项没有你想要的key，请写在value中'),
      fieldProps: {
        showSearch: true,
        options: argKeyList
      }
    },
    {
      title: t('参数value'),
      dataIndex: 'value',
      width: '50%'
    },
    {
      title: t('操作'),
      valueType: 'option'
    }
  ]

  const [descItems, setDescItems] = useState<Array<IDescItem>>([
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
          if (url) r!.children = <Text copyable style={{ whiteSpace: 'pre-wrap' }}>ffmpeg {url}</Text>
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

  const updateProjectDeatailItem = async (opts: { name: string; url: string }) => {
    if (opts.name && opts.url) {
      const id = searchParams.get('id') as string
      const res: Array<IItem> = await invoke('get_project_detail_item', {
        id
      })
      const defaultOpts = res[0]
      const projectDetail = {
        ...defaultOpts,
        updated_at: dayjs().format(),
        name: opts.name,
        url: getUrl(),
        arg_list: JSON.stringify(opts.url)
      }
      await invoke('update_project_detail', {
        projectDetail
      })
      message.success(t('保存成功'), 2)
      nav({
        pathname: `/project/list`,
        search: `projectId=${searchParams.get('projectId')}&name=${searchParams.get('name')}`
      })
    } else return
  }

  const getProjectDeatailItem = async () => {
    const id = searchParams.get('id') as string
    const res: Array<IItem> = await invoke('get_project_detail_item', {
      id
    })
    const { name, url, arg_list, log, pid } = res[0]
    const argList = JSON.parse(arg_list)
    const idList = argList.map((i: { id: string }) => i.id)
    setActiveKey(res[0].id)
    setEditableRowKeys(idList)
    setItems([{ label: name, name, key: id, id, url: url, arg_list: argList, pid, log }])
    setTimeout(() => {
      onValuesChange()
    }, 300)
  }

  const selectFileOrDir = async (row: DataSourceType, type: number) => {
    try {
      const selected = await open({
        directory: type == 1 ? false : true
      })
      if (selected) {
        editableFormRef.current?.setRowData?.(row.index as string, {
          value: selected
        })
        const { url } = formRef.current!.getFieldsValue()
        const newUrl = url.map((k: { id: string }) => {
          if (k.id == row.id) {
            return {
              ...k,
              value: selected
            }
          } else {
            return k
          }
        })
        formRef.current?.setFieldValue('url', newUrl)
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
              if (url) r!.children = <Paragraph copyable>ffmpeg {url}</Paragraph>
            }
          })
        )
      }
    } catch (err) {
      /* empty */
    }
  }

  useEffect(() => {
    getProjectDeatailItem()
  }, [])

  return (
    <div>
      <Tabs type="card" activeKey={activeKey} items={items} hideAdd />
      {items.map(item => {
        return (
          <ProCard key={item.key} split="vertical">
            <ProCard title="" colSpan="70%">
              <Space direction="vertical">
                <Segmented options={[t('编辑模式')]} />
                <ProForm<{
                  name: string
                  url: string
                  argList: Array<object>
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
                            updateProjectDeatailItem(props.form?.getFieldsValue())
                          }}
                        >
                          {t('保存')}
                        </Button>
                        // <Button type="primary" key="run" onClick={() => {}}>
                        //   保存并运行
                        // </Button>
                      ]
                    }
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="name"
                      label={t('命令名称')}
                      required
                      initialValue={item.name}
                      placeholder={t('请输入名称')}
                    />
                  </ProForm.Group>

                  <ProForm.Item
                    label={t('FFMPEG参数设置')}
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
                        creatorButtonText: <span></span>,
                        record: (): DataSourceType => ({
                          id: Date.now(),
                          key: '',
                          value: ''
                        })
                      }}
                      editable={{
                        type: 'multiple',
                        editableKeys,
                        onChange: setEditableRowKeys,
                        actionRender: (row, _, dom) => {
                          return [
                            dom.delete,
                            <Tooltip placement="top" title={t('选择文件路径')} key="file">
                              <FileOutlined
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  selectFileOrDir(row, 1)
                                }}
                              />
                            </Tooltip>,
                            <Tooltip placement="top" title={t('选择目录路径')} key="dir">
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
                <Segmented options={[t('信息面板')]} />
                <div>
                  <Descriptions
                    items={[
                      {
                        key: '6',
                        label: t('FFMPEG 来源'),
                        children: settings.ffmpeg == 'default' ? t('软件自带') : t('本机自带'),
                        span: 3
                      }
                    ]}
                  />
                  <Descriptions
                    layout="vertical"
                    items={descItems.slice(0, 1).map(a => {
                      return {
                        ...a,
                        label: t([a.label])
                      }
                    })}
                  />
                </div>
              </Space>
            </ProCard>
          </ProCard>
        )
      })}
    </div>
  )
}

export default ProjectItemEdit
