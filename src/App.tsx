import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { initializeStore } from './store/useAppStore'
import { ExpertList } from './components/experts/ExpertList'
import { ExpertDetail } from './components/experts/ExpertDetail'
import HerbsPage from './pages/HerbsPage'
import HerbDetailPage from './pages/HerbDetailPage'
import GraphView from './components/GraphView'
import Navigation from './components/Navigation'

function App() {
  // Initialize store on mount
  useEffect(() => {
    initializeStore()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Home - Expert List */}
              <Route path="/" element={<ExpertList />} />

              {/* Expert Routes */}
              <Route path="/experts" element={<Navigate to="/" replace />} />
              <Route path="/experts/:id" element={<ExpertDetail />} />

              {/* Herb Routes */}
              <Route path="/herbs" element={<HerbsPage />} />
              <Route path="/herb/:id" element={<HerbDetailPage />} />

              {/* Graph View */}
              <Route path="/graph" element={<GraphView />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Background decorations */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute left-10 top-20 h-32 w-32 animate-pulse rounded-full bg-green-200 opacity-5" />
          <div
            className="absolute right-20 top-40 h-24 w-24 animate-pulse rounded-full bg-blue-200 opacity-5"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-40 left-20 h-40 w-40 animate-pulse rounded-full bg-purple-200 opacity-5"
            style={{ animationDelay: '4s' }}
          />
          <div
            className="absolute bottom-20 right-10 h-28 w-28 animate-pulse rounded-full bg-indigo-200 opacity-5"
            style={{ animationDelay: '6s' }}
          />

          {/* TCM decoration elements */}
          <div className="absolute right-1/4 top-1/4 h-16 w-16 opacity-3">
            <div
              className="h-full w-full animate-spin rounded-full border-2 border-green-300"
              style={{ animationDuration: '20s' }}
            >
              <div className="absolute inset-2 rounded-full border border-green-400"></div>
              <div className="absolute inset-4 rounded-full bg-green-200"></div>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
