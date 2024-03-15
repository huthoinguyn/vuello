<template>
  <li>
    <div
      class="group relative bg-white p-2 shadow rounded-md border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
    >
      <form v-if="isShowingForm" @keydown.esc="isShowingForm = false" @submit.prevent="onSubmit()">
        <textarea
          ref="inputTitleRef"
          v-model="form.fields.title"
          class="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 outline-none"
          placeholder="Enter card title..."
          rows="3"
          @keydown.enter.prevent="onSubmit()"
        ></textarea>

        <div class="mt-2 space-x-2">
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
            type="submit"
          >
            Save card
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
            type="button"
            @click="isShowingForm = false"
          >
            Cancel
          </button>
        </div>
      </form>

      <template v-if="!isShowingForm">
        <a @click.prevent="cardStore.setCard(card as any)" class="text-sm" href="#">{{
          card?.title
        }}</a>

        <button
          class="hidden absolute top-1 right-1 w-8 h-8 bg-gray-50 group-hover:grid place-content-center rounded-md text-gray-600 hover:text-black hover:bg-gray-200"
          @click="showForm()"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
      </template>
    </div>
  </li>
</template>

<script setup lang="ts">
import useForm from '@/composables/form'
import type {CardInterface} from '@/models/cards/card.interface'
import {useCardStore} from '@/stores/card'
import {PencilIcon} from '@heroicons/vue/24/solid'
import {nextTick, type PropType, ref} from 'vue'

const props = defineProps({
  card: Object as PropType<CardInterface>
})

const cardStore = useCardStore()

const inputTitleRef = ref()
const isShowingForm = ref(false)
const form = useForm({
  title: props.card?.title
})

async function showForm() {
  isShowingForm.value = true
  await nextTick()
  inputTitleRef.value.focus()
}

function onSubmit() {
  isShowingForm.value = false
}
</script>

<style scoped>
.drag > div {
  @apply rotate-3 cursor-pointer;
}

.ghost {
  @apply bg-gray-300 rounded-md;
}
.ghost > div {
  @apply invisible;
}
</style>
