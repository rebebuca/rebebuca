import React, { useRef, useState } from 'react'
import {
  Tabs,
  Col,
  Space,
  Form,
  Input,
  Badge,
  Button,
  Descriptions,
  Typography,
  Segmented,
} from 'antd'
import type { DescriptionsProps } from 'antd'

const descItems: DescriptionsProps['items'] = [
  {
    key: '1',
    label: '接口 URL',
    children:
      'ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj ffmpeg sss hjfdoijoisfj',
    span: 3,
  },
  {
    key: '6',
    label: '运行状态',
    children: <Badge status="processing" text="Running" />,
    span: 3,
  },
  {
    key: '10',
    label: '输出日志',
    children: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
        <br />
        Storage space: 10 GB
        <br />
        Replication factor: 3
        <br />
        Region: East China 1
        <br />
      </>
    ),
  },
]

import type { ProColumns } from '@ant-design/pro-components'
import { EditableProTable, ProForm, ProFormText, ProCard } from '@ant-design/pro-components'
import { message } from 'antd'

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type DataSourceType = {
  id: React.Key
  title?: string
  decs?: string
  state?: string
  created_at?: number
  children?: DataSourceType[]
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: 1590486176000,
  },
  {
    id: 624691229,
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: 1590481162000,
  },
]

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '参数key',
    width: '30%',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '参数value',
    dataIndex: 'title',
    width: '50%',
  },
  // {
  //   title: '描述',
  //   dataIndex: 'decs',
  //   renderFormItem: (_, { record }) => {
  //     console.log('----===>', record);
  //     return <Input addonBefore={(record as any)?.addonBefore} />;
  //   },
  // },
  {
    title: '操作',
    valueType: 'option',
  },
]

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const initialItems = [{ label: '新建接口', children: '', key: '1' }]

const ProjectItemNew: React.FC = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const newTabIndex = useRef(0)

  const { Title } = Typography

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map(item => item.id)
  )

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
  }

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`
    const newPanes = [...items]
    newPanes.push({ label: '新建接口', children: '', key: newActiveKey })
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey
    let lastIndex = -1
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = items.filter(item => item.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add()
    } else {
      remove(targetKey)
    }
  }

  const onFinish = (values: any) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  type FieldType = {
    username?: string
    password?: string
    remember?: string
  }

  return (
    <div>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
      {items.map(item => {
        if (item.key == activeKey)
          return (
            <ProCard
              // title="接口设置"
              // extra="2019年9月28日"
              split="vertical"
              // bordered
              // headerBordered
            >
              <ProCard title="" colSpan="50%">
                <Space direction="vertical">
                  <Segmented options={['新建', '高级设置']} />
                  {/* <ProCard title="新建" colSpan="50%"> */}
                  <ProForm<{
                    name: string
                    company: string
                  }>
                    grid
                    submitter={{
                      searchConfig: {
                        submitText: '保存',
                        resetText: '重置',
                      },
                      resetButtonProps: {
                        style: {
                          // 隐藏重置按钮
                          display: 'none',
                        },
                      },
                      submitButtonProps: {},
                      render: (props, doms) => {
                        console.log(props)
                        return [
                          <Button key="rest" onClick={() => props.form?.resetFields()}>
                            重置
                          </Button>,
                          <Button
                            type="primary"
                            key="submit"
                            onClick={() => props.form?.submit?.()}
                          >
                            保存
                          </Button>,
                          <Button
                            type="primary"
                            key="submit"
                            onClick={() => props.form?.submit?.()}
                          >
                            运行
                          </Button>,
                        ]
                      },
                    }}
                    onFinish={async values => {
                      await waitTime(2000)
                      console.log(values)
                      message.success('提交成功')
                    }}
                    initialValues={{
                      name: '蚂蚁设计有限公司',
                      useMode: 'chapter',
                    }}
                  >
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="name"
                        label="接口名称"
                        // tooltip="最长为 24 位"
                        placeholder="请输入名称"
                      />
                    </ProForm.Group>
                    <ProForm.Item
                      label="FFMPEG参数设置"
                      name="dataSource"
                      initialValue={defaultData}
                      trigger="onValuesChange"
                    >
                      <EditableProTable<DataSourceType>
                        rowKey="id"
                        toolBarRender={false}
                        columns={columns}
                        recordCreatorProps={{
                          newRecordType: 'dataSource',
                          position: 'top',
                          record: () => ({
                            id: Date.now(),
                            addonBefore: 'ccccccc',
                            decs: 'testdesc',
                          }),
                        }}
                        editable={{
                          type: 'multiple',
                          editableKeys,
                          onChange: setEditableRowKeys,
                          actionRender: (row, _, dom) => {
                            return [dom.delete]
                          },
                        }}
                      />
                    </ProForm.Item>
                  </ProForm>
                </Space>
              </ProCard>
              <ProCard title="">
                <Space direction="vertical">
                  {/* <ProCard title="运行"> */}
                  <Segmented options={['运行面板', '其他选项']} />
                  <Descriptions items={descItems} />
                </Space>
              </ProCard>
            </ProCard>
          )
      })}
    </div>
  )
}

export default ProjectItemNew
