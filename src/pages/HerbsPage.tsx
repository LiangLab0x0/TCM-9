import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Map, GitCompare } from 'lucide-react'
import HerbGallery from '../components/HerbGallery'
import MaterialOriginMapRSM from '../components/MaterialOriginMapRSM'
import HerbCompare from '../components/HerbCompare'

const HerbsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gallery')

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 my-4">
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                药材图鉴
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                产地地图
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                药材对比
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="gallery" className="mt-0">
          <HerbGallery />
        </TabsContent>

        <TabsContent value="map" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <MaterialOriginMapRSM />
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-0">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <HerbCompare />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HerbsPage