<script lang="ts" setup>
import useForm from '@/composables/form'
import type {ColumnInterface} from '@/models/columns/column.interface'
import {useAuthStore} from '@/stores/auth'
import {useBoardStore} from '@/stores/board'
import {useCardStore} from '@/stores/card'
import {PlusIcon} from '@heroicons/vue/24/outline'
import {storeToRefs} from 'pinia'
import {nextTick, type PropType, ref} from 'vue'

const cardStore = useCardStore()

const props = defineProps({
  column: Object as PropType<ColumnInterface>
})
const emit = defineEmits(['created'])

const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const inputNameRef = ref()
const isShowingForm = ref(false)
const form = useForm({
  title: '',
  column_id: props.column?.id,
  board_id: board.value?.id
})

const closeForm = () => {
  isShowingForm.value = false
  form.fields.title = ''
  form.error = null
}

async function showForm() {
  isShowingForm.value = true
  await nextTick()
  inputNameRef.value.focus()
}

async function onSubmit() {
  await form.submit(async (fields: any) => {
    const card = await cardStore.createCard({
      title: fields.title,
      column_id: fields.column_id,
      board_id: fields.board_id,
      created_by: user.value?.id
    } as any)

    isShowingForm.value = false
    emit('created', card)
    form.fields.title = ''
  })
}
</script>
<template>
  <form @keydown.esc="isShowingForm = false" v-if="isShowingForm" @submit.prevent="onSubmit()">
    <textarea
      ref="inputNameRef"
      v-model="form.fields.title"
      rows="3"
      @keydown.enter.prevent="onSubmit()"
      class="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 outline-none"
      placeholder="Enter card title..."
    ></textarea>
    <span class="text-red-500" v-if="form.error?.validation.title">
      {{ form.error?.validation.title }}
    </span>

    <div class="mt-2 space-x-2">
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
        type="submit"
      >
        Add card
      </button>
      <button
        class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
        type="button"
        @click="closeForm"
      >
        Cancel
      </button>
    </div>
  </form>
  <button
    @click="showForm()"
    v-if="!isShowingForm"
    class="flex items-center p-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-300 w-full rounded-md"
  >
    <PlusIcon class="h-5 w-5"></PlusIcon>
    <span class="ml-1">Add new card</span>
  </button>
</template>
