import type {UserInterface} from '../users/user.interface'

export interface CardInterface {
  id: number
  title: string
  description: string
  created_by: UserInterface
  assigned_to: UserInterface | null
  followers: UserInterface[]
  due_date: string
  column_id: number
  position: number
  created_at: string
  updated_at: string
}
