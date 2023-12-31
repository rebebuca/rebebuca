import { useEffect, useState } from 'react'
import { Modal, Menu, Radio, Select, Space, Tooltip, QRCode } from 'antd'
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { getVersion } from '@tauri-apps/api/app'

import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import { setSettings } from '../../store/settingSlice'

import type { MenuProps } from 'antd'
type MenuItem = Required<MenuProps>['items'][number]

import './index.scss'
import { invoke } from '@tauri-apps/api'
import { Command } from '@tauri-apps/api/shell'
import Link from 'antd/lib/typography/Link'

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
  quit_type?: string
}

// ts 自定义类型
type PropsType = {
  open: boolean
  setOpen: (open: boolean) => void
  setDark: (dark: boolean) => void
  setLocale: (value: string) => void
}

export default (props: PropsType) => {
  const { t, i18n } = useTranslation()
  const { open, setOpen, setDark, setLocale } = props

  // const [open, setOpen] = useState(true)
  const items: MenuProps['items'] = [
    getItem(
      t('Appearance'),
      '1',
      <img
        src="/wai-guan.svg"
        key="wai-guan"
        style={{
          height: '1em'
        }}
      />
    ),
    getItem(t('General'), '2', <SettingOutlined></SettingOutlined>),
    getItem(t('高级选项'), '3', <SettingOutlined></SettingOutlined>),
    getItem(t('About Rebebuca'), '4', <InfoCircleOutlined />)
  ]

  const [currentKey, setCurrentKey] = useState('1')

  const onClick: MenuProps['onClick'] = e => {
    setCurrentKey(e.key)
  }

  const [appSetting, setAppSetting] = useState<IAppSettingItem>({})

  const [version, setVersion] = useState('')
  const [defaultVersion, setDefaultVersion] = useState('')
  const [localVersion, setLocalVersion] = useState('')
  const [disabled, setDisabled] = useState(true)

  const dispatch = useDispatch()

  const updateSettings = (newSettings: IAppSettingItem) => {
    dispatch(setSettings(newSettings))
  }

  const checkFF = async () => {
    try {
      const os = localStorage.getItem('os')
      let cmd
      if (os == 'win32') {
        cmd = await new Command('ffmpeg', '/C ffmpeg -version').execute()
      } else {
        // TODO: mac
        cmd = await new Command('mac-ffmpeg', '/C ffmpeg -version').execute()
      }
      if (cmd.stdout) {
        const versionRegex = /ffmpeg version (\S+)/

        // Extracting the version
        const match = cmd.stdout.match(versionRegex)
        const version = match ? match[1] : 'Version not found'

        setDisabled(false)
        setLocalVersion(version)
      }
    } catch (error) {
      setDisabled(true)
      console.log('error: ', error)
    }
  }

  const runLocalFF = async () => {
    const cmd = await Command.sidecar('bin/ffmpeg', ['-version']).execute()
    if (cmd.stdout) {
      const versionRegex = /ffmpeg version (\S+)/
      const match = cmd.stdout.match(versionRegex)
      const version = match ? match[1] : 'Version not found'
      setDefaultVersion(version)
    }
  }

  useEffect(() => {
    if (open == true) {
      checkFF()
      runLocalFF()
    }
  }, [open])

  const onChangeAppSetting = async (value: string, type: string) => {
    const opts = {
      ...appSetting,
      [type]: value
    }
    updateSettings({
      ...opts
    })
    await invoke('update_app_setting', {
      appSetting: opts
    })
    if (type == 'ffmpeg') {
      localStorage.setItem('ffmpeg', value)
    }
    if (type == 'lang') {
      i18n.changeLanguage(value)
      setLocale(value)
    }
    initPage()
  }

  const initPage = async () => {
    const data: Array<IAppSettingItem> = await invoke('get_app_setting')
    if (data.length == 0) {
      const defaultSetting = {
        lang: 'ch',
        theme: 'light',
        ffmpeg: 'default',
        version: '1.0',
        quit_type: '1'
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
            <div className="setting-left-title">{t('Preferences')}</div>
            <Menu
              style={{ width: 256 }}
              defaultSelectedKeys={[currentKey]}
              onClick={onClick}
              items={items}
            />
          </div>
          {currentKey == '1' && (
            <div>
              <div className="setting-right-title">{t('Appearance')}</div>
              <Space>
                <div>{t('Theme')}：</div>
                <Radio.Group
                  onChange={e => onChangeAppSetting(e.target.value, 'theme')}
                  value={appSetting.theme}
                >
                  <Radio value="light">{t('light theme')}</Radio>
                  <Radio value="dark">{t('dark theme')}</Radio>
                </Radio.Group>
              </Space>
            </div>
          )}
          {currentKey == '2' && (
            <div>
              <div className="setting-right-title">{t('General')}</div>
              <div>
                <Space>
                  <div>{t('Language')}</div>
                  <Select
                    value={appSetting.lang}
                    style={{ width: 160 }}
                    onChange={e => onChangeAppSetting(e, 'lang')}
                    options={[
                      { value: 'ch', label: t('Chinese') },
                      { value: 'en', label: t('English') }
                    ]}
                  />
                </Space>
              </div>
              <div className="setting-right-item">
                <Space>
                  <div>{t('所有窗口关闭时')}</div>
                  <Select
                    value={appSetting.quit_type}
                    style={{ width: 160 }}
                    onChange={e => onChangeAppSetting(e, 'quit_type')}
                    options={[
                      { value: '1', label: t('提醒我') },
                      { value: '2', label: t('最小化托盘') },
                      { value: '3', label: t('退出') }
                    ]}
                  />
                </Space>
              </div>
            </div>
          )}
          {currentKey == '3' && (
            <div>
              <div className="setting-right-title">{t('高级选项')}</div>
              <div>
                <Space align="baseline">
                  <Tooltip title={t('切换来源不会影响正在运行中的命令')}>
                    <div>
                      {t('FFMPEG 来源')} <InfoCircleOutlined />
                    </div>
                  </Tooltip>
                  <Radio.Group
                    onChange={e => onChangeAppSetting(e.target.value, 'ffmpeg')}
                    value={appSetting.ffmpeg}
                  >
                    <Space direction="vertical">
                      <Radio value="default">
                        {t('软件自带')}({defaultVersion})
                      </Radio>
                      <Radio disabled={disabled} value="local">
                        {t('本机自带')}({disabled ? t('没有检测到') : localVersion})
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </div>
            </div>
          )}
          {currentKey == '4' && (
            <div>
              <div className="setting-right-title">{t('About Rebebuca')}</div>
              <div className="setting-right-item">
                <Space>
                  <div>{t('Version')}：</div>
                  <div>{version}</div>
                </Space>
              </div>
              <div className="setting-right-item">
                <Space>
                  <div>{t('更新日志：')}</div>
                  <Link href="https://ant.design" target="_blank">
                    {`https://github.com/rebebuca/rebebuca/releases/tag/${version}`}
                  </Link>
                </Space>
              </div>
              <div className="setting-right-item">
                <Space align="start">
                  <div>{t('官方技术支持群：')}</div>
                  <QRCode errorLevel="H" value="https://ant.design/" icon="/rebebuca.ico" />
                </Space>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
