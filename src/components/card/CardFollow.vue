<template>
  <ul class="mb-4" v-if="selectedUser?.length > 0">
    <li
      v-for="person in selectedUser"
      :key="person.id"
      class="px-2 py-0.5 text-sm text-gray-600 flex items-center gap-1 cursor-pointer"
    >
      <div class="w-5 h-5 overflow-hidden rounded-full">
        <img
          src="https://images.unsplash.com/photo-1710319412580-ee88720571cb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="user avatar"
          class="object-cover w-full h-full"
        />
      </div>
      <span class="hover:underline">{{ person.name }}</span>
    </li>
  </ul>
  <!-- <button
    v-if="selectedUser?.length > 0"
    @click="handleAddFollowing"
    class="inline-flex items-center px-4 py-1 text-sm font-medium text-white rounded-md shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-none bg-blue-600 mb-2"
  >
    <span>Add</span>
  </button> -->
  <Combobox v-if="boardStore.board?.owner.id === user?.id" v-model="selectedUser" multiple>
    <div class="relative">
      <ComboboxInput
        @change="query = $event.target.value"
        class="inline-flex w-full items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        placeholder="Search for a person"
      />
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
      </ComboboxButton>
    </div>
    <TransitionRoot
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        @change="handleAddFollowing"
        class="absolute w-72 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
      >
        <div
          v-if="selectedUser.length === 0 && query !== ''"
          class="relative cursor-default select-none px-4 py-2 text-gray-700"
        >
          No user found
        </div>
        <ComboboxOption
          v-for="person in filteredUser"
          as="template"
          :key="person.id"
          :value="person"
          v-slot="{ selected, active }"
        >
          <li
            class="relative cursor-default select-none py-2 pl-10 pr-4"
            :class="{
              'bg-teal-600 text-white': active,
              'text-gray-900': !active
            }"
          >
            <span
              class="block truncate"
              :class="{ 'font-medium': selected, 'font-normal': !selected }"
            >
              {{ person.name }}
            </span>
            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-3"
              :class="{ 'text-white': active, 'text-teal-600': !active }"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </TransitionRoot>
  </Combobox>
  <button
    v-else
    @click="handleFollow"
    class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-none"
  >
    <!-- <TrashIcon class="mr-1 -ml-1 w-4 h-4 shrink-0" /> -->
    <span>{{ alreadyFollowing ? 'Unfollow' : 'Follow' }} this card</span>
  </button>
</template>

<script lang="ts" setup>
import {computed, onMounted, type PropType, ref} from 'vue'
import {Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, TransitionRoot} from '@headlessui/vue'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/vue/20/solid'
import {useUserStore} from '@/stores/user'
import {storeToRefs} from 'pinia'
import type {UserInterface} from '@/models/users/user.interface'
import {useAuthStore} from '@/stores/auth'
import {useBoardStore} from '@/stores/board'
import {useCardStore} from '@/stores/card'
import type {CardInterface} from '@/models/cards/card.interface'

const userStore = useUserStore()
const { users } = storeToRefs(userStore)
const boardStore = useBoardStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const cardStore = useCardStore()

onMounted(async () => {
  await userStore.fetchUsers()
})

const props = defineProps({
  card: Object as PropType<CardInterface>
})

const emit = defineEmits(['follow'])
const alreadyFollowing = ref(false)

onMounted(() => {
  if (props.card?.followers) {
    const isFollowing = props.card?.followers.find((follower) => follower.id === user.value?.id)
    alreadyFollowing.value = isFollowing ? true : false
  }
})

const selectedUser = ref<UserInterface[]>([...(props.card?.followers as any)] as UserInterface[])

const query = ref('')

let filteredUser = computed(() =>
  query.value === ''
    ? users.value
    : users.value.filter((person) =>
        person.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

const handleFollow = async () => {
  let card
  if (alreadyFollowing.value) {
    card = await cardStore.unFollowCard(Number(props.card?.id))
    alreadyFollowing.value = false
  } else {
    card = await cardStore.followCard(Number(props.card?.id))
    alreadyFollowing.value = true
  }

  emit('follow', card)
  selectedUser.value = card?.followers as UserInterface[]
}

const handleAddFollowing = async () => {
  console.log(selectedUser.value)

  const card = await cardStore.addFollowing(
    Number(props.card?.id),
    selectedUser.value.map((user) => user.id)
  )
  emit('follow', card)
  selectedUser.value = card?.followers as UserInterface[]
}
</script>

<style scoped></style>
