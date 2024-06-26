import { useEffect, useState } from 'react'
import { Modal, Menu, Radio, Select, Space, Tooltip, Form, Input } from 'antd'
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { getVersion } from '@tauri-apps/api/app'

import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import { setSettings } from '@/store/settings'

import type { MenuProps } from 'antd'
type MenuItem = Required<MenuProps>['items'][number]

import './index.scss'
import { invoke } from '@tauri-apps/api'
import { Command } from '@tauri-apps/api/shell'
import Link from 'antd/lib/typography/Link'

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } }

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
  ai: {
    type: string
    key: string
    openaiKey: string
  }
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

  const [currentKey, setCurrentKey] = useState('3')

  const onClick: MenuProps['onClick'] = e => {
    setCurrentKey(e.key)
  }

  const [appSetting, setAppSetting] = useState<IAppSettingItem>({
    ai: {
      type: '2',
      key: '',
      openaiKey: ''
    }
  })

  const [version, setVersion] = useState('')
  const [defaultVersion, setDefaultVersion] = useState('')
  const [localVersion, setLocalVersion] = useState('')
  const [disabled, setDisabled] = useState(true)

  const dispatch = useDispatch()

  const updateSettings = (newSettings: IAppSettingItem) => {
    dispatch(setSettings(newSettings))
  }

  const checkFF = async () => {
    const localFFPath = localStorage.getItem('localFFPath')
    try {
      const os = localStorage.getItem('os')
      let cmd
      if (os == 'win32') {
        const cmdStr = `/C ${localFFPath} -version`
        cmd = await new Command('ffmpeg', cmdStr).execute()
      } else {
        cmd = await new Command('mac-ffmpeg', `-version`).execute()
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
    try {
      const cmd = await Command.sidecar('bin/ffmpeg', ['-version']).execute()
      if (cmd.stdout) {
        const versionRegex = /ffmpeg version (\S+)/
        const match = cmd.stdout.match(versionRegex)
        const version = match ? match[1] : 'Version not found'
        setDefaultVersion(version)
      }
    } catch (error) {
      console.log(error)
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
      appSetting: {
        ...opts,
        ai: JSON.stringify(opts.ai)
      }
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

  const onChangeAppAiSetting = async (action: number, value: string, type: string) => {
    if (action == 1) {
      const opts = {
        ...appSetting,
        ai: {
          type: value,
          key: appSetting.ai.key || '',
          openaiKey: appSetting.ai.openaiKey || '',
          [type]: value
        }
      }
      updateSettings({
        ...opts
      })
      await invoke('update_app_setting', {
        appSetting: {
          ...opts,
          ai: JSON.stringify(opts.ai)
        }
      })
      localStorage.setItem('ai-type', value)
      if (value == '2') localStorage.setItem('ai-key', opts.ai.key)
      else if (value == '3') localStorage.setItem('ai-key', opts.ai.openaiKey)
      else localStorage.setItem('ai-key', '')
    }
    if (action == 2) {
      const opts = {
        ...appSetting,
        ai: {
          type: appSetting.ai.type,
          key: appSetting.ai.key || '',
          openaiKey: appSetting.ai.openaiKey || '',
          [type]: value
        }
      }
      updateSettings({
        ...opts
      })
      await invoke('update_app_setting', {
        appSetting: {
          ...opts,
          ai: JSON.stringify(opts.ai)
        }
      })
      // localStorage.setItem('ai-type', type)
      if (type == 'key') localStorage.setItem('ai-key', opts.ai.key)
      else if (type == 'openaiKey') localStorage.setItem('ai-key', opts.ai.openaiKey)
      else localStorage.setItem('ai-key', '')
    }
    initPage()
  }

  const initPage = async () => {
    const data: Array<any> = await invoke('get_app_setting')
    if (data.length == 0) {
      const defaultSetting = {
        lang: 'ch',
        theme: 'light',
        ffmpeg: 'default',
        ai: JSON.stringify({
          type: '2',
          key: '',
          openaiKey: ''
        }),
        version: '1.0',
        quit_type: '1'
      }
      await invoke('add_app_setting', {
        appSetting: defaultSetting
      })
      setAppSetting(data[0])
    } else {
      data[0].ai = JSON.parse(data[0].ai)
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
              <div className="setting-right-item">
                <Space align="baseline">
                  <div>{t('AI')}</div>
                  <div className="ai">
                    <Radio.Group
                      onChange={e => onChangeAppAiSetting(1, e.target.value, 'type')}
                      value={appSetting.ai.type}
                    >
                      <Space>
                        <Radio value={'1'}>{t('none')}</Radio>
                        <Radio disabled={disabled} value={'2'}>
                          {t('deepseek')}
                        </Radio>
                        <Radio disabled={disabled} value={'3'}>
                          {t('openai')}
                        </Radio>
                      </Space>
                    </Radio.Group>
                    {appSetting.ai.type == '2' && (
                      <div className="ai-form">
                        <Form {...formItemLayout} layout="horizontal" style={{ maxWidth: 600 }}>
                          <Form.Item label="key">
                            <Input.Password
                              placeholder="input deepseek key"
                              value={appSetting.ai.key}
                              onChange={e => onChangeAppAiSetting(2, e.target.value, 'key')}
                            />
                            <div>{t('如果是空内容，则加载环境变量 DEEPSEEK_API_KEY')}</div>
                          </Form.Item>
                        </Form>
                      </div>
                    )}
                    {appSetting.ai.type == '3' && (
                      <div className="ai-form">
                        <Form {...formItemLayout} layout="horizontal" style={{ maxWidth: 600 }}>
                          <Form.Item label="key">
                            <Input.Password
                              placeholder="input openai key"
                              value={appSetting.ai.openaiKey}
                              onChange={e => onChangeAppAiSetting(2, e.target.value, 'openaiKey')}
                            />
                            <div>{t('如果是空内容，则加载环境变量 OPENAI_API_KEY')}</div>
                          </Form.Item>
                        </Form>
                      </div>
                    )}
                  </div>
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
                  <div>v{version}</div>
                </Space>
              </div>
              <div className="setting-right-item">
                <Space>
                  <div>{t('更新日志：')}</div>
                  <Link
                    href={`https://github.com/rebebuca/rebebuca/releases/tag/v${version}`}
                    target="_blank"
                  >
                    {`https://github.com/rebebuca/rebebuca/releases/tag/v${version}`}
                  </Link>
                </Space>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
