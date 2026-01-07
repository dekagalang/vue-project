<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    item-value="id"
    :items="users"
    :page="pagination?.page || 1"
    :items-per-page="pagination?.itemsPerPage || 10"
    @update:page="updatePage"
    @update:items-per-page="updateItemsPerPage"
  >
    <template #[`item.__index`]="{ index }">
      {{ getItemNumber(index) }}
    </template>

    <template #[`item.name`]="{ item }">
      <RouterLink
        :to="`/users/${item.id}`"
        class="text-primary font-weight-medium text-decoration-none"
      >
        {{ item.name }}
      </RouterLink>
    </template>

    <template #[`item.role`]="{ item }">
      <v-chip
        :color="getRoleColor(item.role)"
        size="small"
        text-color="white"
      >
        {{ item.role }}
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
        @click="$emit('edit', item)"
      />
      <v-btn
        color="error"
        icon="mdi-delete"
        size="small"
        variant="text"
        @click="$emit('delete', item.id)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { User } from '@/_types'

  const props = defineProps<{
    users: User[]
    pagination?: { page: number; itemsPerPage: number }
  }>()

  const emit = defineEmits<{
    edit: [user: User]
    delete: [id: string]
    'update:pagination': [value: { page: number; itemsPerPage: number }]
  }>()

  const headers = [
    { title: 'No', value: '__index', width: '50px', sortable: false },
    { title: 'Name', value: 'name', width: '18%' },
    { title: 'Email', value: 'email', width: '23%' },
    { title: 'Role', value: 'role', width: '10%' },
    { title: 'Phones', value: 'phones', width: '27%' },
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

  function getItemNumber(index: number): number {
    const page = props.pagination?.page || 1
    const itemsPerPage = props.pagination?.itemsPerPage || 10
    return (page - 1) * itemsPerPage + index + 1
  }

  function updatePage(page: number) {
    const newPagination = {
      page,
      itemsPerPage: props.pagination?.itemsPerPage || 10,
    }
    emit('update:pagination', newPagination)
  }

  function updateItemsPerPage(itemsPerPage: number) {
    const newPagination = { page: props.pagination?.page || 1, itemsPerPage }
    emit('update:pagination', newPagination)
  }
</script>
