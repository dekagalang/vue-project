<template>
  <div class="user-create-page">
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
            <h1 class="text-h4">Create New User</h1>
          </div>
        </v-col>
      </v-row>

      <v-row>
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
  import { useCreateUser } from '@/composables'
  import { useUserForm } from '../_hooks/useUserForm'

  const router = useRouter()

  definePage({
    path: '/users/create',
    meta: {
      requiresAuth: true,
    },
  })

  const createUser = useCreateUser()
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
      await createUser.mutateAsync({
        name: userForm.name.value.value as string,
        email: userForm.email.value.value as string,
        role: userForm.role.value.value as 'admin' | 'manager' | 'user',
        phones: userForm.phones.value.value,
      })

      snackbar.color = 'success'
      snackbar.message = 'User created successfully'
      snackbar.show = true

      setTimeout(() => {
        router.push('/users')
      }, 1500)
    } catch (error: any) {
      snackbar.color = 'error'
      snackbar.message = error?.message || 'Failed to create user'
      snackbar.show = true
    }
  })

  onMounted(() => {
    userForm.initializeForCreate()
  })
</script>
