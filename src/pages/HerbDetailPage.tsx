import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import HerbDetail from '../components/HerbDetail'
import useAppStore from '../store/useAppStore'

const HerbDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getHerbById, herbs, isLoading } = useAppStore()

  // Convert material ID to herb ID if needed
  const herbId = id?.startsWith('mat_') ? id.replace('mat_', 'herb_') : id

  const herb = herbId ? getHerbById(herbId) : undefined

  useEffect(() => {
    if (!isLoading && herbs.length > 0 && !herb) {
      // Herb not found, redirect to gallery
      navigate('/herbs')
    }
  }, [herb, herbs.length, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">正在加载药材信息...</p>
        </div>
      </div>
    )
  }

  if (!herb) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700 mb-4">药材信息未找到</p>
          <button
            onClick={() => navigate('/herbs')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回药材图鉴
          </button>
        </div>
      </div>
    )
  }

  return <HerbDetail herb={herb} />
}

export default HerbDetailPage