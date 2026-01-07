<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    item-value="id"
    :items="products"
  >
    <template #[`item.__index`]="{ index }">
      {{ index + 1 }}
    </template>

    <template #[`item.price`]="{ item }">
      <span class="font-weight-bold">
        Rp
        {{ (item as any).price.toLocaleString('id-ID') }}
      </span>
    </template>

    <template #[`item.stock`]="{ item }">
      <v-chip
        :color="
          (item as any).stock > 50
            ? 'success'
            : (item as any).stock > 10
              ? 'warning'
              : 'error'
        "
        size="small"
        text-color="white"
      >
        {{ (item as any).stock }}
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
        @click="$emit('delete', (item as any).id)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { ProductData } from '@/api/mock'

  defineProps<{
    products: ProductData[]
  }>()

  defineEmits<{
    edit: [product: ProductData]
    delete: [id: string]
  }>()

  const headers = [
    { title: 'No', value: '__index', width: '50px', sortable: false },
    { title: 'Name', value: 'name', width: '18%' },
    { title: 'Description', value: 'description', width: '23%' },
    { title: 'Price', value: 'price', width: '15%' },
    { title: 'Stock', value: 'stock', width: '10%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]
</script>
