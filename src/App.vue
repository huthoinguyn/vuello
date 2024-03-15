<script lang="ts" setup>
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {useAuthStore} from './stores/auth'
import {storeToRefs} from 'pinia'

const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
}

const { user } = storeToRefs(authStore)
</script>

<template>
  <!-- !!! -->
  <!-- Container Modal -->
  <div class="flex flex-col h-screen bg-blue-600">
    <header v-if="!!user" class="shrink-0 flex justify-between items-center p-4">
      <router-link to="/">
        <h1 class="text-3xl font-bold text-white">Vuello</h1>
      </router-link>
      <nav class="flex space-x-4 text-white">
        <Button type="primary" size="sm" rounded="md">Add Board</Button>
        <Button type="primary" size="sm" rounded="md">Add Container</Button>
        <Menu as="div" class="relative z-30">
          <MenuButton class="flex items-center gap-2">
            <img
              src="https://plus.unsplash.com/premium_photo-1709310749440-bfcae3e84c7e?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="user"
              class="w-10 h-10 rounded-full"
            />
            <span>{{ user.name }}</span>
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
                  >My Profile</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active, disabled }" disabled>
                <a
                  href="#"
                  :class="{ 'bg-gray-100': active, 'opacity-40': disabled }"
                  class="block px-4 py-2 text-sm text-gray-700"
                  >Settings</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  :class="{ 'bg-gray-100': active }"
                  class="block px-4 py-2 text-sm text-gray-700"
                  >Help</a
                >
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <a
                  href="#"
                  @click.prevent="handleLogout"
                  :class="{ 'bg-gray-100': active }"
                  class="block px-4 py-2 text-sm text-gray-700"
                  >Log out</a
                >
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
