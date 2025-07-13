import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Users, Leaf, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import useAppStore from '@/store/useAppStore'

export function ExpertDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getHerbsByIds, selectExpert, getSelectedExpert, isLoading } = useAppStore()

  useEffect(() => {
    if (id) {
      selectExpert(id)
    }
    return () => {
      selectExpert(null)
    }
  }, [id, selectExpert])

  const expert = getSelectedExpert()
  const recommendedHerbs = expert ? getHerbsByIds(expert.recommendedHerbs) : []

  const handleHerbClick = (herbId: string) => {
    // Convert herb ID to material ID format
    const materialId = herbId.replace('herb_', 'mat_')
    navigate(`/herb/${materialId}`)
  }

  const handleViewGraph = () => {
    navigate(`/graph?expertId=${id}`)
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (!expert) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">专家信息未找到</p>
          <Button variant="link" onClick={() => navigate('/')} className="mt-4">
            返回专家列表
          </Button>
        </div>
      </div>
    )
  }

  const initials = expert.name.split('').slice(0, 2).join('')

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <Button onClick={handleViewGraph} data-testid="view-graph-button">
          <Network className="mr-2 h-4 w-4" />
          查看关系图谱
        </Button>
      </div>

      {/* Expert Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <Avatar className="h-32 w-32">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback className="text-3xl font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{expert.name}</h1>
                <p className="text-lg text-muted-foreground">{expert.title}</p>
                <p className="text-muted-foreground">{expert.institution}</p>
              </div>
              <p className="text-base leading-relaxed">{expert.bio}</p>
              <div className="flex flex-wrap gap-2">
                {expert.specialities.map((speciality) => (
                  <Badge key={speciality} variant="secondary">
                    {speciality}
                  </Badge>
                ))}
              </div>
              {expert.yearsOfPractice && (
                <p className="text-sm text-muted-foreground">{expert.yearsOfPractice} 年从业经验</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="herbs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="herbs">
            <Leaf className="mr-2 h-4 w-4" />
            相关药材
          </TabsTrigger>
          <TabsTrigger value="publications">
            <BookOpen className="mr-2 h-4 w-4" />
            学术成果
          </TabsTrigger>
          <TabsTrigger value="apprentices">
            <Users className="mr-2 h-4 w-4" />
            传承弟子
          </TabsTrigger>
        </TabsList>

        <TabsContent value="herbs">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedHerbs.map((herb) => (
              <Card
                key={herb.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleHerbClick(herb.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{herb.name.cn}</CardTitle>
                    <Badge variant="outline">{herb.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{herb.name.pinyin}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">性味:</span>
                      <span>{herb.qi}</span>
                      <span>·</span>
                      <span>{herb.flavor.join('、')}</span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {herb.clinicalUses.join('；')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {recommendedHerbs.length === 0 && (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">暂无推荐药材</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="publications">
          <div className="space-y-4">
            {expert.publications?.map((pub) => (
              <Card key={pub.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{pub.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{pub.year} 年</span>
                    {pub.journal && <span>{pub.journal}</span>}
                  </div>
                </CardHeader>
                {(pub.doi || pub.url) && (
                  <CardContent>
                    <div className="flex gap-4">
                      {pub.doi && (
                        <Button variant="link" size="sm" asChild>
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            DOI
                          </a>
                        </Button>
                      )}
                      {pub.url && (
                        <Button variant="link" size="sm" asChild>
                          <a href={pub.url} target="_blank" rel="noopener noreferrer">
                            查看全文
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
            {(!expert.publications || expert.publications.length === 0) && (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">暂无学术成果</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="apprentices">
          <div className="grid gap-4 md:grid-cols-2">
            {expert.apprentices?.map((apprentice) => (
              <Card key={apprentice.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{apprentice.name}</CardTitle>
                  {apprentice.title && (
                    <p className="text-sm text-muted-foreground">{apprentice.title}</p>
                  )}
                  {apprentice.institution && (
                    <p className="text-sm text-muted-foreground">{apprentice.institution}</p>
                  )}
                </CardHeader>
              </Card>
            ))}
            {(!expert.apprentices || expert.apprentices.length === 0) && (
              <div className="flex h-[200px] items-center justify-center md:col-span-2">
                <p className="text-muted-foreground">暂无传承弟子信息</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
