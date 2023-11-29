import { PageContainer } from '@ant-design/pro-components'
import ProLayout from '@ant-design/pro-layout'
import { useState } from 'react'
import { Link, useLocation, Outlet, useSearchParams } from 'react-router-dom'

import { Typography } from 'antd'

const { Paragraph } = Typography

import { SmileFilled, SettingFilled, GithubFilled } from '@ant-design/icons'

import { useLocationListen } from '../hooks'

export default () => {
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)
  const [searchParams] = useSearchParams()

  useLocationListen(listener => {
    setPathname(listener.pathname)
  })

  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
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
              icon: <SmileFilled />,
            },
            {
              path: '/project',
              name: '我的项目',
              icon: <SmileFilled />,
              routes:
                pathname != '/project'
                  ? [
                      {
                        path: '/project/list',
                        name: '接口管理',
                        icon: <SmileFilled />,
                      },
                      {
                        path: '/project/new',
                        name: '新建接口',
                        icon: <SmileFilled />,
                      },
                      {
                        path: '/project/setting',
                        name: '项目设置',
                        icon: <SmileFilled />,
                      },
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
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          title: 'godkun',
          size: 'small',
        }}
        actionsRender={props => {
          return [<SettingFilled key="SettingFilled" />, <GithubFilled key="GithubFilled" />]
        }}
        menuItemRender={(item, dom) => (
          <Link
            to={`${item.path}?name=${searchParams.get('name')}`}
            onClick={() => {
              console.log(444, item.path)
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
