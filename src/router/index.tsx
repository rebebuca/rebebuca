import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/home'
import ProjectList from '../pages/project'
import ProjectItemList from '../pages/project/list'
import ProjectItemNew from '../pages/project/new'
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
        path: 'setting',
        element: <ProjectSetting />,
      },
    ],
  },
])

export default router
