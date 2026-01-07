<template>
  <div class="product-detail-page">
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
              <h1 class="text-h4">Product Detail</h1>
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
        v-if="productLoading"
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
                    <div class="text-subtitle-2 text-grey">Product Name</div>
                    <div class="text-h6">{{ product?.name }}</div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Category</div>
                    <div class="text-body-1">
                      {{
                        categoriesData?.find(c => c.id === product?.categoryId)
                          ?.name || '-'
                      }}
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Price</div>
                    <div class="text-h6 text-primary">
                      Rp{{ formatPrice(product?.price) }}
                    </div>
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Stock</div>
                    <v-chip
                      :color="stockColor(product?.stock)"
                      label
                    >
                      {{ product?.stock }} units
                    </v-chip>
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="mb-4">
                    <div class="text-subtitle-2 text-grey">Description</div>
                    <div class="text-body-2">
                      {{ product?.description || '-' }}
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
  import { useProducts } from '@/_hooks/products'

  const router = useRouter()
  const route = useRoute()

  definePage({
    path: '/products/:id',
    meta: {
      requiresAuth: true,
    },
  })

  const productId = computed(() => {
    const id = (route.params as Record<string, string>).id
    return Array.isArray(id) ? id[0] : id
  })

  const { data: productsData, isPending: productLoading } = useProducts()
  const { data: categoriesData } = useCategories()

  const product = computed(() => {
    return productsData.value?.find(p => p.id === productId.value)
  })

  function goBack() {
    router.back()
  }

  function goToUpdate() {
    router.push(`/products/${productId.value}/update`)
  }

  function formatPrice(price?: number) {
    if (!price) return '0'
    return new Intl.NumberFormat('id-ID').format(price)
  }

  function stockColor(stock?: number) {
    if (!stock || stock === 0) return 'error'
    if (stock < 10) return 'warning'
    return 'success'
  }
</script>
