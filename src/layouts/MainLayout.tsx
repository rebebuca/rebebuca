import { PageContainer } from '@ant-design/pro-components'
import ProLayout from '@ant-design/pro-layout'
import { useState } from 'react'
import { Link, useLocation, Outlet, useSearchParams } from 'react-router-dom'

import { Typography, Button } from 'antd'

const { Paragraph } = Typography

import {
  UnorderedListOutlined,
  GithubFilled,
  HomeOutlined,
  ProjectOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'

import { useLocationListen } from '../hooks'
import { shell } from '@tauri-apps/api'

export default () => {
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)
  const [searchParams] = useSearchParams()

  useLocationListen(listener => {
    setPathname(listener.pathname)
  })

  return (
    <div>
      <ProLayout
        siderWidth={300}
        collapsedButtonRender={false}
        pageTitleRender={false}
        breadcrumbRender={false}
        menuExtraRender={() => {
          return <Paragraph>{searchParams.get('name')}</Paragraph>
        }}
        layout="mix"
        logo="../../public/rebebuca.ico"
        title="Rebebuca"
        splitMenus={true}
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        route={{
          path: '/',
          routes: [
            {
              path: '/home',
              name: '首頁',
              icon: <HomeOutlined />,
            },
            {
              path: '/project',
              name: '我的项目',
              icon: <ProjectOutlined />,
              routes:
                pathname != '/project'
                  ? [
                      {
                        path: '/project/list',
                        name: '接口列表',
                        icon: <UnorderedListOutlined />,
                      },
                      {
                        path: '/project/new',
                        name: '接口新建',
                        icon: <PlusCircleOutlined />,
                      },
                      // {
                      //   path: '/project/edit',
                      //   name: '接口编辑',
                      //   icon: <PlusCircleOutlined />,
                      // },
                      // {
                      //   path: '/project/detail',
                      //   name: '接口详情',
                      //   icon: <PlusCircleOutlined />,
                      // }
                      // {
                      //   path: '/project/setting',
                      //   name: '项目设置',
                      //   icon: <SmileFilled />,
                      // },
                    ]
                  : [],
            },
          ],
        }}
        location={{
          pathname,
        }}
        token={{
          header: {
            colorBgMenuItemSelected: 'rgba(0,0,0,0.04)',
          },
        }}
        // avatarProps={{
        //   src: '../../public/rebebuca.ico',
        //   title: 'Rebebuca',
        //   size: 'small',
        // }}
        actionsRender={() => {
          // return [<Button type="link">官网</Button>, <SettingFilled key="SettingFilled" />, <GithubFilled key="GithubFilled" />]
          return [
            <Button
              type="link"
              onClick={() => {
                shell.open('https://rebebuca.com')
              }}
            >
              官网
            </Button>,
            <GithubFilled
              key="GithubFilled"
              onClick={() => {
                shell.open('https://github.com/rebebuca')
              }}
            />,
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
  )
}
