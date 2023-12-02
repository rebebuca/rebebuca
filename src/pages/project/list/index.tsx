import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { invoke } from '@tauri-apps/api'
import { Button, Popconfirm, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
}

export type TableListItem = {
  key: number
  name: string
  containers: number
  creator: string
  status: string
  createdAt: number
  progress: number
  money: number
  memo: string
}
const tableListDataSource: TableListItem[] = []

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某']

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[((Math.floor(Math.random() * 10) % 4) + '') as '0'],
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
    memo: i % 2 === 1 ? 'ffmpeg -k -v gsdhofshsdo hhhd iuyiewryiuwen hhhhd ' : '简短备注文案',
  })
}

export interface IItem {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
}

export default () => {
  const [list, setList] = useState<Array<IItem>>([])

  const [searchParams] = useSearchParams()
  const nav = useNavigate()

  const delProjectDetail = async (id: string) => {
    const res: Array<IItem> = await invoke('del_project_detail', {
      id: id,
    })
    message.success('刪除成功')
    setList(res)
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'stop',
      width: '15%',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        close: { text: '关闭', status: 'Default' },
        running: { text: '运行中', status: 'Processing' },
        online: { text: '已上线', status: 'Success' },
        stop: { text: '停止', status: 'Default' },
      },
    },
    {
      title: '命令',
      dataIndex: 'url',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: row => [
        <a key="link4">运行</a>,
        <a
          key="link"
          onClick={() => {
            nav({
              pathname: `/project/detail`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
              )}&id=${row.props.record.id}`,
            })
          }}
        >
          详情
        </a>,
        <a
          key="link2"
          onClick={() => {
            nav({
              pathname: `/project/edit`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
              )}&id=${row.props.record.id}`,
            })
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="提示"
          description="确定要删除这个项目吗?"
          onConfirm={() => {
            delProjectDetail(row.props.record.id)
          }}
          key="del"
          okText="Yes"
          cancelText="No"
        >
          <a style={{ opacity: 0.88, color: '#000' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  const getProjectDetail = async () => {
    const res: Array<IItem> = await invoke('get_project_detail', {
      projectId: searchParams.get('projectId'),
    })
    setList(res)
  }

  useEffect(() => {
    getProjectDetail()
  }, [])

  return (
    <ProTable<TableListItem>
      columns={columns}
      dataSource={list}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
      }}
      options={false}
      search={false}
      dateFormatter="string"
      toolbar={{
        title: '接口列表',
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            nav({
              pathname: `/project/new`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get('projectId')}`,
            })
          }}
        >
          新建接口
        </Button>,
      ]}
    />
  )
}
