import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { invoke } from '@tauri-apps/api'
import { Button, Popconfirm, message } from 'antd'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export type TableListItem = {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
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
      projectId: searchParams.get('projectId'),
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
      render: (row: any) => [
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
