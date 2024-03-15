<script setup lang="ts">
import useForm from '@/composables/form'
import {useAuthStore} from '@/stores/auth'
import {useBoardStore} from '@/stores/board'
import {Popover, PopoverButton, PopoverOverlay, PopoverPanel} from '@headlessui/vue'
import {PlusIcon} from '@heroicons/vue/24/solid'
import {storeToRefs} from 'pinia'
import {onMounted} from 'vue'

const boardStore = useBoardStore()
const { boards } = storeToRefs(boardStore)
const authStore = useAuthStore()

const form = useForm({
  name: '',
  owner_id: authStore.user?.id
})

const onSubmit = async (closePopover: Function) => {
  await form.submit(async (fields: any) => {
    const board = await boardStore.createBoard(fields)
    console.log(form, board)

    if (board) {
      form.fields.name = ''
      boards.value.push(board)
      closePopover()
    }
  })
}

onMounted(async () => {
  await boardStore.getAllboards()
})
</script>

<template>
  <div class="h-full bg-gray-50 px-4 py-6">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center">
        <h3 class="font-black text-gray-700">My boards</h3>

        <Popover v-slot="{ open }" class="relative">
          <PopoverButton
            :class="open ? 'bg-blue-50 text-blue-600' : ''"
            class="ml-4 py-2 px-4 font-medium hover:bg-gray-200 inline-flex items-center gap-1 outline-none"
          >
            <plus-icon class="w-5 h-5" />
            <span>Create new board</span>
          </PopoverButton>

          <PopoverOverlay class="fixed inset-0 z-10 bg-black opacity-30" />

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
          >
            <PopoverPanel
              v-slot="{ close }"
              class="absolute left-1/2 z-10 mt-3 w-72 -translate-x-1/2 px-4 sm:px-0"
            >
              <div class="rounded-lg shadow-lg ring-1 ring-black/5 bg-white p-2">
                <form @submit.prevent="onSubmit(close)">
                  <label for="name" class="block text-sm text-gray-600 font-medium mb-1">
                    Your new board:
                    <span class="text-red-500" v-if="form.error?.validation.name">
                      {{ form.error?.validation.name }}
                    </span>
                  </label>
                  <input
                    v-model="form.fields.name"
                    type="text"
                    name="name"
                    id="name"
                    class="block w-full px-4 py-2 text-sm rounded-md border-gray-300 shadow-sm focus:ring-2 focus:border-blue-400 focus:ring-blue-400 outline-none"
                    placeholder="Board name"
                  />
                  <div class="flex justify-end mt-2">
                    <button
                      class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      type="submit"
                    >
                      Create board
                    </button>
                  </div>
                </form>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </div>
      <ul class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <li
          v-for="(board, index) in boards"
          :key="index"
          class="relative bg-blue-600 hover:bg-blue-700 rounded-md min-h-[7rem]"
        >
          <RouterLink
            :to="'board/' + board.id"
            class="text-white text-lg font-bold absolute inset-0 p-3"
          >
            {{ board.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
