<script lang="ts" setup>
import {computed, defineProps, type PropType, watch} from 'vue'
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'
import useForm from '@/composables/form'
import {TrashIcon, UserCircleIcon} from '@heroicons/vue/24/solid'
import {useCardStore} from '@/stores/card'
import type {CardInterface} from '@/models/cards/card.interface'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import {useAuthStore} from '@/stores/auth'
import {storeToRefs} from 'pinia'
import CardFollow from '@/components/card/CardFollow.vue'
import {useBoardStore} from '@/stores/board'

const props = defineProps({
  card: Object as PropType<CardInterface>
})

const emit = defineEmits(['updated', 'deleted'])

const userStore = useAuthStore()
const { user } = storeToRefs(userStore)

const cardStore = useCardStore()
const boardStore = useBoardStore()

const isOpen = computed(() => !!props.card)
// const isOpen = computed(() => true)

const form = useForm({
  title: props.card?.title,
  description: props.card?.description,
  column_id: props.card?.column_id,
  board_id: boardStore.board?.id,
  due_date: props.card?.due_date,
  created_by: props.card?.created_by || user.value?.id
})

watch(
  () => props.card,
  (card) => {
    if (card) {
      form.fields.title = card.title
      form.fields.description = card.description
      form.fields.due_date = card.due_date
      form.fields.column_id = card.column_id
      form.fields.board_id = boardStore.board?.id
      form.fields.created_by = card.created_by.id || user.value?.id
    }
  }
)

function closeModal() {
  cardStore.setCard(null)
}

async function onSubmit() {
  if (
    form.fields.title === props.card?.title &&
    form.fields.description === props.card?.description &&
    form.fields.due_date === props.card?.due_date
  ) {
    closeModal()
    return
  }
  await form.submit(async (fields: any) => {
    const newCard = await cardStore.updateCard({
      id: props.card?.id,
      ...fields
    })
    form.fields.title = newCard.title
    form.fields.description = newCard.description
    form.fields.due_date = newCard.due_date
    emit('updated', newCard)
    closeModal()
  })
}

async function joinCard() {
  // await cardStore.joinCard(Number(props.card?.id))
  closeModal()
}

const handleFollow = (card: CardInterface) => {
  emit('updated', card)
}

async function handleDeleteCard() {
  await cardStore.deleteCard(Number(props.card?.id))
  emit('deleted', props.card)
  closeModal()
}
</script>

<template>
  <TransitionRoot :show="isOpen" appear as="template">
    <Dialog as="div" class="relative z-30" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-40" />
      </TransitionChild>

      <div class="overflow-y-auto fixed inset-0">
        <div class="flex justify-center items-start px-4 py-12 min-h-full text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl text-left align-middle bg-white rounded-md shadow-xl transition-all transform"
            >
              <div class="flex flex-col sm:flex-row">
                <form class="flex-1 p-5" @submit.prevent="onSubmit">
                  <div>
                    <label class="sr-only" for="title">Title</label>
                    <textarea
                      id="title"
                      v-model="form.fields.title"
                      class="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 focus:ring-2 outline-none border"
                      name="title"
                      rows="1"
                    ></textarea>
                    <span class="text-red-500" v-if="form.error?.validation.title">
                      {{ form.error?.validation.title }}
                    </span>
                    <span class="select-none text-sm px-1 italic"
                      >Card created by
                      <span class="underline cursor-pointer py-2 text-base">{{
                        card?.created_by?.name
                      }}</span></span
                    >
                  </div>

                  <div class="mt-4">
                    <label
                      class="inline-block mb-1 text-sm font-semibold text-gray-700"
                      for="description"
                      >Description</label
                    >
                    <textarea
                      id="description"
                      v-model="form.fields.description"
                      class="block w-full px-3 py-1.5 text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring-blue-400 focus:ring-2 outline-none border"
                      name="description"
                      rows="4"
                    ></textarea>
                  </div>

                  <div class="mt-2 space-x-2 hidden md:inline-block">
                    <button
                      class="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md shadow-sm hover:bg-rose-500 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      type="submit"
                    >
                      Save card
                    </button>
                    <button
                      class="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-black focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      type="button"
                      @click="closeModal()"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                <div class="p-5 bg-gray-100 sm:w-52 rounded-md">
                  <div class="mb-4">
                    <h3 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Due Date
                    </h3>
                    <vue-date-picker v-model="form.fields.due_date" class="w-full" />
                    <span class="text-red-500" v-if="form.error?.validation.due_date">
                      {{ form.error?.validation.due_date }}
                    </span>
                  </div>
                  <div class="mb-4">
                    <h3 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Join
                    </h3>
                    <button
                      @click="joinCard"
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                    >
                      <UserCircleIcon class="mr-1 -ml-1 w-4 h-4 shrink-0" />
                      <span
                        >{{ user?.id !== card?.assigned_to?.id ? 'Join' : 'Leave' }} this card</span
                      >
                    </button>
                  </div>
                  <div class="mb-4">
                    <h3 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {{ boardStore.board?.owner.id === user?.id ? 'Add Following' : 'Follow' }}
                    </h3>
                    <card-follow @follow="handleFollow" :card="card" />
                  </div>
                  <div>
                    <h3 class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Actions
                    </h3>
                    <button
                      @click="handleDeleteCard"
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                    >
                      <TrashIcon class="mr-1 -ml-1 w-4 h-4 shrink-0" />
                      <span>Delete card</span>
                    </button>
                  </div>
                  <div class="mt-2 space-x-2 md:hidden inline-block">
                    <button
                      @click="onSubmit"
                      class="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md shadow-sm hover:bg-rose-500 focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      type="submit"
                    >
                      Save card
                    </button>
                    <button
                      class="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-black focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:outline-none"
                      type="button"
                      @click="closeModal()"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped></style>
