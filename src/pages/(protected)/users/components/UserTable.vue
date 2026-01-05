<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    item-value="id"
    :items="users"
  >
    <template #[`item.role`]="{ item }">
      <v-chip
        :color="getRoleColor((item as any).role)"
        size="small"
        text-color="white"
      >
        {{ (item as any).role }}
      </v-chip>
    </template>

    <template #[`item.phones`]="{ item }">
      <div class="text-caption">
        <div
          v-for="phone in (item as any).phones"
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
        @click="$emit('edit', item)"
      />
      <v-btn
        color="error"
        icon="mdi-delete"
        size="small"
        variant="text"
        @click="$emit('delete', (item as any).id)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { User } from '@/api/type'

  defineProps<{
    users: User[]
  }>()

  defineEmits<{
    edit: [user: User]
    delete: [id: string]
  }>()

  const headers = [
    { title: 'Name', value: 'name', width: '20%' },
    { title: 'Email', value: 'email', width: '25%' },
    { title: 'Role', value: 'role', width: '10%' },
    { title: 'Phones', value: 'phones', width: '30%' },
    { title: 'Actions', value: 'actions', width: '15%', sortable: false },
  ]

  function getRoleColor(role: string) {
    const colors: Record<string, string> = {
      admin: 'error',
      manager: 'warning',
      user: 'info',
    }
    return colors[role] || 'default'
  }
</script>
