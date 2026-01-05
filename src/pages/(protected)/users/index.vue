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
            @click="openCreateDialog"
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

    <!-- Create/Edit Dialog -->
    <UserDialog
      ref="userDialogRef"
      v-model:open="dialogOpen"
      :editing-id="editingId"
      @save="handleSave"
    />

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
  import type { User } from '@/api/type'
  import { useUsers } from '@/composables'
  import DeleteConfirmDialog from './components/DeleteConfirmDialog.vue'
  import UserDialog from './components/UserDialog.vue'
  import UserTable from './components/UserTable.vue'

  definePage({
    path: '/users',
    meta: {
      requiresAuth: true,
    },
  })

  // Get users from composables
  const { data: usersData, isPending, isError, error } = useUsers()

  // Local ref for mutations
  const mutatedUsers = ref<User[] | null>(null)

  // mockUsers reactively shows composables data or local mutations
  const mockUsers = computed(() => mutatedUsers.value || usersData.value || [])

  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingId = ref<string | null>(null)
  const deleteUserId = ref<string | null>(null)
  const userDialogRef = ref<InstanceType<typeof UserDialog>>()

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function openCreateDialog() {
    editingId.value = null
    userDialogRef.value?.initializeCreate()
    dialogOpen.value = true
  }

  function openEditDialog(user: User) {
    editingId.value = user.id
    userDialogRef.value?.initializeEdit(user)
    dialogOpen.value = true
  }

  function confirmDelete(id: string) {
    deleteUserId.value = id
    deleteDialogOpen.value = true
  }

  async function handleSave(
    userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>,
  ) {
    try {
      const currentData = mockUsers.value
      if (editingId.value) {
        // Update existing user
        const index = currentData.findIndex(u => u.id === editingId.value)
        if (index !== -1) {
          const updatedData = [...currentData]
          const currentUser = updatedData[index]!
          updatedData[index] = {
            id: currentUser.id,
            ...userData,
            created_at: currentUser.created_at,
            updated_at: currentUser.updated_at,
            deleted_at: currentUser.deleted_at,
          }
          mutatedUsers.value = updatedData
        }
        snackbar.message = 'User updated successfully'
      } else {
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          ...userData,
          created_at: null,
          updated_at: null,
          deleted_at: null,
        }
        mutatedUsers.value = [...currentData, newUser]
        snackbar.message = 'User created successfully'
      }
      snackbar.color = 'success'
      snackbar.show = true
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }

  async function handleDelete() {
    if (!deleteUserId.value) return

    try {
      // Delete from mock data
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
