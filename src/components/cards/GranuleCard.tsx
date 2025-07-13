import React from 'react'
import { motion } from 'framer-motion'
import { Package, Leaf, Factory } from 'lucide-react'

interface GranuleCardProps {
  granule: {
    id: string
    names: {
      cn: string
      pinyin: string
      latin?: string
    }
    baseMaterial?: string
    concentration?: string
    manufacturer?: string
    specification?: string
    thumbnail?: string
  }
}

export const GranuleCard: React.FC<GranuleCardProps> = ({ granule }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="aspect-square relative bg-gradient-to-br from-amber-50 to-orange-50">
        {granule.thumbnail ? (
          <img
            src={granule.thumbnail}
            alt={granule.names.cn}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-20 h-20 text-amber-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{granule.names.cn}</h3>
        <p className="text-sm text-gray-600 mb-3">{granule.names.pinyin}</p>

        <div className="space-y-2 text-sm">
          {granule.baseMaterial && (
            <div className="flex items-center gap-2 text-gray-600">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>原药材: {granule.baseMaterial}</span>
            </div>
          )}

          {granule.concentration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4 text-amber-500" />
              <span>浓缩比: {granule.concentration}</span>
            </div>
          )}

          {granule.manufacturer && (
            <div className="flex items-center gap-2 text-gray-600">
              <Factory className="w-4 h-4 text-blue-500" />
              <span className="truncate">{granule.manufacturer}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
