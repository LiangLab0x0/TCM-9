import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Layers, Map, Users, BookOpen, Network } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const Navigation: React.FC = () => {
  const location = useLocation()
  const { experts, herbs } = useAppStore()

  const navItems = [
    {
      path: '/',
      label: '中医大师',
      icon: Users,
      description: '权威专家介绍',
    },
    {
      path: '/herbs',
      label: '药材图鉴',
      icon: Home,
      description: '浏览所有药材',
    },
    {
      path: '/graph',
      label: '知识图谱',
      icon: Network,
      description: '药材关系网络',
    },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/experts')
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and title */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-lg font-bold text-white">
              🌿
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">中医药典图鉴 v9.0</h1>
              <p className="text-xs text-gray-500">药典级专业数据库 • 真实中国地图</p>
            </div>
          </Link>

          {/* Navigation menu */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
                  ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
                title={item.description}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Statistics */}
          <div className="hidden items-center gap-4 text-sm lg:flex">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">{experts.length} 位专家</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">{herbs.length} 种药材</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
