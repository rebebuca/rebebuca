import type { ActionType } from '@ant-design/pro-components'
import { ProList } from '@ant-design/pro-components'
import { Badge, Button } from 'antd'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dataSource = [
  {
    name: '分组1',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 300,
      },
      {
        label: '运行中',
        value: 20,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
  {
    name: '项目2',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 302,
      },
      {
        label: '运行中',
        value: 28,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
  {
    name: '项目3',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 400,
      },
      {
        label: '运行中',
        value: 22,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
  {
    name: '项目3',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 400,
      },
      {
        label: '运行中',
        value: 22,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
  {
    name: '项目4',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 400,
      },
      {
        label: '运行中',
        value: 22,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
  {
    name: '项目6',
    desc: '介绍',
    content: [
      {
        label: '接口数量',
        value: 400,
      },
      {
        label: '运行中',
        value: 22,
      },
      {
        label: '失败',
        value: '122',
      },
    ],
  },
]

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

export default () => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1')
  const action = useRef<ActionType>()
  const nav = useNavigate()
  return (
    <ProList<any>
      rowKey="name"
      actionRef={action}
      dataSource={dataSource}
      editable={{}}
      grid={{ gutter: 16, column: 2 }}
      pagination={{
        defaultPageSize: 8,
        showSizeChanger: false,
      }}
      metas={{
        title: {
          dataIndex: 'name',
          valueType: 'select',
          fieldProps: {
            showSearch: true,
            placement: 'bottomRight',
            options: [
              {
                label: '项目1',
                value: '项目1',
              },
            ],
          },
        },
        description: {
          key: 'desc',
        },
        content: {
          dataIndex: 'content',
          render: text => (
            <div key="label" style={{ display: 'flex', justifyContent: 'space-around' }}>
              {(text as any[]).map(t => (
                <div key={t.label}>
                  <div style={{ marginRight: '20px' }}>{t.label}</div>
                  <div>
                    {t.status === 'success' && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#52c41a',
                          marginInlineEnd: 8,
                        }}
                      />
                    )}
                    {t.value}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        actions: {
          render: (text, row) => [
            <a
              target="_blank"
              rel="noopener noreferrer"
              key="warning"
              onClick={() => {
                nav({
                  pathname: '/project/list',
                  search: `name=${row.name}`,
                })
              }}
            >
              详情
            </a>,
            <a
              target="_blank"
              rel="noopener noreferrer"
              key="warning"
              onClick={() => {
                nav({
                  pathname: '/project/list',
                  search: `name=${row.name}`,
                })
              }}
            >
              克隆
            </a>,
            <a target="_blank" rel="noopener noreferrer" key="view">
              删除
            </a>,
          ],
        },
      }}
      toolbar={{
        menu: {
          activeKey,
          items: [
            {
              key: 'tab1',
              label: <span>全部项目{renderBadge(99, activeKey === 'tab1')}</span>,
            },
            {
              key: 'tab2',
              label: <span>正在运行{renderBadge(32, activeKey === 'tab2')}</span>,
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
          <Button type="primary" key="primary">
            新建项目
          </Button>,
        ],
      }}
    />
  )
}
