import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ExpertCard } from './ExpertCard'
import useAppStore from '@/store/useAppStore'

export function ExpertList() {
  const navigate = useNavigate()
  const {
    experts,
    isLoading,
    error,
    expertSearchQuery,
    expertFilters,
    setExpertSearchQuery,
    setExpertFilters,
    getFilteredExperts,
  } = useAppStore()

  const filteredExperts = getFilteredExperts()

  // Get unique values for filters
  const allSpecialities = [...new Set(experts.flatMap((e) => e.specialities))].sort()
  const allInstitutions = [...new Set(experts.map((e) => e.institution))].sort()

  const handleExpertClick = (expertId: string) => {
    navigate(`/experts/${expertId}`)
  }

  const handleClearFilters = () => {
    setExpertSearchQuery('')
    setExpertFilters({ specialities: [], institutions: [] })
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">加载失败</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索专家姓名、职称、机构或专长..."
            value={expertSearchQuery}
            onChange={(e) => setExpertSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={expertFilters.specialities[0] || 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                setExpertFilters({ specialities: [] })
              } else {
                setExpertFilters({ specialities: [value] })
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="专长领域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有专长</SelectItem>
              {allSpecialities.map((speciality) => (
                <SelectItem key={speciality} value={speciality}>
                  {speciality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={expertFilters.institutions[0] || 'all'}
            onValueChange={(value) => {
              if (value === 'all') {
                setExpertFilters({ institutions: [] })
              } else {
                setExpertFilters({ institutions: [value] })
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="所属机构" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有机构</SelectItem>
              {allInstitutions.map((institution) => (
                <SelectItem key={institution} value={institution}>
                  {institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(expertSearchQuery ||
            expertFilters.specialities.length > 0 ||
            expertFilters.institutions.length > 0) && (
            <Button variant="outline" onClick={handleClearFilters}>
              清除筛选
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">找到 {filteredExperts.length} 位专家</p>
      </div>

      {/* Expert Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[250px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onClick={() => handleExpertClick(expert.id)}
            />
          ))}
        </div>
      )}

      {filteredExperts.length === 0 && !isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">未找到符合条件的专家</p>
            <Button variant="link" onClick={handleClearFilters} className="mt-2">
              清除筛选条件
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
