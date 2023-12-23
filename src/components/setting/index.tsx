import { useEffect, useState } from 'react'
import { Modal, Menu, Radio, Select, Space } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { getVersion } from '@tauri-apps/api/app'


import type { MenuProps } from 'antd'
type MenuItem = Required<MenuProps>['items'][number]

import './index.scss'
import { invoke } from '@tauri-apps/api'

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

export interface IAppSettingItem {
  lang?: string
  version?: string
  ffmpeg?: string
  theme?: string
}

// ts 自定义类型
type PropsType = {
  open: boolean
  setOpen: (open: boolean) => void
  setDark: (dark: boolean) => void
}

export default (props: PropsType) => {
  const { open, setOpen, setDark } = props

  // const [open, setOpen] = useState(true)
  const items: MenuProps['items'] = [
    getItem(
      '外观',
      '1',
      <img
        src="/wai-guan.svg"
        key="wai-guan"
        style={{
          height: '1em'
        }}
      />
    ),
    // getItem('通用', '2', <SettingOutlined></SettingOutlined>),
    // getItem('高级选项', '3', <SettingOutlined></SettingOutlined>),
    getItem('关于 Rebebuca', '4', <InfoCircleOutlined />)
  ]

  const [currentKey, setCurrentKey] = useState('1')

  const onClick: MenuProps['onClick'] = e => {
    setCurrentKey(e.key)
  }

  const [appSetting, setAppSetting] = useState<IAppSettingItem>({})

  const [version, setVersion] = useState('')

  const onChangeAppSetting = async (value: string, type: string) => {
    const opts = {
      ...appSetting,
      [type]: value
    }
    await invoke('update_app_setting', {
      appSetting: opts
    })
    initPage()
  }

  const initPage = async () => {
    const data: Array<IAppSettingItem> = await invoke('get_app_setting')
    if (data.length == 0) {
      const defaultSetting = {
        lang: 'ch',
        theme: 'light',
        ffmpeg: 'default',
        version: '1.0'
      }
      await invoke('add_app_setting', {
        appSetting: defaultSetting
      })
      setAppSetting(data[0])
    } else {
      setAppSetting(data[0])
    }
    const appVersion = await getVersion()
    setVersion(appVersion)
    const isDark = (data[0] || {}).theme === 'dark'
    setDark(isDark)
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <>
      <Modal
        centered
        open={open}
        footer={false}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <div className="setting-box">
          <div style={{ marginRight: '20px' }}>
            <div className="setting-left-title">设置</div>
            <Menu
              style={{ width: 256 }}
              defaultSelectedKeys={[currentKey]}
              onClick={onClick}
              items={items}
            />
          </div>
          {currentKey == '1' && (
            <div>
              <div className="setting-right-title">外观</div>
              <Space>
                <div>主题：</div>
                <Radio.Group
                  onChange={e => onChangeAppSetting(e.target.value, 'theme')}
                  value={appSetting.theme}
                >
                  <Radio value="light">浅色主题</Radio>
                  <Radio value="dark">深色主题</Radio>
                </Radio.Group>
              </Space>
            </div>
          )}
          {currentKey == '2' && (
            <div>
              <div className="setting-right-title">通用</div>
              <div>
                <Space>
                  <div>软件语言</div>
                  <Select
                    value={appSetting.lang}
                    style={{ width: 120 }}
                    onChange={e => onChangeAppSetting(e, 'lang')}
                    options={[
                      { value: 'ch', label: '中文' },
                      { value: 'en', label: '英文' }
                    ]}
                  />
                </Space>
              </div>
            </div>
          )}
          {currentKey == '3' && (
            <div>
              <div className="setting-right-title">高级选项</div>
              <div>
                <Space>
                  <div>ffmpeg来源</div>
                  <Radio.Group
                    onChange={e => onChangeAppSetting(e.target.value, 'ffmpeg')}
                    value={appSetting.ffmpeg}
                  >
                    <Radio value="default">软件自带</Radio>
                    <Radio value="local">本机自带</Radio>
                  </Radio.Group>
                </Space>
              </div>
            </div>
          )}
          {currentKey == '4' && (
            <div>
              <div className="setting-right-title">关于 Rebebuca</div>
              <div>
                <Space>
                  <div>当前版本：</div>
                  <div>{version}</div>
                </Space>
              </div>
              {/* <div>
                <Space>
                  <div>更新日志：</div>
                  <div>4</div>
                </Space>
              </div>
              <div>
                <Space>
                  <div>官方技术支持群：</div>
                  <div></div>
                </Space>
              </div> */}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
