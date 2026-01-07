<template>
  <div class="user-detail-page">
    <v-container fluid>
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center gap-3">
              <v-btn
                color="primary"
                icon="mdi-arrow-left"
                size="small"
                variant="text"
                @click="goBack"
              />
              <h1 class="text-h4">User Detail</h1>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-pencil"
              @click="goToUpdate"
            >
              Update
            </v-btn>
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
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Full Name</div>
                    <div class="text-body-1">{{ user?.name }}</div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Email</div>
                    <div class="text-body-1">{{ user?.email }}</div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Role</div>
                    <v-chip
                      :color="roleColor(user?.role)"
                      label
                    >
                      {{ user?.role }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>

              <!-- Phone Numbers -->
              <v-card
                class="mt-4 pa-4"
                variant="outlined"
              >
                <div class="text-subtitle-2 mb-4 font-weight-bold">
                  Phone Numbers
                </div>

                <v-list
                  v-if="user?.phones && user.phones.length > 0"
                  density="compact"
                >
                  <v-list-item
                    v-for="(phone, index) in user.phones"
                    :key="index"
                    :subtitle="phone.number"
                    :title="phone.label"
                  />
                </v-list>
                <div
                  v-else
                  class="text-caption text-grey"
                >
                  No phone numbers added
                </div>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { useUsers } from '@/_hooks/users'

  const router = useRouter()
  const route = useRoute()

  definePage({
    path: '/users/:id',
    meta: {
      requiresAuth: true,
    },
  })

  const userId = computed(() => {
    const id = (route.params as Record<string, string>).id
    return Array.isArray(id) ? id[0] : id
  })

  const { data: usersData, isPending: userLoading } = useUsers()

  const user = computed(() => {
    return usersData.value?.find(u => u.id === userId.value)
  })

  function goBack() {
    router.back()
  }

  function goToUpdate() {
    router.push(`/users/${userId.value}/update`)
  }

  function roleColor(role?: string) {
    const colors: Record<string, string> = {
      admin: 'error',
      manager: 'warning',
      user: 'info',
    }
    return colors[role || 'user'] || 'info'
  }
</script>
