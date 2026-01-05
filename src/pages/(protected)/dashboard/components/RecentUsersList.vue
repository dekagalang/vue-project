<template>
  <v-card>
    <v-card-title>Recent Users</v-card-title>
    <v-list v-if="!isPending">
      <v-list-item
        v-for="user in users"
        :key="user.id"
        :subtitle="user.email"
        :title="user.name"
      >
        <template #prepend>
          <v-avatar color="primary">
            {{ user.name.charAt(0) }}
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
    <div
      v-else
      class="pa-8 text-center"
    >
      <v-progress-circular indeterminate />
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { User } from '@/api/type'

  defineProps<{
    users: User[]
    isPending: boolean
  }>()
</script>
