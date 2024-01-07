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

import { runFFmpeg } from '@/utils'
import { updateCommand, resetCommandLog } from '@/store/commandList'
import { writeSettingToDownload } from '@/utils/export'

export type ListItem = {
  id: string
  project_id: string
  name: string
  url: string
  updated_at: string
  status: string
  pid: number
  arg_list?: string
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
    message.success(t('successfully deleted'), 2)
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
  const copyApi = async (record: ListItem) => {
    const opts = record
    const projectDetail = {
      id: ulid(),
      status: '-1',
      project_id: opts.project_id,
      updated_at: dayjs().format(),
      name: opts.name,
      url: opts.url,
      log: '',
      pid: 0,
      arg_list: opts.arg_list
    }
    await invoke('add_project_detail', {
      projectDetail
    })
    getProjectDetail()
    message.success(t('复制成功'), 2)
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
      key: `${ulid()}_url`,
      copyable: true
    },
    {
      title: t('操作'),
      width: '30%',
      key: `${ulid()}_option`,
      valueType: 'option',
      render: (_, record: ListItem) => [
        <a
          key="link4"
          onClick={async () => {
            const item = record
            if (item.status != '12') updateProjectDetailStatus(item, '12')
            const showStop = item.status == '12'
            if (showStop) {
              let command
              const os = localStorage.getItem('os')
              if (os == 'win32') {
                const cmd = `/C taskkill /f /t /pid ${item.pid}`
                command = await new Command('ffmpeg', cmd)
              } else {
                // TODO: mac
                // const cmd = `/C taskkill /f /t /pid ${item.pid}`
                const cmd = `${item.pid}`
                command = await new Command('kill-process', cmd)
                // command = await new Command('mac-ffmpeg', cmd)
              }
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
                    pid: s!.pid,
                    log: line,
                    item: item
                  })
                )
              })
            }
          }}
        >
          {record.status == '12' ? t('停止') : t('运行')}
        </a>,
        record.status == '12' && (
          <a
            // <a
            key="link11"
            onClick={async () => {
              const item = record
              const showStop = item.status == '12'
              if (showStop) {
                let command
                const os = localStorage.getItem('os')
                if (os == 'win32') {
                  const cmd = `/C taskkill /f /t /pid ${item.pid}`
                  command = await new Command('ffmpeg', cmd)
                } else {
                  // TODO: mac
                  // const cmd = `/C taskkill /f /t /pid ${item.pid}`
                  // command = await new Command('mac-ffmpeg', cmd)
                  const cmd = `${item.pid}`
                  command = await new Command('kill-process', cmd)
                }
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
                        pid: s!.pid,
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
                      pid: s!.pid,
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
              )}&id=${record.id}`
            })
          }}
        >
          {t('Detail')}
        </a>,
        <a
          key="link2"
          onClick={() => {
            if (record.status == '12') {
              message.success(t('正在运行中，不可编辑'), 2)
              return
            }
            nav({
              pathname: `/project/edit`,
              search: `name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
              )}&id=${record.id}`
            })
          }}
        >
          {t('Edit')}
        </a>,
        <a
          key="copy"
          onClick={() => {
            copyApi(record)
          }}
        >
          {t('Copy')}
        </a>,
        <Popconfirm
          title={t('Prompt')}
          description={t('Are you sure you want to delete this interface?')}
          onConfirm={() => {
            if (record.status == '12') {
              message.success(t('正在运行中，不可删除'), 2)
              return
            }
            delProjectDetail(record.id as string)
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
    message.success(t('当前项目导出成功，请前往电脑下载目录查看文件'), 2)
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
        pageSize: 8
        // showQuickJumper: true
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
