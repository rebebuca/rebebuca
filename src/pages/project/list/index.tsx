import { ulid } from 'ulid'
import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { useDispatch } from 'react-redux'
import { Command } from '@tauri-apps/api/shell'
import { Button, Popconfirm, message } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { runFFmpeg } from '../../../utils'
import { updateCommand, resetCommandLog } from '../../../store/commandList'

export type ListItem = {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
  status: string
  pid: number
}

export default () => {
  const [list, setList] = useState<Array<ListItem>>([])
  const actionRef = useRef()
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const dispatch = useDispatch()

  const delProjectDetail = async (id: string) => {
    const res: Array<ListItem> = await invoke('del_project_detail', {
      id: id,
      projectId: searchParams.get('projectId')
    })
    message.success('刪除成功')
    setList(res)
  }

  const getProjectDetail = async () => {
    const res: Array<ListItem> = await invoke('get_project_detail', {
      projectId: searchParams.get('projectId')
    })
    setList(() => {
      return res
    })
  }

  const updateProjectDetailStatus = async (item: ListItem, status: string) => {
    setList(
      produce(draft => {
        const index = list.findIndex(k => k.id == item.id)
        if (index != -1) {
          if (draft[index].status == status) return
          else {
            draft[index].status = status
          }
        }
      })
    )
  }

  const columns: ProColumns<ListItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      key: `${ulid()}_index`
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      width: '15%',
      key: `${ulid()}_name`
    },
    {
      title: '状态',
      dataIndex: 'status',
      initialValue: 'stop',
      width: '15%',
      key: `${ulid()}_status`,
      valueEnum: {
        '-1': { text: '未运行', status: 'Default' },
        '1': { text: '失败', status: 'Error' },
        '12': { text: '运行中', status: 'Processing' },
        '0': { text: '成功', status: 'Success' },
        '11': { text: '停止', status: 'Default' }
      }
    },
    {
      title: '命令',
      dataIndex: 'url',
      ellipsis: true,
      key: `${ulid()}_url`,
      copyable: true
    },
    {
      title: '操作',
      width: 220,
      key: `${ulid()}_option`,
      valueType: 'option',
      render: (row: unknown) => [
        <a
          key="link4"
          onClick={async () => {
            // @ts-expect-error no check
            const item = row?.props?.record
            if (item.status != '12') updateProjectDetailStatus(item, '12')
            const showStop = item.status == '12'
            if (showStop) {
              const cmd = `/C taskkill /f /t /pid ${item.pid}`
              const command = await new Command('ffmpeg', cmd)
              command.spawn()
              command.on('close', () => {
                // console.log('进程关闭')
              })
            } else {
              dispatch(
                resetCommandLog({
                  id: item.id
                })
              )
              const argArr = item.url.split(' ')
              argArr.shift()
              if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
              const s = await runFFmpeg(argArr, (line: string, status: string) => {
                dispatch(
                  updateCommand({
                    id: item.id,
                    status: status,
                    pid: s.pid,
                    log: line,
                    item: item
                  })
                )
              })
            }
          }}
        >
          {
            // @ts-expect-error no check
            row.props.record.status == '12' ? '停止' : '运行'
          }
        </a>,
        <a
          key="link11"
          onClick={async () => {
            // @ts-expect-error no check
            const item = row.props.record
            const showStop = item.status == '12'
            if (showStop) {
              const cmd = `/C taskkill /f /t /pid ${item.pid}`
              const command = await new Command('ffmpeg', cmd)
              command.spawn()
              command.on('close', async () => {
                console.log('进程关闭')
                dispatch(
                  resetCommandLog({
                    id: item.id
                  })
                )
                const argArr = item.url.split(' ')
                argArr.shift()
                if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
                const s = await runFFmpeg(argArr, (line: string, status: string) => {
                  dispatch(
                    updateCommand({
                      id: item.id,
                      status: status,
                      pid: s.pid,
                      log: line,
                      item: item
                    })
                  )
                })
              })
            } else {
              dispatch(
                resetCommandLog({
                  id: item.id
                })
              )
              const argArr = item.url.split(' ')
              argArr.shift()
              if (!argArr.includes('-y') && !argArr.includes('-n')) argArr.push('-y')
              const s = await runFFmpeg(argArr, (line: string, status: string) => {
                dispatch(
                  updateCommand({
                    id: item.id,
                    status: status,
                    pid: s.pid,
                    log: line,
                    item: item
                  })
                )
              })
            }
          }}
        >
          重启
        </a>,
        <a
          key="link"
          onClick={() => {
            nav({
              pathname: `/project/detail`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
                // @ts-expect-error no check
              )}&id=${row.props.record.id}`
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
                // @ts-expect-error no check
              )}&id=${row.props.record.id}`
            })
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="提示"
          description="确定要删除这个接口吗?"
          onConfirm={() => {
            // @ts-expect-error no check
            delProjectDetail(row.props.record.id)
          }}
          key="del"
          okText="Yes"
          cancelText="No"
        >
          <a style={{ opacity: 0.88, color: '#000' }}>删除</a>
        </Popconfirm>
      ]
    }
  ]

  useEffect(() => {
    getProjectDetail()
    const interval = setInterval(() => {
      getProjectDetail()
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <ProTable<ListItem>
      columns={columns}
      actionRef={actionRef}
      dataSource={list}
      rowKey="id"
      pagination={{
        showQuickJumper: true
      }}
      options={false}
      search={false}
      dateFormatter="string"
      toolbar={{
        title: '接口列表'
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            nav({
              pathname: `/project/new`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get('projectId')}`
            })
          }}
        >
          新建接口
        </Button>
      ]}
    />
  )
}
