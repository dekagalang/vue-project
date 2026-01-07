<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="800px"
    @update:model-value="onDialogClose"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ isEditMode ? 'Edit User' : 'Create New User' }}
      </v-card-title>

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
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          @click="onSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import type { User } from '@/_types'
  import { Field, FieldArray } from 'vee-validate'
  import { useUserForm } from '../_hooks/useUserForm'

  const props = defineProps<{
    open: boolean
    editingId: string | null
  }>()

  const emit = defineEmits<{
    'update:open': [value: boolean]
    save: [data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>]
  }>()

  const userForm = useUserForm()

  const dialogOpen = computed({
    get: () => props.open,
    set: value => emit('update:open', value),
  })

  const isEditMode = computed(() => props.editingId !== null)

  function closeDialog() {
    dialogOpen.value = false
    userForm.reset()
  }

  function onDialogClose(value: boolean) {
    if (!value) {
      userForm.reset()
    }
  }

  const onSubmit = userForm.handleSubmit(async () => {
    try {
      emit('save', {
        name: userForm.name.value.value as string,
        email: userForm.email.value.value as string,
        role: userForm.role.value.value as 'admin' | 'manager' | 'user',
        phones: userForm.phones.value.value,
      })
      closeDialog()
    } catch {
      console.error('Form submission error')
    }
  })

  function initializeCreate() {
    userForm.initializeForCreate()
  }

  function initializeEdit(user: User) {
    userForm.initializeForEdit(user)
  }

  defineExpose({
    initializeCreate,
    initializeEdit,
  })
</script>
