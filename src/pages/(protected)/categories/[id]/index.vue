<template>
  <div class="category-detail-page">
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
              <h1 class="text-h4">Category Detail</h1>
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
        v-if="categoryLoading"
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
                    <div class="text-subtitle-2 text-grey">Category Name</div>
                    <div class="text-h6">{{ category?.name }}</div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Type</div>
                    <v-chip
                      :color="typeColor(category?.type)"
                      label
                    >
                      {{ category?.type }}
                    </v-chip>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Description</div>
                    <div class="text-body-2">
                      {{ category?.description || '-' }}
                    </div>
                  </div>
                </v-col>

                <v-col
                  v-if="category?.parentId"
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Parent Category</div>
                    <div class="text-body-1">
                      {{
                        categoriesData?.find(c => c.id === category?.parentId)
                          ?.name || '-'
                      }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { useCategories } from '@/_hooks/categories'

  const router = useRouter()
  const route = useRoute()

  definePage({
    path: '/categories/:id',
    meta: {
      requiresAuth: true,
    },
  })

  const categoryId = computed(() => {
    const id = (route.params as Record<string, string>).id
    return Array.isArray(id) ? id[0] : id
  })

  const { data: categoriesData, isPending: categoryLoading } = useCategories()

  const category = computed(() => {
    return categoriesData.value?.find(c => c.id === categoryId.value)
  })

  function goBack() {
    router.back()
  }

  function goToUpdate() {
    router.push(`/categories/${categoryId.value}/update`)
  }

  function typeColor(type?: string) {
    const colors: Record<string, string> = {
      category: 'primary',
      subcategory: 'secondary',
    }
    return colors[type || 'category'] || 'primary'
  }
</script>
