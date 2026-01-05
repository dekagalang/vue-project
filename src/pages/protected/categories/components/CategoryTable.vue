<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    :item-key="getItemKey"
    item-value="id"
    :items="treeItems"
    :pagination="pagination"
    @update:expanded="$emit('update:expanded', $event)"
  >
    <template #[`item.data-table-expand`]="{ item }">
      <v-btn
        v-if="props.parentIdsWithChildren.has((item as any).id)"
        :icon="
          props.expanded.some((e: CategoryData) => e.id === (item as any).id)
            ? 'mdi-chevron-down'
            : 'mdi-chevron-right'
        "
        size="small"
        variant="text"
        @click.stop="toggleExpand(item as CategoryData)"
      />
    </template>

    <template #[`item.name`]="{ item }">
      <span :style="{ paddingLeft: (item as any).parentId ? '32px' : '0' }">
        {{ (item as any).name }}
      </span>
    </template>

    <template #[`item.type`]="{ item }">
      <v-chip
        :color="(item as any).parentId ? 'primary' : 'secondary'"
        size="small"
      >
        {{ (item as any).parentId ? 'Subcategory' : 'Category' }}
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
  import type { CategoryData } from '@/api/mock'

  const props = defineProps<{
    treeItems: CategoryData[]
    expanded: CategoryData[]
    parentIdsWithChildren: Set<string>
    pagination?: { page: number; itemsPerPage: number }
  }>()

  const emit = defineEmits<{
    'update:expanded': [value: CategoryData[]]
    edit: [category: CategoryData]
    delete: [id: string]
  }>()

  const headers = [
    { title: '', value: 'data-table-expand', width: '40px' },
    { title: 'Name', value: 'name', width: '40%' },
    { title: 'Type', value: 'type', width: '20%' },
    { title: 'Description', value: 'description', width: '30%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

  const getItemKey = (item: any) => item.id

  function toggleExpand(item: CategoryData) {
    const currentExpanded = [...props.expanded]
    const index = currentExpanded.findIndex(e => e.id === item.id)
    if (index === -1) {
      currentExpanded.push(item)
    } else {
      currentExpanded.splice(index, 1)
    }
    emit('update:expanded', currentExpanded)
  }
</script>
