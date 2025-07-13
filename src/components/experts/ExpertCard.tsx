import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Expert } from '@/core/entities'

interface ExpertCardProps {
  expert: Expert
  onClick?: () => void
}

export function ExpertCard({ expert, onClick }: ExpertCardProps) {
  const initials = expert.name.split('').slice(0, 2).join('')

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg" 
      onClick={onClick}
      data-testid="expert-card"
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={expert.avatar} alt={expert.name} />
          <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{expert.name}</h3>
          <p className="text-sm text-muted-foreground">{expert.title}</p>
          <p className="text-sm text-muted-foreground">{expert.institution}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 line-clamp-2 text-sm">{expert.bio}</p>
        <div className="flex flex-wrap gap-2">
          {expert.specialities.slice(0, 3).map((speciality) => (
            <Badge key={speciality} variant="secondary">
              {speciality}
            </Badge>
          ))}
          {expert.specialities.length > 3 && (
            <Badge variant="outline">+{expert.specialities.length - 3}</Badge>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>{expert.recommendedHerbs.length} 推荐药材</span>
          {expert.yearsOfPractice && <span>{expert.yearsOfPractice} 年从业经验</span>}
        </div>
      </CardContent>
    </Card>
  )
}
