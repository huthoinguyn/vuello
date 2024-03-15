import type {CardInterface} from '../cards/card.interface'

export interface ColumnInterface {
  id: number
  name: string
  board_id: number
  position: number
  cards: CardInterface[]
  created_at: string
  updated_at: string
}
