<template>
  <v-data-table
    class="elevation-0"
    :headers="headers"
    :item-key="getItemKey"
    item-value="id"
    :items="rootItems"
    :pagination="pagination"
    :expanded="expanded"
    @update:expanded="$emit('update:expanded', $event)"
  >
    <template #[`item.__index`]="{ index }">
      {{ index + 1 }}
    </template>

    <template #[`item.data-table-expand`]="{ item }">
      <v-btn
        v-if="hasChildren(item as CategoryData)"
        :icon="
          isExpanded(item as CategoryData)
            ? 'mdi-chevron-down'
            : 'mdi-chevron-right'
        "
        size="small"
        variant="text"
        @click.stop="toggleExpand(item as CategoryData)"
      />
    </template>

    <template #[`item.name`]="{ item }">
      {{ (item as any).name }}
    </template>

    <template #[`item.type`]="{ item }">
      <v-chip
        :color="(item as any).type === 'subcategory' ? 'primary' : 'secondary'"
        size="small"
      >
        {{ (item as any).type === 'subcategory' ? 'Subcategory' : 'Category' }}
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

    <template #expanded-row="{ item }">
      <tr>
        <td :colspan="headers.length">
          <v-card
            flat
            class="ma-4"
          >
            <v-list>
              <v-list-item
                v-for="child in getChildren(item as CategoryData)"
                :key="child.id"
              >
                <template #prepend>
                  <span class="text-caption mr-4">{{ child.type }}</span>
                </template>
                <v-list-item-title>{{ child.name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  child.description
                }}</v-list-item-subtitle>
                <template #append>
                  <v-btn
                    color="primary"
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click="$emit('edit', child)"
                  />
                  <v-btn
                    color="error"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    @click="$emit('delete', child.id)"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
  import type { CategoryData } from '@/api/mock'

  const props = defineProps<{
    treeItems: CategoryData[]
    expanded: string[]
    parentIdsWithChildren: Set<string>
    allCategories: CategoryData[]
    pagination?: { page: number; itemsPerPage: number }
  }>()

  const emit = defineEmits<{
    'update:expanded': [value: string[]]
    edit: [category: CategoryData]
    delete: [id: string]
  }>()

  const headers = [
    { title: 'No', value: '__index', width: '50px', sortable: false },
    { title: '', value: 'data-table-expand', width: '40px' },
    { title: 'Name', value: 'name', width: '35%' },
    { title: 'Type', value: 'type', width: '20%' },
    { title: 'Description', value: 'description', width: '25%' },
    { title: 'Actions', value: 'actions', width: '10%', sortable: false },
  ]

  const getItemKey = (item: CategoryData) => item.id

  const rootItems = computed(() => {
    return props.allCategories.filter((c: CategoryData) => !c.parentId)
  })

  function getChildren(item: CategoryData): CategoryData[] {
    return props.allCategories.filter(
      (c: CategoryData) => c.parentId === item.id,
    )
  }

  function hasChildren(item: CategoryData): boolean {
    return props.allCategories.some(
      (c: CategoryData) => c.parentId === item.id && item.type === 'category',
    )
  }

  function isExpanded(item: CategoryData): boolean {
    return props.expanded.includes(item.id)
  }

  function toggleExpand(item: CategoryData) {
    const currentExpanded = [...props.expanded]
    const index = currentExpanded.indexOf(item.id)
    if (index === -1) {
      currentExpanded.push(item.id)
    } else {
      currentExpanded.splice(index, 1)
    }
    emit('update:expanded', currentExpanded)
  }
</script>
