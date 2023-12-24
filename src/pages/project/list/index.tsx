import { ulid } from 'ulid'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { invoke } from '@tauri-apps/api'
import { useDispatch } from 'react-redux'
import { Command } from '@tauri-apps/api/shell'
import { Button, Popconfirm, message } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { runFFmpeg } from '../../../utils'
import { updateCommand, resetCommandLog } from '../../../store/commandList'
import { writeSettingToDownload } from '../../../utils/export'

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
  const { t } = useTranslation()
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
    message.success(t('successfully deleted'))
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
  // @ts-expect-error no check
  const copyApi = async row => {
    const opts = row.props.record
    const projectDetail = {
      id: ulid(),
      status: '-1',
      project_id: opts.project_id,
      updated_at: dayjs().format(),
      name: 'copy-' + opts.name,
      url: opts.url,
      log: '',
      pid: 0,
      arg_list: opts.arg_list
    }
    await invoke('add_project_detail', {
      projectDetail
    })
    getProjectDetail()
    message.success(t('复制成功'))
  }

  const columns: ProColumns<ListItem>[] = [
    {
      title: t('排序'),
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      key: `${ulid()}_index`
    },
    {
      title: t('接口名称'),
      dataIndex: 'name',
      width: '15%',
      key: `${ulid()}_name`
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      initialValue: 'stop',
      width: '15%',
      key: `${ulid()}_status`,
      valueEnum: {
        '-1': { text: t('未运行'), status: 'Default' },
        '1': { text: t('失败'), status: 'Error' },
        '12': { text: t('运行中'), status: 'Processing' },
        '0': { text: t('成功'), status: 'Success' },
        '11': { text: t('停止'), status: 'Default' }
      }
    },
    {
      title: t('命令'),
      dataIndex: 'url',
      // ellipsis: true,
      key: `${ulid()}_url`,
      copyable: true
    },
    {
      title: t('操作'),
      // width: 220,
      width: '30%',
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
              command.on('close', () => {})
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
            row.props.record.status == '12' ? t('停止') : t('运行')
          }
        </a>,
        // @ts-expect-error no check
        row.props.record.status == '12' && (
          <a
            // <a
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
            {t('重启')}
          </a>
        ),
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
          {t('Detail')}
        </a>,
        <a
          key="link2"
          onClick={() => {
            // @ts-expect-error no check
            if (row.props.record.status == '12') {
              message.success(t('正在运行中，不可编辑'))
              return
            }
            nav({
              pathname: `/project/edit`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
                // @ts-expect-error no check
              )}&id=${row.props.record.id}`
            })
          }}
        >
          {t('Edit')}
        </a>,
        <a
          key="copy"
          onClick={() => {
            copyApi(row)
          }}
        >
          {t('Copy')}
        </a>,
        <Popconfirm
          title={t('Prompt')}
          description={t('Are you sure you want to delete this interface?')}
          onConfirm={() => {
            // @ts-expect-error no check
            if (row.props.record.status == '12') {
              message.success(t('正在运行中，不可删除'))
              return
            }
            // @ts-expect-error no check
            delProjectDetail(row.props.record.id)
          }}
          key="del"
          okText="Yes"
          cancelText="No"
        >
          <a style={{ opacity: 0.88 }}>{t('Delete')}</a>
        </Popconfirm>
      ]
    }
  ]

  const projectExport = async () => {
    const projectName: string = searchParams.get('name') as string
    await writeSettingToDownload(list, projectName)
    message.success(t('当前项目导出成功，请前往电脑下载目录查看文件'))
  }

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
        title: t('Interface List')
      }}
      toolBarRender={() => [
        <Button
          type="text"
          key="export"
          onClick={() => {
            projectExport()
            // nav({
            //   pathname: `/project/new`,
            //   search: `name=${searchParams.get('name')}&projectId=${searchParams.get('projectId')}`
            // })
          }}
        >
          {t('项目导出')}
        </Button>,
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
          {t('New Interface')}
        </Button>
      ]}
    />
  )
}
