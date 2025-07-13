import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExpertCard } from '../ExpertCard'
import type { Expert } from '@/core/entities'

const mockExpert: Expert = {
  id: 'expert_1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  name: '张三',
  avatar: 'https://example.com/avatar.jpg',
  title: '主任医师',
  institution: '中医药大学附属医院',
  bio: '长期从事中医临床工作，擅长治疗消化系统疾病',
  specialities: ['消化系统', '心血管系统', '呼吸系统', '内分泌系统'],
  yearsOfPractice: 30,
  publications: [],
  apprentices: [],
  recommendedHerbs: ['herb_1', 'herb_2', 'herb_3'],
  classicalFormulas: [],
}

describe('ExpertCard', () => {
  it('renders expert information correctly', () => {
    render(<ExpertCard expert={mockExpert} />)

    const nameElements = screen.getAllByText('张三')
    expect(nameElements).toHaveLength(2) // Avatar fallback and name
    expect(screen.getByText('主任医师')).toBeInTheDocument()
    expect(screen.getByText('中医药大学附属医院')).toBeInTheDocument()
    expect(screen.getByText(/长期从事中医临床工作/)).toBeInTheDocument()
  })

  it('displays specialities badges', () => {
    render(<ExpertCard expert={mockExpert} />)

    expect(screen.getByText('消化系统')).toBeInTheDocument()
    expect(screen.getByText('心血管系统')).toBeInTheDocument()
    expect(screen.getByText('呼吸系统')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument() // Shows +1 for remaining speciality
  })

  it('shows years of practice when available', () => {
    render(<ExpertCard expert={mockExpert} />)

    expect(screen.getByText('30 年从业经验')).toBeInTheDocument()
  })

  it('shows recommended herbs count', () => {
    render(<ExpertCard expert={mockExpert} />)

    expect(screen.getByText('3 推荐药材')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<ExpertCard expert={mockExpert} onClick={handleClick} />)

    const card = screen.getByText('主任医师').closest('.cursor-pointer')
    await user.click(card!)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('displays initials when avatar is not available', () => {
    const expertWithoutAvatar = { ...mockExpert, avatar: undefined }
    render(<ExpertCard expert={expertWithoutAvatar} />)

    const nameElements = screen.getAllByText('张三')
    expect(nameElements.length).toBeGreaterThan(0)
  })
})