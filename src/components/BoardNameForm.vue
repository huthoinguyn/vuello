<template>
  <div class="flex flex-col items-start max-w-full">
    <h1
      :class="[isEditing ? 'absolute -left-[1000rem]' : '']"
      class="hover:bg-white/20 whitespace-pre w-full overflow-hidden text-ellipsis border border-transparent rounded-md cursor-pointer px-3 py-1.5 text-xl text-white font-bold"
      @click="edit()"
    >
      {{ form?.fields?.name ? form?.fields?.name : ' ' }}
    </h1>
    <form v-show="isEditing" @submit.prevent="onSubmit" @focusout="onSubmit" class="w-full">
      <input
        ref="input"
        type="text"
        v-model="form.fields.name"
        placeholder="Board name"
        class="text-2xl max-w-full font-bold placeholder-gray-400 px-3 py-1.5 rounded-md focus:ring-2 focus:ring-blue-900"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import useForm from '@/composables/form'
import type {BoardInterface} from '@/models/boards/board.interface'
import {useBoardStore} from '@/stores/board'
import {storeToRefs} from 'pinia'
import {computed, nextTick, ref, watch} from 'vue'

const boardStore = useBoardStore()

const input = ref()
const isEditing = ref(false)

const { board } = storeToRefs(boardStore)

const boardName = computed(() => board.value?.name)

const form = useForm({
  name: boardName.value
})

let currName = ref<any>('')

watch(
  () => boardName.value,
  async () => {
    form.fields.name = boardName.value
    await nextTick()
  }
)

async function edit() {
  currName.value = boardName.value
  isEditing.value = true
  await nextTick()
  input.value.select()
}

const onSubmit = async () => {
  if (form.fields.name === '') {
    ;(board.value as any).name = currName.value
    isEditing.value = false
    return
  }

  if (boardName.value === form.fields.name) {
    isEditing.value = false
    return
  }

  isEditing.value = false
  await form.submit(async (fields: any) => {
    await boardStore.updateBoard(Number(board.value?.id), {
      id: Number(board.value?.id),
      name: fields.name,
      owner_id: 1
    } as BoardInterface)
  })
}
</script>

<style scoped></style>
