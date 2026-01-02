<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div class="login-container">
    <v-container class="fill-height">
      <v-row
        align="center"
        class="fill-height"
        justify="center"
      >
        <v-col
          cols="12"
          lg="4"
          md="6"
          sm="8"
        >
          <v-card class="login-card">
            <v-card-title class="text-center text-h4 mb-6">
              Admin Dashboard
            </v-card-title>

            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  class="mb-4"
                  :error-messages="emailError"
                  label="Email"
                  outlined
                  prepend-icon="mdi-email"
                  type="email"
                  @blur="validateEmail"
                />

                <v-text-field
                  v-model="password"
                  class="mb-6"
                  :error-messages="passwordError"
                  label="Password"
                  outlined
                  prepend-icon="mdi-lock"
                  type="password"
                  @blur="validatePassword"
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
                <p>Email: <code>admin@example.com</code></p>
                <p>Password: <code>password123</code></p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { z } from 'zod'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const email = ref('')
  const password = ref('')
  const emailError = ref('')
  const passwordError = ref('')

  const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })

  function validateEmail() {
    try {
      z.string().email().parse(email.value)
      emailError.value = ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        emailError.value = error.issues?.[0]?.message ?? 'Invalid email'
      }
    }
  }

  function validatePassword() {
    try {
      z.string().min(6).parse(password.value)
      passwordError.value = ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        passwordError.value = error.issues?.[0]?.message ?? 'Invalid password'
      }
    }
  }

  async function handleLogin() {
    // Validate all fields
    try {
      loginSchema.parse({ email: email.value, password: password.value })
      emailError.value = ''
      passwordError.value = ''
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const err of error.issues) {
          if (err.path[0] === 'email') emailError.value = err.message
          if (err.path[0] === 'password') passwordError.value = err.message
        }
      }
      return
    }

    const success = await authStore.login(email.value, password.value)
    if (success) {
      router.push('/')
    }
  }
</script>

<style scoped>
  .login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-card {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  code {
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
</style>
