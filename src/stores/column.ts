import axios from '@/lib/axios'
import type {ColumnInterface} from '@/models/columns/column.interface'
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useColumnStore = defineStore('column', () => {
  const columns = ref<ColumnInterface[]>([])

  const createColumn = async (column: ColumnInterface) => {
    const response = await axios.post('/v1/columns', column)
    if (response.status === 201) {
      const newColumn = response.data.data
      newColumn.cards = [] // Tạo một mảng cards rỗng trong column mới

      columns.value?.push(newColumn)
      return newColumn
    }
  }

  const setColumns = (newColumns: ColumnInterface[]) => {
    columns.value = newColumns
  }

  const cardMove = async (cardId: number, columnId: number, position: number) => {
    await axios.patch(`/v1/cards/${cardId}/move`, {
      column_id: columnId,
      position
    })
  }

  const deleteColumn = async (columnId: number) => {
    const response = await axios.delete(`/v1/columns/${columnId}`)
    if (response.status === 200) {
      columns.value = columns.value?.filter((column) => column.id !== columnId)
    }
  }

  return {
    columns,
    setColumns,
    createColumn,
    deleteColumn,
    cardMove
  }
})
