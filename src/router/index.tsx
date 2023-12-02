import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/home'
import ProjectList from '../pages/project'
import ProjectItemList from '../pages/project/list'
import ProjectItemNew from '../pages/project/new'
import ProjectItemEdit from '../pages/project/edit'
import ProjectItemDetail from '../pages/project/detail'

import ProjectSetting from '../pages/project/setting'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/project" />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'project',
        element: <ProjectList />,
      },
    ],
  },
  {
    path: '/project',
    element: <MainLayout />,
    children: [
      {
        path: 'list',
        element: <ProjectItemList />,
      },
      {
        path: 'new',
        element: <ProjectItemNew />,
      },
      {
        path: 'edit',
        element: <ProjectItemEdit />,
      },
      {
        path: 'detail',
        element: <ProjectItemDetail />,
      },
      {
        path: 'setting',
        element: <ProjectSetting />,
      },
    ],
  },
])

export default router
