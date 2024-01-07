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
import { PageContainer } from '@ant-design/pro-components'
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

// 存储窗口最大化前的大小
appWindow.innerSize().then(size => {
  const has = localStorage.getItem('originalSize')
  if (!has) localStorage.setItem('originalSize', JSON.stringify(size))
  else return
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
    localStorage.setItem('position', JSON.stringify(position))
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

  useEffect(() => {
    initAppSetting()
    setLocalStorage()
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
        {/* <div className={isMaximize ? '' : 'custom-pro-layout'}> */}
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
          siderWidth={300}
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
                          name: t('Interface List'),
                          icon: <UnorderedListOutlined />
                        },
                        {
                          path: '/project/new',
                          name: t('Interface New'),
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
          <PageContainer>
            <Outlet />
          </PageContainer>
        </ProLayout>
      </div>
    </ConfigProvider>
  )
}
