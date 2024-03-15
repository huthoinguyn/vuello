<template>
  <div class="flex items-center justify-between px-3 py-2">
    <h3 class="text-sm text-gray-700 font-semibold">{{ column?.name }}</h3>
    <Menu as="div" class="relative z-10">
      <MenuButton class="hover:bg-gray-300 w-8 h-8 rounded-md grid place-content-center">
        <EllipsisHorizontalIcon class="h-5 w-5" />
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
          class="origin-top-left mt-2 focus:outline-none absolute left-0 bg-white overflow-hidden rounded-md shadow-lg border w-48"
        >
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="{ 'bg-gray-100': active }"
              class="block px-4 py-2 text-sm text-gray-700"
              >Add new Card</a
            >
          </MenuItem>
          <MenuItem @click="handleRemoveColumn" v-slot="{ active }">
            <span
              :class="{ 'bg-gray-100': active }"
              class="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
              >Remove Column</span
            >
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
  <div class="pb-3 flex flex-col overflow-hidden">
    <div ref="listRef" class="overflow-y-auto flex-1 px-3">
      <draggable
        v-model="cards"
        class="space-y-3"
        drag-class="drag"
        ghost-class="ghost"
        group="cards"
        item-key="id"
        tag="ul"
        @change="onChange"
      >
        <template #item="{ element }">
          <card-item :card="element" />
        </template>
      </draggable>
    </div>
    <div class="px-3 mt-3">
      <card-create-form :column="column" @created="onCardCreated" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useColumnStore} from '@/stores/column'
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {EllipsisHorizontalIcon} from '@heroicons/vue/24/solid'
import {type PropType, ref} from 'vue'
import CardCreateForm from '@/components/card/CardCreateForm.vue'
import CardItem from '@/components/card/CardItem.vue'
import type {ColumnInterface} from '@/models/columns/column.interface'
import type {CardInterface} from '@/models/cards/card.interface'

const props = defineProps({
  column: Object as PropType<ColumnInterface>
})

const cards = ref(props.column?.cards)

const listRef = ref()

const columnStore = useColumnStore()

function onCardCreated(card: CardInterface) {
  cards.value?.push(card)
  listRef.value.scrollTop = listRef.value.scrollHeight
}

const onChange = (event: any) => {
  let item = event.added || event.moved

  if (!item) return

  let index = item.newIndex
  let prevCard = (cards.value as any)[index - 1]
  let nextCard = (cards.value as any)[index + 1]
  let card = (cards.value as any)[index]

  let position = card.position

  if (!prevCard && nextCard) {
    position = nextCard.position / 2
  } else if (prevCard && !nextCard) {
    position = prevCard.position + 65536
  } else if (prevCard && nextCard) {
    position = (prevCard.position + nextCard.position) / 2
  }

  columnStore.cardMove(card.id, Number(props.column?.id), position)
}

const handleRemoveColumn = async () => {
  await columnStore.deleteColumn(Number(props.column?.id))
}
</script>

<style scoped>
.drag > div {
  @apply rotate-3 cursor-pointer;
}

.ghost {
  @apply bg-transparent border-dashed border-2 rounded-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border-gray-100;
}
.ghost > div {
  @apply invisible;
}
</style>
