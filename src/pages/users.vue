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
        v-if="users.isPending"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="table" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Error State -->
      <v-row v-else-if="users.isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Users"
            type="error"
          >
            {{ users.error }}
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data Table -->
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-data-table
              class="elevation-0"
              :headers="headers"
              item-value="id"
              :items="(users.data as any) || []"
            >
              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="getRoleColor((item as UserData).role)"
                  size="small"
                  text-color="white"
                >
                  {{ (item as UserData).role }}
                </v-chip>
              </template>

              <template #[`item.phones`]="{ item }">
                <div class="text-caption">
                  <div
                    v-for="phone in (item as UserData).phones"
                    :key="phone.number"
                  >
                    {{ phone.label }}: {{ phone.number }}
                  </div>
                </div>
              </template>

              <template #[`item.actions`]="{ item }">
                <v-btn
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="openEditDialog(item as UserData)"
                />
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="confirmDelete((item as UserData).id)"
                />
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialogOpen"
      max-width="800px"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ editingId ? 'Edit User' : 'Create New User' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="handleSave">
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="form.name"
                  :error-messages="formErrors.name"
                  label="Full Name"
                  outlined
                  @blur="validateField('name')"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="form.email"
                  :error-messages="formErrors.email"
                  label="Email"
                  outlined
                  type="email"
                  @blur="validateField('email')"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="form.role"
                  :items="['admin', 'manager', 'user']"
                  label="Role"
                  outlined
                />
              </v-col>
            </v-row>

            <!-- Dynamic Phone Numbers -->
            <v-card
              class="mb-4 pa-4"
              variant="outlined"
            >
              <div class="text-subtitle-2 mb-4 font-weight-bold">
                Phone Numbers
              </div>

              <v-row
                v-for="(phone, index) in form.phones"
                :key="index"
                class="mb-3"
              >
                <v-col
                  cols="12"
                  md="5"
                >
                  <v-text-field
                    v-model="phone.label"
                    dense
                    label="Label"
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="phone.number"
                    dense
                    :error-messages="
                      formErrors.phones?.[index]?.['number']
                        ? ['Invalid phone number']
                        : []
                    "
                    label="Phone Number"
                    outlined
                    @blur="validateField('phones')"
                  />
                </v-col>
                <v-col
                  class="d-flex align-center"
                  cols="12"
                  md="1"
                >
                  <v-btn
                    color="error"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    @click="removePhone(index)"
                  />
                </v-col>
              </v-row>

              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                size="small"
                variant="tonal"
                @click="addPhone"
              >
                Add Phone
              </v-btn>
            </v-card>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="
              (createUser.isPending as any) || (updateUser.isPending as any)
            "
            @click="handleSave"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialogOpen"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialogOpen = false">Cancel</v-btn>
          <v-btn
            color="error"
            :loading="deleteUser.isPending as any"
            @click="handleDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  import type { UserData } from '@/api/mock'
  import { reactive, ref } from 'vue'
  import { z } from 'zod'
  import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers,
  } from '@/composables/useApi'

  const headers = [
    { title: 'Name', value: 'name', width: '20%' },
    { title: 'Email', value: 'email', width: '25%' },
    { title: 'Role', value: 'role', width: '10%' },
    { title: 'Phones', value: 'phones', width: '30%' },
    { title: 'Actions', value: 'actions', width: '15%', sortable: false },
  ]

  const users = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const dialogOpen = ref(false)
  const deleteDialogOpen = ref(false)
  const editingId = ref<string | null>(null)
  const deleteUserId = ref<string | null>(null)

  const form = reactive({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'manager' | 'user',
    phones: [{ label: 'Primary', number: '' }],
  })

  const formErrors = reactive<Record<string, any>>({})

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const userSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    role: z.enum(['admin', 'manager', 'user']),
    phones: z.array(
      z.object({
        label: z.string().min(1),
        number: z
          .string()
          .regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
      }),
    ),
  })

  function validateField(fieldName: string) {
    try {
      switch (fieldName) {
        case 'name': {
          z.string().min(3).parse(form.name)
          delete formErrors.name

          break
        }
        case 'email': {
          z.string().email().parse(form.email)
          delete formErrors.email

          break
        }
        case 'phones': {
          for (const [index, phone] of form.phones.entries()) {
            if (!formErrors.phones) formErrors.phones = {}
            try {
              z.string()
                .regex(/^\d{10,}$/)
                .parse(phone.number)
              delete formErrors.phones[index]
            } catch {
              if (!formErrors.phones[index]) formErrors.phones[index] = {}
              formErrors.phones[index].number = true
            }
          }

          break
        }
        // No default
      }
    } catch {
      // Error already set above
    }
  }

  function openCreateDialog() {
    editingId.value = null
    form.name = ''
    form.email = ''
    form.role = 'user'
    form.phones = [{ label: 'Primary', number: '' }]
    formErrors.name = ''
    formErrors.email = ''
    formErrors.phones = {}
    dialogOpen.value = true
  }

  function openEditDialog(item: UserData) {
    editingId.value = item.id
    form.name = item.name
    form.email = item.email
    form.role = item.role
    form.phones = [...item.phones]
    formErrors.name = ''
    formErrors.email = ''
    formErrors.phones = {}
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingId.value = null
  }

  function addPhone() {
    form.phones.push({ label: '', number: '' })
  }

  function removePhone(index: number) {
    form.phones.splice(index, 1)
  }

  async function handleSave() {
    try {
      userSchema.parse(form)
      formErrors.name = ''
      formErrors.email = ''
      formErrors.phones = {}
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const err of error.issues) {
          const path = err.path[0] as string
          if (path === 'name') formErrors.name = err.message
          if (path === 'email') formErrors.email = err.message
        }
      }
      return
    }

    try {
      if (editingId.value) {
        await updateUser.mutateAsync({
          id: editingId.value,
          data: {
            name: form.name,
            email: form.email,
            role: form.role,
            phones: form.phones,
          },
        })
        snackbar.message = 'User updated successfully'
      } else {
        await createUser.mutateAsync({
          name: form.name,
          email: form.email,
          role: form.role,
          phones: form.phones,
        })
        snackbar.message = 'User created successfully'
      }
      snackbar.color = 'success'
      snackbar.show = true
      closeDialog()
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }

  function confirmDelete(id: string) {
    deleteUserId.value = id
    deleteDialogOpen.value = true
  }

  async function handleDelete() {
    if (!deleteUserId.value) return

    try {
      await deleteUser.mutateAsync(deleteUserId.value)
      snackbar.message = 'User deleted successfully'
      snackbar.color = 'success'
      snackbar.show = true
      deleteDialogOpen.value = false
    } catch {
      snackbar.message = 'An error occurred'
      snackbar.color = 'error'
      snackbar.show = true
    }
  }

  function getRoleColor(role: string) {
    const colors: Record<string, string> = {
      admin: 'error',
      manager: 'warning',
      user: 'info',
    }
    return colors[role] || 'default'
  }
</script>

<style scoped>
  .users-page {
    padding-top: 20px;
  }
</style>
