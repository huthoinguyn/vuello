<template>
  <form
    ref="formRef"
    v-if="isShowingForm"
    @submit.prevent="onSubmit()"
    @keydown.esc="isShowingForm = false"
    class="p-3 bg-gray-200 rounded-md"
  >
    <input
      v-model="columnName"
      ref="inputNameRef"
      class="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 outline-none"
      placeholder="Enter list name..."
      type="text"
    />
    <span class="text-red-500" v-if="form.error?.validation.name">
      {{ form.error?.validation.name }}
    </span>

    <div class="mt-2 space-x-2">
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
      >
        Add column
      </button>
      <button
        type="button"
        @click="closeForm"
        class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  </form>

  <button
    v-if="!isShowingForm"
    @click="showForm()"
    class="flex items-center bg-white/10 w-full hover:bg-white/20 text-white p-2 text-sm font-medium rounded-md"
  >
    <PlusIcon class="w-5 h-5" />
    <span class="ml-1">Add another list</span>
  </button>
</template>

<script setup lang="ts">
import useForm from '@/composables/form'
import type {ColumnInterface} from '@/models/columns/column.interface'
import {useBoardStore} from '@/stores/board'
import {useColumnStore} from '@/stores/column'
import {PlusIcon} from '@heroicons/vue/24/solid'
import {storeToRefs} from 'pinia'
import {nextTick, ref, watch} from 'vue'

const columnStore = useColumnStore()
const { columns } = storeToRefs(columnStore)

const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)

const inputNameRef = ref()
const formRef = ref()
const isShowingForm = ref(false)
const form = useForm({
  name: ''
})

const columnName = ref<String>('')

const closeForm = () => {
  isShowingForm.value = false
  columnName.value = ''
  form.error = null
}

watch(
  () => columnName.value,
  async () => {
    form.fields.name = columnName.value
    await nextTick()
  }
)

async function showForm() {
  isShowingForm.value = true
  await nextTick()
  inputNameRef.value.focus()
}

async function onSubmit() {
  await form.submit(async (fields: any) => {
    await columnStore.createColumn({
      name: fields.name,
      board_id: board.value?.id,
      position: columns.value.length + 1
    } as ColumnInterface)
    inputNameRef.value.focus()
    formRef.value.scrollIntoView()
    isShowingForm.value = false
    columnName.value = ''
  })
}
</script>

<style scoped></style>
