<template>
  <v-app>
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer
      v-model="drawer"
      color="primary"
    >
      <v-list-item
        class="mb-4"
        subtitle="Management System"
        title="Admin Dashboard"
      >
        <template #prepend>
          <v-avatar
            color="accent"
            icon="mdi-shield-admin"
          />
        </template>
      </v-list-item>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.to"
          color="accent"
          exact
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
        />
      </v-list>

      <v-spacer />

      <v-divider />

      <v-list-item
        :prepend-icon="
          authStore.user?.role === 'admin'
            ? 'mdi-account-circle'
            : 'mdi-account'
        "
        :subtitle="authStore.user?.email"
        :title="authStore.user?.name || 'User'"
        @click="showUserMenu = true"
      />

      <v-menu
        v-model="showUserMenu"
        :close-on-content-click="false"
        location="end"
      >
        <template #activator="{ props }">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            v-bind="props"
            @click="handleLogout"
          />
        </template>
      </v-menu>
    </v-navigation-drawer>

    <!-- Top App Bar -->
    <v-app-bar
      class="px-4"
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-spacer />

      <div class="d-flex align-center gap-2">
        <span class="text-caption">{{ authStore.user?.name }}</span>
        <v-avatar
          color="accent"
          size="small"
        >
          {{ authStore.user?.name?.charAt(0) }}
        </v-avatar>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <AppFooter />
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import AppFooter from '@/components/AppFooter.vue'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const drawer = ref(true)
  const showUserMenu = ref(false)

  const navigationItems = [
    { title: 'Dashboard', to: '/', icon: 'mdi-view-dashboard' },
    { title: 'Users', to: '/users', icon: 'mdi-account-multiple' },
    { title: 'Products', to: '/products', icon: 'mdi-package-multiple' },
    { title: 'Categories', to: '/categories', icon: 'mdi-folder-multiple' },
  ]

  async function handleLogout() {
    authStore.logout()
    await router.push('/login')
  }
</script>

<style scoped>
  :deep(.v-navigation-drawer) {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  }

  :deep(.v-app-bar) {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
</style>
