import React, { useEffect, useState } from 'react'
import { shell } from '@tauri-apps/api'
import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useTranslation } from 'react-i18next'
import { argKeyList } from '@/constants/keys'
import { argKeyListEn } from '@/constants/keys-en'
import './index.scss'

import i18next from 'i18next'

interface DataType {
  key: React.Key
  value: string
  label: string
}

const data: DataType[] = argKeyList.map(item => {
  return {
    key: item.value,
    value: item.value,
    label: item.label
  }
})

const dataEN = argKeyListEn.map(item => {
  return {
    key: item.value,
    value: item.value,
    label: item.label
  }
})

const FFmpegParamTable: React.FC = () => {
  const { t } = useTranslation()
  const [list, setList] = useState(data)

  const columns: TableColumnsType<DataType> = [
    {
      title: t('参数'),
      dataIndex: 'value',
      filters: [
        {
          text: '-i',
          value: '-i'
        }
      ],
      width: '33%',
      filterSearch: true,
      // @ts-ignore
      onFilter: (value: string, record) => record.value.startsWith(value)
    },
    {
      title: t('参数注释'),
      dataIndex: 'label',
      render: (value: string, record) => (
        <div className="param-zs">
          {value}
          <img
            className="link-svg"
            src="/link.svg"
            alt=""
            onClick={() => {
              shell.open(
                `https://rebebuca.com/guide/ffmpeg%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0%E5%A4%A7%E5%85%A8.html#${record.value.replace(
                  '-',
                  ''
                )}`
              )
            }}
          />
        </div>
      )
    }
  ]

  useEffect(() => {
    if (i18next.language == 'en') {
      setList(dataEN)
    }
  }, [])
  i18next.on('languageChanged', lng => {
    if (lng == 'en') {
      setList(dataEN)
    } else {
      setList(data)
    }
  })
  return (
    <Table
      pagination={false}
      scroll={{ y: 400 }}
      size="small"
      columns={columns}
      dataSource={list}
    />
  )
}

export default FFmpegParamTable
