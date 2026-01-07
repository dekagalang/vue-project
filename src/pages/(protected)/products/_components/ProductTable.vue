<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    item-value="id"
    :items="products"
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
        :to="`/products/${item.id}`"
        class="text-primary font-weight-medium text-decoration-none"
      >
        {{ item.name }}
      </RouterLink>
    </template>

    <template #[`item.price`]="{ item }">
      <span class="font-weight-bold">
        Rp
        {{ item.price.toLocaleString('id-ID') }}
      </span>
    </template>

    <template #[`item.stock`]="{ item }">
      <v-chip
        :color="
          item.stock > 50 ? 'success' : item.stock > 10 ? 'warning' : 'error'
        "
        size="small"
        text-color="white"
      >
        {{ item.stock }}
      </v-chip>
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
  import type { ProductData } from '@/api/mock'

  const props = defineProps<{
    products: ProductData[]
    pagination?: { page: number; itemsPerPage: number }
  }>()

  const emit = defineEmits<{
    edit: [product: ProductData]
    delete: [id: string]
    'update:pagination': [value: { page: number; itemsPerPage: number }]
  }>()

  const headers = [
    { title: 'No', value: '__index', width: '50px', sortable: false },
    { title: 'Name', value: 'name', width: '18%' },
    { title: 'Description', value: 'description', width: '23%' },
    { title: 'Price', value: 'price', width: '15%' },
    { title: 'Stock', value: 'stock', width: '10%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

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
