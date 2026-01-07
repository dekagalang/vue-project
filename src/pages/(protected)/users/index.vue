<template>
  <div class="users-page">
    <v-container fluid>
      <v-row
        align="center"
        class="mb-6"
      >
        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-h4">User Management</h1>
        </v-col>
        <v-col
          class="text-right"
          cols="12"
          md="6"
        >
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
            :to="{ path: '/users/create' }"
          >
            Add User
          </v-btn>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row
        v-if="isPending"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="table" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Users"
            type="error"
          >
            {{ error?.message || 'Failed to load users' }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data Table -->
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <UserTable
              :users="mockUsers"
              @edit="openEditDialog"
              @delete="confirmDelete"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      @confirm="handleDelete"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
  import type { User } from '@/_types'
  import { useDeleteUser, useUsers } from '@/_hooks/users'
  import DeleteConfirmDialog from './_components/DeleteConfirmDialog.vue'
  import UserTable from './_components/UserTable.vue'

  const router = useRouter()

  definePage({
    path: '/users',
    meta: {
      requiresAuth: true,
    },
  })

  // Get users from composables
  const { data: usersData, isPending, isError, error } = useUsers()
  const deleteUser = useDeleteUser()

  // Local ref for mutations
  const mutatedUsers = ref<User[] | null>(null)

  // mockUsers reactively shows composables data or local mutations
  const mockUsers = computed(() => mutatedUsers.value || usersData.value || [])

  const deleteDialogOpen = ref(false)
  const deleteUserId = ref<string | null>(null)

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function openEditDialog(user: User) {
    router.push(`/users/${user.id}/edit`)
  }

  function confirmDelete(id: string) {
    deleteUserId.value = id
    deleteDialogOpen.value = true
  }

  async function handleDelete() {
    if (!deleteUserId.value) return

    try {
      await deleteUser.mutateAsync(deleteUserId.value)
      mutatedUsers.value = mockUsers.value.filter(
        u => u.id !== deleteUserId.value,
      )
      snackbar.message = 'User deleted successfully'
      snackbar.color = 'success'
      snackbar.show = true
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }
</script>

<style scoped>
  .users-page {
    padding-top: 20px;
  }
</style>
