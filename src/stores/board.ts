import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {BoardInterface} from '@/models/boards/board.interface'
import axios from '@/lib/axios'

export const useBoardStore = defineStore('board', () => {
  const board = ref<BoardInterface | null>(null)
  const boards = ref<BoardInterface[]>([])

  const getAllboards = async () => {
    try {
      const response = await axios.get('/v1/boards')
      if (response.status === 200) {
        boards.value = response.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createBoard = async (board: BoardInterface) => {
    try {
      const response = await axios.post('/v1/boards', board)
      if (response.status === 201) {
        return response.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getBoardById = async (id: number) => {
    try {
      board.value = null
      const response = await axios.get(`/v1/boards/${id}/columns`)
      if (response.status === 200) {
        board.value = response.data.data
        return response.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  const updateBoard = async (id: number, board: BoardInterface) => {
    const response = await axios.put(`/v1/boards/${id}`, board)

    if (response.status === 200) {
      const index = boards.value?.findIndex((b) => b.id === id)
      if (index !== -1) {
        boards.value?.splice(index, 1, response.data.data)
      }
    }
  }

  const removeBoard = async (id: number) => {
    const response = await axios.delete(`/v1/boards/${id}`)

    if (response.status === 200) {
      const index = boards.value?.findIndex((b) => b.id === id)
      if (index !== -1) {
        boards.value?.splice(index, 1)
        board.value = null
        return true
      }
    }
  }

  const fetchColumns = async (id: number) => {
    const response = await axios.get(`/v1/boards/${id}/columns`)
    return response.data.data
  }

  return {
    board,
    boards,
    getAllboards,
    createBoard,
    getBoardById,
    updateBoard,
    removeBoard,
    fetchColumns
  }
})
