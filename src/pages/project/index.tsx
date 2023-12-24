import dayjs from 'dayjs'
import { ulid } from 'ulid'
import { invoke } from '@tauri-apps/api'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useState, useEffect } from 'react'
import type { ActionType } from '@ant-design/pro-components'
import { Badge, Button, Form, message, Popconfirm, Space, Col, Row } from 'antd'
import { ProList, ModalForm, ProForm, ProFormText } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginBlockStart: -2,
        marginInlineStart: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee'
      }}
    />
  )
}

export interface IItem {
  project_id: string
  name: string
  desc: string
  count: string
  updated_at: string
}

export default () => {
  const { t } = useTranslation()
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
      project_id: ulid(),
      updated_at: dayjs().format(),
      count: 0,
      ...values
    }
    const res: Array<IItem> = await invoke('add_project', {
      project
    })
    setList(res)
  }

  const updateProject = async (row: IItem, values: object) => {
    const project = {
      project_id: row.project_id,
      updated_at: dayjs().format(),
      count: row.count,
      ...values
    }
    const res: Array<IItem> = await invoke('update_project', {
      project
    })
    setList(res)
  }

  const delProject = async (row: IItem) => {
    const res: Array<IItem> = await invoke('del_project', {
      projectId: row.project_id
    })
    message.success(t('successfully deleted'))
    setList(res)
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <div>
      <ProList
        rowKey="title"
        actionRef={action}
        dataSource={list}
        ghost={false}
        editable={{}}
        onItem={(record: IItem) => {
          return {
            onClick: () => {
              nav({
                pathname: `/project/list`,
                search: `name=${record.name}&projectId=${record.project_id}`
              })
            }
          }
        }}
        grid={{ gutter: 16, column: 2 }}
        pagination={{
          defaultPageSize: 4,
          showSizeChanger: false
        }}
        metas={{
          project_id: {
            dataIndex: 'project_id'
          },
          title: {
            dataIndex: 'name'
          },
          description: {
            render: () => {
              return 'Ant Design, Ant UED Team'
            }
          },
          content: {
            dataIndex: 'updated_at',
            render: (text, row) => (
              <Row style={{ width: '100%' }}>
                <Col span={8}>
                  <div style={{ opacity: 1 }}>{t('Project introduction')}</div>
                  {row.desc}
                </Col>
                <Col span={8}>
                  <div>{t('Number of interfaces')}</div>
                  {row.count}
                </Col>
                <Col span={8}>
                  <div>{t('Modification date')}</div>
                  <div>{(text as string).split('+')[0].replace('T', ' ').replace('2023-', '')}</div>
                </Col>
              </Row>
            )
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
                      search: `name=${row.name}&projectId=${row.project_id}`
                    })
                  }}
                >
                  {t('Detail')}
                </a>
                <ModalForm<{
                  name: string
                  desc: string
                }>
                  title={t('Edit project')}
                  autoFocusFirstInput={false}
                  trigger={
                    <a target="_blank" rel="noopener noreferrer">
                      {t('Edit')}
                    </a>
                  }
                  modalProps={{
                    destroyOnClose: true
                  }}
                  form={form}
                  onFinish={async values => {
                    await updateProject(row, values)
                    message.success(t('Edit success'))
                    return true
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="name"
                      label={t('Project name')}
                      tooltip=""
                      initialValue={row.name}
                      rules={[
                        {
                          required: true
                        }
                      ]}
                      placeholder={t('Please enter project name')}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="desc"
                      label={t('Project introduction')}
                      initialValue={row.desc}
                      placeholder={t('Please enter project introduction')}
                    />
                  </ProForm.Group>
                </ModalForm>
                <Popconfirm
                  title={t('Prompt')}
                  description={t('Are you sure you want to delete this project?')}
                  onConfirm={() => {
                    delProject(row)
                  }}
                  key="del"
                  okText="Yes"
                  cancelText="No"
                >
                  <div style={{ opacity: 0.88 }}>{t('Delete')}</div>
                </Popconfirm>
              </Space>
            ]
          }
        }}
        toolbar={{
          menu: {
            activeKey,
            items: [
              {
                key: 'tab1',
                label: (
                  <span>
                    {t('All projects')}
                    {renderBadge(list.length, activeKey === 'tab1')}
                  </span>
                )
              }
            ],
            onChange(key) {
              setActiveKey(key)
            }
          },
          actions: [
            <ModalForm<{
              name: string
              desc: string
            }>
              key="new-project"
              title={t('New project')}
              autoFocusFirstInput={false}
              trigger={<Button type="primary">{t('New project')}</Button>}
              modalProps={{
                destroyOnClose: true
              }}
              form={form}
              onFinish={async values => {
                await newProject(values)
                message.success(t('Submitted successfully'))
                return true
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="name"
                  label={t('Project name')}
                  tooltip=""
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  placeholder={t('Please enter project name')}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="desc"
                  label={t('Project introduction')}
                  placeholder={t('Please enter project introduction')}
                />
              </ProForm.Group>
            </ModalForm>
          ]
        }}
      />
    </div>
  )
}
