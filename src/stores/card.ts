import axios from '@/lib/axios'
import type {CardInterface} from '@/models/cards/card.interface'
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCardStore = defineStore('card', () => {
  const card = ref<CardInterface | null>(null)

  const createCard = async (card: CardInterface) => {
    const response = await axios.post('/v1/cards', card)
    if (response.status === 201) {
      return response.data.data
    }
  }

  const setCard = (newCard: CardInterface | null) => {
    card.value = null
    card.value = newCard
  }

  const updateCard = async (card: CardInterface) => {
    const response = await axios.put(`/v1/cards/${card.id}`, card)
    if (response.status === 200) {
      return response.data.data
    }
  }

  const deleteCard = async (id: number) => {
    const response = await axios.delete(`/v1/cards/${id}`)
    if (response.status === 200) {
      return response.data.data
    }
  }

  const followCard = async (id: number) => {
    const response = await axios.post(`/v1/cards/${id}/follow`)
    if (response.status === 200) {
      return response.data.data
    }
  }

  const unFollowCard = async (id: number) => {
    const response = await axios.delete(`/v1/cards/${id}/unfollow`)
    if (response.status === 200) {
      return response.data.data
    }
  }

  const addFollowing = async (id: number, user_ids: Array<any>) => {
    const response = await axios.post(`/v1/cards/${id}/add-following`, { user_ids })
    if (response.status === 200) {
      return response.data.data
    }
  }

  return {
    card,
    setCard,
    createCard,
    updateCard,
    followCard,
    unFollowCard,
    addFollowing,
    deleteCard
  }
})
