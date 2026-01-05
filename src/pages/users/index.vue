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
      <!-- <v-row
        v-if="users.isPending"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="table" />
          </v-card>
        </v-col>
      </v-row> -->

      <!-- Error State -->
      <!-- <v-row v-else-if="users.isError">
        <v-col cols="12">
          <v-alert
            title="Error Loading Users"
            type="error"
          >
            {{ users.error }}
          </v-alert>
        </v-col>
      </v-row> -->

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-data-table
              class="elevation-0"
              :headers="headers"
              item-value="id"
              :items="users.data.value || []"
            >
              <template #[`item.role`]="{ item }">
                <v-chip
                  :color="getRoleColor((item as User).role)"
                  size="small"
                  text-color="white"
                >
                  {{ (item as User).role }}
                </v-chip>
              </template>

              <template #[`item.phones`]="{ item }">
                <div class="text-caption">
                  <div
                    v-for="phone in item.phones"
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
                  @click="openEditDialog(item)"
                />
                <v-btn
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="confirmDelete(item.id)"
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
                  v-model="name.value.value"
                  :error-messages="name.errorMessage.value"
                  label="Full Name"
                  outlined
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="email.value.value"
                  :error-messages="email.errorMessage.value"
                  label="Email"
                  outlined
                  type="email"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="role.value.value"
                  :error-messages="role.errorMessage.value"
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

              <FieldArray
                v-slot="{ fields }"
                name="phones"
              >
                <div>
                  <v-row
                    v-for="(field, index) in fields"
                    :key="field.key"
                    class="mb-3"
                  >
                    <v-col
                      cols="12"
                      md="5"
                    >
                      <v-text-field
                        v-model="(field.value as any).label"
                        dense
                        label="Label"
                        outlined
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <Field
                        v-slot="{ field: numberField, meta, errors }"
                        :name="`phones.${index}.number`"
                      >
                        <v-text-field
                          v-model="numberField.value"
                          dense
                          label="Phone Number"
                          outlined
                          :error="meta.touched && errors.length > 0"
                          :error-messages="errors"
                        />
                      </Field>
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
                </div>
              </FieldArray>

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
              unref(createUser.isPending) || unref(updateUser.isPending)
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
            :loading="unref(deleteUser.isPending)"
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
  import type { User } from '@/api/type'
  import {
    Field,
    FieldArray,
    useField,
    useFieldArray,
    useForm,
  } from 'vee-validate'
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

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  const { handleSubmit, handleReset } = useForm({
    validationSchema: {
      name(value: string) {
        if (value && value.length >= 3) return true
        return 'Name must be at least 3 characters'
      },
      email(value: string) {
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
        return 'Invalid email format'
      },
      role(value: string) {
        if (value && ['admin', 'manager', 'user'].includes(value)) return true
        return 'Please select a role'
      },
      phones(value: Array<{ label: string; number: string }>) {
        if (!value || value.length === 0) return true

        const errors: any[] = []

        for (const [index, phone] of value.entries()) {
          const phoneErrors: any = {}

          if (!phone.label) {
            phoneErrors.label = 'Label is required'
          }

          if (!phone.number) {
            phoneErrors.number = 'Phone number is required'
          } else if (!/^\d{10,}$/.test(phone.number)) {
            phoneErrors.number = 'Phone must be at least 10 digits'
          }

          if (Object.keys(phoneErrors).length > 0) {
            errors[index] = phoneErrors
          }
        }

        return errors.length > 0 ? errors : true
      },
    },
  })

  const name = useField<string>('name')
  const email = useField<string>('email')
  const role = useField<string>('role')
  const phones = useField<Array<{ label: string; number: string }>>('phones')

  function openCreateDialog() {
    editingId.value = null
    name.value.value = ''
    email.value.value = ''
    role.value.value = 'user'
    phones.value.value = [{ label: 'Primary', number: '' }]
    dialogOpen.value = true
  }

  function openEditDialog(item: User) {
    editingId.value = item.id
    name.value.value = item.name
    email.value.value = item.email
    role.value.value = item.role
    phones.value.value = [...item.phones]
    dialogOpen.value = true
  }

  function closeDialog() {
    dialogOpen.value = false
    editingId.value = null
    handleReset()
  }

  function addPhone() {
    const { push } = useFieldArray('phones')
    push({ label: '', number: '' })
  }

  function removePhone(index: number) {
    const { remove } = useFieldArray('phones')
    remove(index)
  }

  const handleSave = handleSubmit(async () => {
    try {
      if (editingId.value) {
        await updateUser.mutateAsync({
          id: editingId.value,
          data: {
            name: name.value.value as string,
            email: email.value.value as string,
            role: role.value.value as 'admin' | 'manager' | 'user',
            phones: phones.value.value,
          },
        })
        snackbar.message = 'User updated successfully'
      } else {
        await createUser.mutateAsync({
          name: name.value.value as string,
          email: email.value.value as string,
          role: role.value.value as 'admin' | 'manager' | 'user',
          phones: phones.value.value,
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
  })

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
