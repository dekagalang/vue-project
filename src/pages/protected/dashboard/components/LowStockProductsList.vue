<template>
  <v-card>
    <v-card-title>Low Stock Products</v-card-title>
    <v-list v-if="!isPending">
      <v-list-item
        v-for="product in products"
        :key="product.id"
        :title="product.name"
      >
        <template #subtitle>
          <v-chip
            color="error"
            size="x-small"
            text-color="white"
          >
            Stock: {{ product.stock }}
          </v-chip>
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
  import type { ProductData } from '@/api/mock'

  defineProps<{
    products: ProductData[]
    isPending: boolean
  }>()
</script>
