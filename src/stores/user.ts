import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {UserInterface} from '@/models/users/user.interface'
import axios from '@/lib/axios'

export const useUserStore = defineStore('user', () => {
  const users = ref<UserInterface[]>([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/v1/users')
      if (response.status === 200) {
        users.value = response.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    users,
    fetchUsers
  }
})
