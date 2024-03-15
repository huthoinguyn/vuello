<template>
  <main class="flex flex-1 flex-wrap justify-center overflow-hidden">
    <div class="flex flex-col h-full w-full">
      <div class="shrink-0 flex justify-between items-center p-4">
        <board-name-form :board="board as any" />
        <div class="">
          <Menu as="div" class="relative z-20">
            <MenuButton
              class="bg-glassmorphism hover:opacity-80 px-3 py-2 font-medium text-sm text-white rounded-md inline-flex items-center justify-center space-x-1"
            >
              <EllipsisHorizontalIcon class="h-8 w-8" />
              <span>Setting</span>
            </MenuButton>

            <transition
              enter-active-class="transition transform duration-100 ease-out"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition transform duration-100 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-90"
            >
              <MenuItems
                class="origin-top-right mt-2 focus:outline-none absolute right-0 bg-white overflow-hidden rounded-md shadow-lg border w-48"
              >
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="{ 'bg-gray-100': active }"
                    class="block px-4 py-2 text-sm text-gray-700"
                    >Board Detail</a
                  >
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="{ 'bg-gray-100': active }"
                    class="block px-4 py-2 text-sm text-gray-700"
                    >Add Column</a
                  >
                </MenuItem>
                <MenuItem @click="handleRemoveBoard" v-slot="{ active }">
                  <span
                    :class="{ 'bg-gray-100': active }"
                    class="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                    >Remove Board</span
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <div class="flex-1 overflow-x-auto">
        <div class="inline-flex h-full items-start px-4 pb-4 space-x-4">
          <div
            v-for="column in columns"
            :key="column.id"
            class="w-72 max-h-full bg-gray-200 flex flex-col rounded-md cursor-pointer"
          >
            <column-item :column="column" />
          </div>
          <div class="w-72">
            <column-create-form />
          </div>
        </div>
      </div>
      <card-modal @updated="updateCard" @deleted="deleteCard" :card="card as any" />
    </div>
  </main>
</template>

<script setup lang="ts">
import {EllipsisHorizontalIcon} from '@heroicons/vue/24/solid'
import {storeToRefs} from 'pinia'
import {computed, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import BoardNameForm from '@/components/BoardNameForm.vue'
import ColumnItem from '@/components/column/ColumnItem.vue'
import ColumnCreateForm from '@/components/column/ColumnCreateForm.vue'
import CardModal from '@/components/card/CardModal.vue'
import type {ColumnInterface} from '@/models/columns/column.interface'
import type {CardInterface} from '@/models/cards/card.interface'
import {useBoardStore} from '@/stores/board'
import {useColumnStore} from '@/stores/column'
import {useCardStore} from '@/stores/card'
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'

const { id } = useRoute().params

const boardId = computed(() => Number(id))

const columnStore = useColumnStore()
const { columns } = storeToRefs(columnStore)
const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)
const cardStore = useCardStore()
const { card } = storeToRefs(cardStore)
const router = useRouter()

onMounted(async () => {
  const boardData = await boardStore.getBoardById(Number(boardId.value))
  if (!boardData) {
    return router.push('/')
  }
  columnStore.setColumns(board.value?.columns as ColumnInterface[])
})
onUnmounted(() => {
  columnStore.setColumns([])
})

const handleRemoveBoard = async () => {
  const response = await boardStore.removeBoard(Number(boardId.value))
  if (response) {
    return router.push('/')
  }
}

const updateCard = (card: CardInterface) => {
  const columnIndex = columns.value.findIndex((column) => column.id === card.column_id)
  if (columnIndex !== -1) {
    const currColumn = columns.value[columnIndex]
    const cardIndex = currColumn.cards.findIndex((c) => c.id === card.id)
    if (cardIndex !== -1) {
      currColumn.cards[cardIndex] = card
      columns.value[columnIndex] = currColumn
    }
  }
}

const deleteCard = (card: CardInterface) => {
  const columnIndex = columns.value.findIndex((column) => column.id === card.column_id)
  if (columnIndex !== -1) {
    const currColumn = columns.value[columnIndex]
    const cardIndex = currColumn.cards.findIndex((c) => c.id === card.id)
    if (cardIndex !== -1) {
      currColumn.cards.splice(cardIndex, 1)
      columns.value[columnIndex] = currColumn
    }
  }
}
</script>
<style scoped></style>
