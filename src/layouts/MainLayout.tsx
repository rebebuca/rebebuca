import { useEffect, useState } from 'react'
import { invoke, shell, os } from '@tauri-apps/api'
import {
  Typography,
  Button,
  ConfigProvider,
  theme,
  Modal,
  Radio,
  Space,
  RadioChangeEvent
} from 'antd'
import ProLayout from '@ant-design/pro-layout'
import { PhysicalPosition, PhysicalSize, appWindow } from '@tauri-apps/api/window'
import { Link, useLocation, Outlet, useSearchParams } from 'react-router-dom'
import AppSetting from '@/components/setting'
import { useTranslation } from 'react-i18next'

import { useDispatch } from 'react-redux'
import { setSettings } from '@/store/settings'

import '@/utils/i18n'

import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'

import './index.scss'

import { window as tauriWindow } from '@tauri-apps/api'

document.addEventListener('mousedown', async e => {
  const darag = '.ant-pro-top-nav-header'
  const nodarag = 'a, .ant-pro-global-header-header-actions-item'
  const target = e.target as HTMLElement
  if (target.closest(nodarag)) {
    return
  }
  if (target.closest(darag)) {
    await tauriWindow.appWindow.startDragging()
  }
})

import {
  UnorderedListOutlined,
  GithubFilled,
  HomeOutlined,
  ProjectOutlined,
  PlusCircleOutlined,
  MinusOutlined,
  CloseOutlined,
  BorderOutlined,
  SettingOutlined
} from '@ant-design/icons'

const { Paragraph } = Typography

import { useLocationListen } from '@/hooks'
import { getLocalFFPath } from '@/utils/getLocalFFPath'

export interface IAppSettingItem {
  lang?: string
  version?: string
  ffmpeg?: string
  theme?: string
  quit_type?: string
}

export default () => {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const [pathname, setPathname] = useState(location.pathname)
  const [searchParams] = useSearchParams()
  // const [open, setOpen] = useState(true)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [appSetting, setAppSetting] = useState<IAppSettingItem>({})

  const [isMaximize, setIsMaximize] = useState(false)

  const [locale, setLocale] = useState(zhCN)

  const dispatch = useDispatch()

  const updateSettings = (newSettings: IAppSettingItem) => {
    dispatch(setSettings(newSettings))
  }

  const minimize = async () => {
    await appWindow.minimize()
  }

  const maximize = async () => {
    const position = await appWindow.innerPosition()
    const innerSize = await appWindow.innerSize()
    localStorage.setItem('position', JSON.stringify(position))
    localStorage.setItem('originalSize', JSON.stringify(innerSize))
    await appWindow.maximize()
    setIsMaximize(true)
  }

  const unmaximize = async () => {
    setIsMaximize(false)
    const positionStr = localStorage.getItem('position')!
    const originalSizeStr = localStorage.getItem('originalSize')!
    const originalSize = JSON.parse(originalSizeStr)
    const position = JSON.parse(positionStr)
    await appWindow.setPosition(new PhysicalPosition(position.x, position.y))
    await appWindow.setSize(new PhysicalSize(originalSize.width, originalSize.height))
  }

  const close = async () => {
    // 获取所有正在运行的程序
    showModal()
  }

  useLocationListen(listener => {
    setPathname(listener.pathname)
  })

  const initAppSetting = async () => {
    const setting: Array<IAppSettingItem> = await invoke('get_app_setting')
    if (setting.length == 0) {
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
      const new_setting: Array<IAppSettingItem> = await invoke('get_app_setting')
      setDark(new_setting[0].theme === 'dark')
      setAppSetting(new_setting[0])
      i18n.changeLanguage(new_setting[0].lang)
      if (new_setting[0].lang == 'ch') {
        setLocale(zhCN)
      } else if (new_setting[0].lang == 'en') {
        setLocale(enUS)
      }
      localStorage.setItem('ffmpeg', 'default')
    } else {
      setAppSetting(setting[0])
      setDark(setting[0].theme === 'dark')
      i18n.changeLanguage(setting[0].lang)
      if (setting[0].lang == 'ch') {
        setLocale(zhCN)
      } else if (setting[0].lang == 'en') {
        setLocale(enUS)
      }
      localStorage.setItem('ffmpeg', setting[0].ffmpeg as string)
      updateSettings({
        ...setting[0]
      })
    }
  }

  const setLang = (value: string) => {
    if (value == 'ch') {
      setLocale(zhCN)
    } else if (value == 'en') {
      setLocale(enUS)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = async () => {
    const setting: Array<IAppSettingItem> = await invoke('get_app_setting')
    setAppSetting(setting[0])
    const quit_type = setting[0].quit_type
    if (quit_type == '1') setIsModalOpen(true)
    else if (quit_type == '2') {
      await appWindow.minimize()
    } else await appWindow.close()
  }

  const handleOk = async () => {
    setIsModalOpen(false)
    await appWindow.close()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onChange = async (e: RadioChangeEvent) => {
    const setting: Array<IAppSettingItem> = await invoke('get_app_setting')
    const opts = {
      ...setting[0],
      quit_type: e.target.value
    }
    await invoke('update_app_setting', {
      appSetting: opts
    })
    const res: Array<IAppSettingItem> = await invoke('get_app_setting')
    setAppSetting(res[0])
  }

  const setLocalStorage = async () => {
    const platformName = await os.platform()
    localStorage.setItem('os', platformName)
  }

  const setLocalFFPath = async () => {
    const path = (await getLocalFFPath()) || ''
    localStorage.setItem('localFFPath', path)
  }

  useEffect(() => {
    initAppSetting()
    setLocalStorage()
    setLocalFFPath()
  }, [])

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      {appSetting.theme && (
        <AppSetting
          open={open}
          setOpen={setOpen}
          setLocale={value => {
            setLang(value)
          }}
          setDark={dark => {
            setDark(dark)
          }}
        ></AppSetting>
      )}
      <div>
        <Modal
          title="确定要退出rebebuca吗？"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>{t('退出后，正在运行的程序会自动结束')}</p>
          <p>{t('下次关闭，希望：')}</p>
          <Radio.Group onChange={onChange} value={appSetting.quit_type}>
            <Space direction="vertical">
              <Radio value="1">{t('提醒我')}</Radio>
              <Radio value="2">{t('最小化托盘')}</Radio>
              <Radio value="3">{t('退出')}</Radio>
            </Space>
          </Radio.Group>
        </Modal>
        <ProLayout
          siderWidth={200}
          collapsedButtonRender={false}
          pageTitleRender={false}
          breadcrumbRender={false}
          menuExtraRender={() => {
            return <Paragraph>{searchParams.get('name')}</Paragraph>
          }}
          layout="mix"
          logo="data:image/png;base64,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"
          title="Rebebuca"
          splitMenus={true}
          route={{
            path: '/',
            routes: [
              {
                path: '/home',
                name: t('Home'),
                icon: <HomeOutlined />
              },
              {
                path: '/project',
                name: t('My Project'),
                icon: <ProjectOutlined />,
                routes:
                  pathname != '/project'
                    ? [
                        {
                          path: '/project/list',
                          name: t('Command List'),
                          icon: <UnorderedListOutlined />
                        },
                        {
                          path: '/project/new',
                          name: t('Command New'),
                          icon: <PlusCircleOutlined />
                        }
                      ]
                    : []
              }
            ]
          }}
          location={{
            pathname
          }}
          token={{
            header: {
              colorBgMenuItemSelected: 'rgba(0,0,0,0.04)'
            }
          }}
          actionsRender={() => {
            return [
              <Button
                type="text"
                key="gw"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '14px',
                  color: dark ? '#fff' : '#252525'
                }}
                onClick={() => {
                  shell.open('https://rebebuca.com')
                }}
              >
                {/* 官网 */}
                {t('Official Website')}
              </Button>,
              <GithubFilled
                key="github"
                style={{ fontSize: '14px', color: dark ? '#fff' : '#252525' }}
                onClick={() => {
                  shell.open('https://github.com/rebebuca')
                }}
              />,
              <SettingOutlined
                onClick={() => {
                  setOpen(true)
                }}
                key="setting"
                style={{ fontSize: '14px', color: dark ? '#fff' : '#252525' }}
              />,
              <MinusOutlined
                key="mini"
                onClick={minimize}
                style={{ fontSize: '14px', color: dark ? '#fff' : '#252525' }}
              />,
              isMaximize && (
                <img
                  src={!dark ? '/unmini.svg' : '/unmini-light.svg'}
                  onClick={unmaximize}
                  key="unmini"
                  className="max-icon"
                  style={{
                    fontSize: '14px',
                    width: '35px'
                  }}
                />
              ),
              !isMaximize && (
                <BorderOutlined
                  onClick={maximize}
                  key="maximize"
                  style={{
                    fontSize: '14px',
                    color: dark ? '#fff' : '#252525'
                  }}
                />
              ),
              <CloseOutlined
                onClick={close}
                key="close"
                style={{ fontSize: '14px', color: dark ? '#fff' : '#252525', marginRight: '10px' }}
              />
            ]
          }}
          menuItemRender={(item, dom) => (
            <Link
              to={`${item.path}?name=${searchParams.get('name')}&projectId=${searchParams.get(
                'projectId'
              )}`}
              onClick={() => {
                setPathname(item.path || '/project')
              }}
            >
              {dom}
            </Link>
          )}
        >
          <Outlet />
        </ProLayout>
      </div>
    </ConfigProvider>
  )
}
