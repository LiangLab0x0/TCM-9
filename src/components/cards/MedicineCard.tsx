import React from 'react'
import { motion } from 'framer-motion'
import { Pill, Heart, Shield, Package } from 'lucide-react'

interface MedicineCardProps {
  medicine: {
    id: string
    names: {
      cn: string
      pinyin: string
      tradeName?: string
    }
    dosageForm?: string
    mainFunction?: string
    manufacturer?: string
    specification?: string
    thumbnail?: string
  }
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="aspect-square relative bg-gradient-to-br from-blue-50 to-purple-50">
        {medicine.thumbnail ? (
          <img
            src={medicine.thumbnail}
            alt={medicine.names.cn}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Pill className="w-20 h-20 text-blue-400" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{medicine.names.cn}</h3>
        {medicine.names.tradeName && (
          <p className="text-sm text-gray-600 mb-1">{medicine.names.tradeName}</p>
        )}
        <p className="text-sm text-gray-500 mb-3">{medicine.names.pinyin}</p>

        <div className="space-y-2 text-sm">
          {medicine.dosageForm && (
            <div className="flex items-center gap-2 text-gray-600">
              <Package className="w-4 h-4 text-purple-500" />
              <span>{medicine.dosageForm}</span>
            </div>
          )}

          {medicine.mainFunction && (
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="line-clamp-1">{medicine.mainFunction}</span>
            </div>
          )}

          {medicine.manufacturer && (
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="truncate">{medicine.manufacturer}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
