import { createBrowserRouter, Navigate } from 'react-router-dom'

import Home from '@/pages/home'
import ProjectList from '@/pages/project'
import MainLayout from '@/layouts/MainLayout'
import ProjectItemNew from '@/pages/project/new'
import ProjectItemList from '@/pages/project/list'
import ProjectItemEdit from '@/pages/project/edit'
import ProjectItemDetail from '@/pages/project/detail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/home" />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'project',
        element: <ProjectList />
      }
    ]
  },
  {
    path: '/project',
    element: <MainLayout />,
    children: [
      {
        path: 'list',
        element: <ProjectItemList />
      },
      {
        path: 'new',
        element: <ProjectItemNew />
      },
      {
        path: 'edit',
        element: <ProjectItemEdit />
      },
      {
        path: 'detail',
        element: <ProjectItemDetail />
      }
    ]
  }
])

export default router
