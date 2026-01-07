<template>
  <div class="user-edit-page">
    <v-container fluid>
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center gap-3">
            <v-btn
              color="primary"
              icon="mdi-arrow-left"
              size="small"
              variant="text"
              @click="goBack"
            />
            <h1 class="text-h4">Edit User</h1>
          </div>
        </v-col>
      </v-row>

      <!-- Loading State -->
      <v-row
        v-if="userLoading"
        justify="center"
      >
        <v-col cols="12">
          <v-card class="pa-8">
            <v-skeleton-loader type="card" />
          </v-card>
        </v-col>
      </v-row>

      <!-- Data -->
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-6">
              <v-form @submit.prevent="onSubmit">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="userForm.name.value.value"
                      :error-messages="
                        userForm.name.meta.touched
                          ? userForm.name.errorMessage.value
                          : []
                      "
                      label="Full Name"
                      outlined
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="userForm.email.value.value"
                      :error-messages="
                        userForm.email.meta.touched
                          ? userForm.email.errorMessage.value
                          : []
                      "
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
                      v-model="userForm.role.value.value"
                      :error-messages="
                        userForm.role.meta.touched
                          ? userForm.role.errorMessage.value
                          : []
                      "
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
                            :model-value="userForm.getPhoneLabel(index)"
                            @update:model-value="
                              userForm.setPhoneLabel(index, $event)
                            "
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
                            v-slot="{ meta, errors }"
                            :name="`phones.${index}.number`"
                          >
                            <v-text-field
                              :model-value="userForm.getPhoneNumber(index)"
                              @update:model-value="
                                userForm.setPhoneNumber(index, $event)
                              "
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
                            @click="userForm.removePhone(index)"
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
                    @click="userForm.addPhone"
                  >
                    Add Phone
                  </v-btn>
                </v-card>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn @click="goBack">Cancel</v-btn>
              <v-btn
                color="primary"
                @click="onSubmit"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

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
  import { Field, FieldArray } from 'vee-validate'
  import { useUpdateUser, useUsers } from '@/_hooks/users'
  import { useUserForm } from '../_hooks/useUserForm'

  const router = useRouter()
  const route = useRoute()

  definePage({
    path: '/users/:id/edit',
    meta: {
      requiresAuth: true,
    },
  })

  const userId = computed(() => {
    const id = (route.params as Record<string, string>).id
    return Array.isArray(id) ? id[0] : id
  })

  const { data: usersData, isPending: userLoading } = useUsers()
  const updateUser = useUpdateUser()
  const userForm = useUserForm()

  const snackbar = reactive({
    show: false,
    message: '',
    color: 'success',
  })

  function goBack() {
    router.back()
  }

  const onSubmit = userForm.handleSubmit(async () => {
    try {
      await updateUser.mutateAsync({
        id: userId.value,
        data: {
          name: userForm.name.value.value as string,
          email: userForm.email.value.value as string,
          role: userForm.role.value.value as 'admin' | 'manager' | 'user',
          phones: userForm.phones.value.value,
        },
      })

      snackbar.color = 'success'
      snackbar.message = 'User updated successfully'
      snackbar.show = true

      setTimeout(() => {
        router.push('/users')
      }, 1500)
    } catch (error: any) {
      snackbar.color = 'error'
      snackbar.message = error?.message || 'Failed to update user'
      snackbar.show = true
    }
  })

  onMounted(() => {
    const user = usersData.value?.find(u => u.id === userId.value)
    if (user) {
      userForm.initializeForEdit(user)
    }
  })

  watch(usersData, newUsers => {
    if (newUsers) {
      const user = newUsers.find(u => u.id === userId.value)
      if (user) {
        userForm.initializeForEdit(user)
      }
    }
  })
</script>
