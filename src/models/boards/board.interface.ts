import type {ColumnInterface} from '../columns/column.interface'
import type {UserInterface} from '../users/user.interface'

export interface BoardInterface {
  id: number
  name: string
  owner: UserInterface
  columns: ColumnInterface[]
}
