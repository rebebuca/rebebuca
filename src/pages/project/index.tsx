import type { ActionType } from '@ant-design/pro-components'
import { ProList, ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import { Badge, Button, Form, message, Popconfirm, Space } from 'antd'
import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoke } from '@tauri-apps/api'
import { ulid } from 'ulid'
import dayjs from 'dayjs'

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginBlockStart: -2,
        marginInlineStart: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  )
}

export interface IItem {
  id: string
  name: string
  desc: string
  updated_at: string
}

export default () => {
  const nav = useNavigate()
  const action = useRef<ActionType>()
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1')
  const [form] = Form.useForm<{ name: string; desc: string }>()
  const [list, setList] = useState<Array<IItem>>([])

  const getProject = async () => {
    const res: Array<IItem> = await invoke('get_project')
    setList(res)
  }

  const newProject = async (values: object) => {
    const project = {
      id: ulid(),
      updated_at: dayjs().format(),
      ...values,
    }
    const res: Array<IItem> = await invoke('add_project', {
      project,
    })
    setList(res)
  }

  const updateProject = async (row: IItem, values: object) => {
    const project = {
      id: row.id,
      updated_at: dayjs().format(),
      ...values,
    }
    const res: Array<IItem> = await invoke('update_project', {
      project,
    })
    setList(res)
  }

  const delProject = async (row: IItem) => {
    const res: Array<IItem> = await invoke('del_project', {
      id: row.id,
    })
    message.success('刪除成功')
    setList(res)
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <div>
      <ProList<any>
        rowKey="title"
        actionRef={action}
        dataSource={list}
        ghost={false}
        editable={{}}
        onItem={(record: any) => {
          return {
            onClick: () => {
              nav({
                pathname: `/project/list`,
                search: `name=${record.name}&projectId=${record.id}`,
              })
            },
          }
        }}
        grid={{ gutter: 16, column: 2 }}
        pagination={{
          defaultPageSize: 6,
          showSizeChanger: false,
        }}
        metas={{
          id: {
            dataIndex: 'id',
          },
          title: {
            dataIndex: 'name',
          },
          description: {
            render: () => {
              return 'Ant Design, Ant UED Team'
            },
          },
          content: {
            dataIndex: 'updated_at',
            render: (text, row) => (
              <Space size="large">
                <div style={{ width: '200px' }}>
                  <div style={{ opacity: 1 }}>项目介绍</div>
                  {row.desc}
                </div>
                <div>
                  <div>接口数量</div>
                  {row.name}
                </div>
                <div>
                  <div style={{ marginRight: '20px' }}>修改日期</div>
                  <div>{(text as string).split('+')[0].replace('T', ' ').replace('2023-', '')}</div>
                </div>
              </Space>
            ),
          },
          actions: {
            render: (_, row: IItem) => [
              <Space size="middle" key="action-render">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    nav({
                      pathname: '/project/list',
                      search: `name=${row.name}`,
                    })
                  }}
                >
                  详情
                </a>
                <ModalForm<{
                  name: string
                  desc: string
                }>
                  title="编辑项目"
                  autoFocusFirstInput={false}
                  trigger={
                    <a target="_blank" rel="noopener noreferrer">
                      编辑
                    </a>
                  }
                  modalProps={{
                    destroyOnClose: true,
                  }}
                  form={form}
                  onFinish={async values => {
                    await updateProject(row, values)
                    message.success('编辑成功')
                    return true
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="name"
                      label="项目名称"
                      tooltip=""
                      initialValue={row.name}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      placeholder="请输入项目名称"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="desc"
                      label="项目介绍"
                      initialValue={row.desc}
                      placeholder="请输入项目介绍"
                    />
                  </ProForm.Group>
                </ModalForm>
                <Popconfirm
                  title="提示"
                  description="确定要删除这个项目吗?"
                  onConfirm={() => {
                    delProject(row)
                  }}
                  key="del"
                  okText="Yes"
                  cancelText="No"
                >
                  <div style={{ opacity: 0.88 }}>删除</div>
                </Popconfirm>
              </Space>,
            ],
          },
        }}
        toolbar={{
          menu: {
            activeKey,
            items: [
              {
                key: 'tab1',
                label: <span>全部项目{renderBadge(list.length, activeKey === 'tab1')}</span>,
              },
              {
                key: 'tab2',
                label: <span>正在运行{renderBadge(0, activeKey === 'tab2')}</span>,
              },
            ],
            onChange(key) {
              setActiveKey(key)
            },
          },
          search: {
            onSearch: (value: string) => {
              console.log(value)
            },
          },
          actions: [
            <ModalForm<{
              name: string
              desc: string
            }>
              title="新建项目"
              autoFocusFirstInput={false}
              trigger={<Button type="primary">新建项目</Button>}
              modalProps={{
                destroyOnClose: true,
              }}
              form={form}
              onFinish={async values => {
                await newProject(values)
                message.success('提交成功')
                return true
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="name"
                  label="项目名称"
                  tooltip=""
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  placeholder="请输入项目名称"
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText width="md" name="desc" label="项目介绍" placeholder="请输入项目介绍" />
              </ProForm.Group>
            </ModalForm>,
          ],
        }}
      />
    </div>
  )
}
