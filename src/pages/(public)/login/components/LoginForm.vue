<template>
  <v-card class="login-card">
    <v-card-title class="text-center text-h4 mb-6">
      Admin Dashboard
    </v-card-title>

    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          v-model="form.email.value.value"
          class="mb-4"
          :error-messages="
            form.email.meta.touched ? form.email.errorMessage.value : []
          "
          label="Email"
          outlined
          prepend-icon="mdi-email"
          type="email"
        />

        <v-text-field
          v-model="form.password.value.value"
          class="mb-6"
          :error-messages="
            form.password.meta.touched ? form.password.errorMessage.value : []
          "
          label="Password"
          outlined
          prepend-icon="mdi-lock"
          type="password"
        />

        <v-alert
          v-if="authStore.error"
          class="mb-4"
          type="error"
        >
          {{ authStore.error }}
        </v-alert>

        <v-btn
          block
          color="primary"
          :loading="authStore.isLoading"
          size="large"
          type="submit"
        >
          Login
        </v-btn>
      </v-form>

      <v-divider class="my-6" />

      <div class="text-caption text-center text-disabled">
        <p class="mb-2"><strong>Demo Credentials:</strong></p>
        <p>Email: <span>admin@example.com</span></p>
        <p>Password: <span>password123</span></p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import { useLoginForm } from '../composables/useLoginForm'

  const authStore = useAuthStore()
  const form = useLoginForm()

  const emit = defineEmits<{
    login: [email: string, password: string]
  }>()

  const onSubmit = form.handleSubmit(async () => {
    emit(
      'login',
      form.email.value.value as string,
      form.password.value.value as string,
    )
  })
</script>

<style scoped>
  .login-card {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
</style>
