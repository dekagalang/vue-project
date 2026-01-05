<script setup lang="ts">
  import { useAuthStore } from '@/stores/auth'
  import LoginForm from './components/LoginForm.vue'

  definePage({
    path: '/login',
    meta: {
      public: true,
      layout: 'blank',
    },
  })

  const router = useRouter()
  const authStore = useAuthStore()

  async function handleLogin(email: string, password: string) {
    const success = await authStore.login(email, password)
    if (success) {
      router.push('/dashboard')
    }
  }
</script>

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
          <LoginForm @login="handleLogin" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
  .login-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  code {
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
</style>
