<template>
  <q-page class="proceedings-page q-pa-lg">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header Section -->
      <div class="header-section q-mb-xl">
        <div class="row items-center justify-between q-mb-sm">
          <h1 class="text-h4 text-weight-bold text-primary">My Proceedings</h1>
          <q-btn icon="refresh" color="primary" flat round :loading="loading" @click="refreshData">
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>
        </div>
        <q-breadcrumbs class="text-grey-7">
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="My Proceedings" />
        </q-breadcrumbs>
      </div>

      <!-- Error Alert -->
      <q-banner v-if="error" class="bg-negative text-white q-mb-md">
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        {{ error }}
        <template v-slot:action>
          <q-btn flat color="white" label="Retry" @click="fetchProceedings" />
        </template>
      </q-banner>

      <div class="row q-col-gutter-lg">
        <!-- Left Column -->
        <div class="col-12 col-md-8">
          <!-- Search and Filter Section -->
          <q-card flat bordered class="q-pa-md q-mb-md">
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="searchQuery"
                  dense
                  outlined
                  placeholder="Search proceedings..."
                  class="full-width"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="searchQuery"
                      name="close"
                      class="cursor-pointer"
                      @click="searchQuery = ''"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-sm-6 row items-center q-gutter-x-md justify-end">
                <span class="text-grey-7">Show</span>
                <q-select
                  v-model="entriesPerPage"
                  :options="[10, 20, 50]"
                  dense
                  outlined
                  style="width: 85px"
                />
                <span class="text-grey-7">entries</span>
              </div>
            </div>
          </q-card>

          <!-- Table Section -->
          <q-card flat bordered class="proceedings-table q-mb-md">
            <q-table
              :rows="paginatedProceedings"
              :columns="columns"
              :rows-per-page="0"
              row-key="suitNo"
              flat
              :loading="loading"
              @update:sortBy="handleSort"
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary">
                  <q-spinner-dots size="40px" color="primary" />
                </q-inner-loading>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" :class="`status-${props.row.status.toLowerCase()}-hover`">
                  <q-td key="caseInfo" :props="props">
                    <div class="row no-wrap items-center">
                      <q-icon
                        :name="
                          props.row.caseStatus === 'trial'
                            ? 'gavel'
                            : props.row.caseStatus === 'closed'
                              ? 'task_alt'
                              : 'pending'
                        "
                        :color="
                          props.row.caseStatus === 'trial'
                            ? 'primary'
                            : props.row.caseStatus === 'closed'
                              ? 'positive'
                              : 'warning'
                        "
                        size="sm"
                        class="q-mr-sm"
                      />
                      <div>
                        <div class="text-weight-medium">{{ props.row.suitNo }}</div>
                        <div class="text-grey-8 text-caption">{{ props.row.parties }}</div>
                      </div>
                    </div>
                  </q-td>
                  <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                  <q-td key="status" :props="props" class="text-center">
                    <div class="status-indicator">
                      <q-chip
                        :color="getStatusColor(props.row.status)"
                        text-color="white"
                        size="sm"
                        class="status-chip"
                      >
                        <q-icon :name="getStatusIcon(props.row.status)" size="xs" class="q-mr-xs" />
                        {{ props.row.status }}
                      </q-chip>
                    </div>
                  </q-td>
                  <q-td key="actions" :props="props" class="text-center">
                    <q-btn-group flat>
                      <q-btn flat round size="sm" color="primary" icon="edit">
                        <q-tooltip>Edit</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        size="sm"
                        color="secondary"
                        icon="visibility"
                        :to="{
                          name: 'proceeding-details',
                          query: { id: props.row.suitNo.split('/')[3] },
                        }"
                      >
                        <q-tooltip>View Details</q-tooltip>
                      </q-btn>
                      <q-btn flat round size="sm" color="negative" icon="delete">
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </q-btn-group>
                  </q-td>
                </q-tr>
              </template>
            </q-table>

            <!-- Pagination Section -->
            <div class="row justify-between items-center q-pa-md">
              <div class="text-grey-7">
                Showing {{ currentRange.start }} to {{ currentRange.end }} of
                {{ currentRange.total }} entries
              </div>
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :max-pages="6"
                boundary-links
                direction-links
                color="primary"
                active-color="primary"
              />
            </div>
          </q-card>
        </div>

        <!-- Right Column -->
        <div class="col-12 col-md-4">
          <!-- Stats Card -->
          <q-card flat bordered class="stats-card q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">Proceedings Overview</div>
              <div class="row q-col-gutter-md">
                <div class="col-4">
                  <div class="stat-box text-center q-pa-sm rounded-borders bg-red-1">
                    <div class="text-h4 text-red q-mb-sm">{{ stats.unedited }}</div>
                    <div class="text-caption text-red-8">Unedited</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-box text-center q-pa-sm rounded-borders bg-yellow-1">
                    <div class="text-h4 text-yellow-9 q-mb-sm">{{ stats.editing }}</div>
                    <div class="text-caption text-yellow-9">Editing</div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-box text-center q-pa-sm rounded-borders bg-green-1">
                    <div class="text-h4 text-green q-mb-sm">{{ stats.edited }}</div>
                    <div class="text-caption text-green-8">Edited</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- View Toggle -->
          <q-card flat bordered class="q-pa-md q-mb-md">
            <div class="row items-center q-gutter-x-md">
              <q-toggle v-model="popupView" color="primary" />
              <span class="text-grey-8">Switch to Pop-up View</span>
            </div>
          </q-card>

          <!-- Calendar Card -->
          <q-card flat bordered class="calendar-card">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Calendar</div>
                <div class="row q-gutter-x-sm">
                  <q-btn
                    flat
                    dense
                    round
                    icon="chevron_left"
                    @click="previousMonth"
                    color="primary"
                  />
                  <q-btn flat dense round icon="chevron_right" @click="nextMonth" color="primary" />
                </div>
              </div>
              <q-date
                v-model="selectedDate"
                minimal
                class="full-width"
                color="primary"
                today-btn
                mask="YYYY-MM-DD"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Quick Action FAB -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab v-model="fab" icon="add" direction="up" color="primary" :disable="loading">
        <q-fab-action
          color="primary"
          icon="post_add"
          label="New Proceeding"
          external-label
          label-position="left"
          @click="onNewProceeding"
        />
        <q-fab-action
          color="secondary"
          icon="upload_file"
          label="Import"
          external-label
          label-position="left"
          @click="onImport"
        />
        <q-fab-action
          color="accent"
          icon="print"
          label="Print Report"
          external-label
          label-position="left"
          @click="onPrint"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Data
const proceedings = ref([])
const stats = ref({
  total: 0,
  unedited: 0,
  editing: 0,
  edited: 0,
})

const loading = ref(true)
const error = ref(null)
const fab = ref(false)
const entriesPerPage = ref(10)
const searchQuery = ref('')
const currentPage = ref(1)
const popupView = ref(false)
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const sortBy = ref('date')
const descending = ref(true)

// API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com'

const api = {
  proceedings: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch proceedings')
      return response.json()
    },
  },
}

const fetchProceedings = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await api.proceedings.list()

    // Transform the mock data to match our proceedings structure
    proceedings.value = data.slice(0, 10).map((post) => ({
      suitNo: `FHC/KN/CR/${post.id}`,
      parties: post.title.toUpperCase(),
      caseStatus: post.id % 3 === 0 ? 'trial' : post.id % 2 === 0 ? 'closed' : 'pending',
      date: new Date(Date.now() - post.id * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: post.id % 3 === 0 ? 'Unedited' : post.id % 2 === 0 ? 'Editing' : 'Edited',
    }))

    // Calculate stats based on the fetched data
    const total = proceedings.value.length
    const unedited = proceedings.value.filter((p) => p.status === 'Unedited').length
    const editing = proceedings.value.filter((p) => p.status === 'Editing').length
    const edited = proceedings.value.filter((p) => p.status === 'Edited').length

    stats.value = { total, unedited, editing, edited }
  } catch (err) {
    error.value = err.message
    $q.notify({
      type: 'negative',
      message: `Error loading proceedings: ${err.message}`,
      position: 'top',
      timeout: 5000,
    })
  } finally {
    loading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchProceedings()
})

// Add refresh method
const refreshData = async () => {
  await fetchProceedings()
  $q.notify({
    type: 'positive',
    message: 'Proceedings refreshed successfully',
    position: 'top',
  })
}

const columns = [
  {
    name: 'caseInfo',
    label: 'Case Information',
    field: (row) => row,
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date of Proceeding',
    field: 'date',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
]

// Computed Properties
const filteredProceedings = computed(() => {
  let filtered = [...proceedings.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (proc) =>
        proc.suitNo.toLowerCase().includes(query) ||
        proc.parties.toLowerCase().includes(query) ||
        proc.date.toLowerCase().includes(query) ||
        proc.status.toLowerCase().includes(query),
    )
  }

  filtered.sort((a, b) => {
    if (sortBy.value === 'caseInfo') {
      const aVal = a.suitNo
      const bVal = b.suitNo
      if (descending.value) {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    }

    const aVal = a[sortBy.value]
    const bVal = b[sortBy.value]

    if (descending.value) {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
  })

  return filtered
})

const paginatedProceedings = computed(() => {
  const start = (currentPage.value - 1) * entriesPerPage.value
  const end = start + entriesPerPage.value
  return filteredProceedings.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredProceedings.value.length / entriesPerPage.value),
)

const currentRange = computed(() => {
  const total = filteredProceedings.value.length
  if (total === 0) return { start: 0, end: 0, total: 0 }

  const start = (currentPage.value - 1) * entriesPerPage.value + 1
  const end = Math.min(start + entriesPerPage.value - 1, total)
  return { start, end, total }
})

// Methods
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'unedited':
      return 'negative'
    case 'editing':
      return 'warning'
    case 'edited':
      return 'positive'
    default:
      return 'grey'
  }
}

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'unedited':
      return 'error_outline'
    case 'editing':
      return 'edit'
    case 'edited':
      return 'check_circle'
    default:
      return 'help'
  }
}

const handleSort = (column) => {
  if (sortBy.value === column) {
    descending.value = !descending.value
  } else {
    sortBy.value = column
    descending.value = true
  }
}

const previousMonth = () => {
  const date = new Date(selectedDate.value)
  date.setMonth(date.getMonth() - 1)
  selectedDate.value = date.toISOString().slice(0, 10)
}

const nextMonth = () => {
  const date = new Date(selectedDate.value)
  date.setMonth(date.getMonth() + 1)
  selectedDate.value = date.toISOString().slice(0, 10)
}

const onNewProceeding = () => {
  $q.notify({
    type: 'info',
    message: 'New proceeding feature coming soon',
    position: 'top',
  })
}

const onImport = () => {
  $q.notify({
    type: 'info',
    message: 'Import feature coming soon',
    position: 'top',
  })
}

const onPrint = () => {
  $q.notify({
    type: 'info',
    message: 'Print feature coming soon',
    position: 'top',
  })
}

// Watchers
watch([searchQuery, entriesPerPage], () => {
  currentPage.value = 1
})
</script>

<style lang="scss">
.proceedings-page {
  .header-section {
    h1 {
      margin: 0;
    }
  }

  .proceedings-table {
    .q-table__card {
      box-shadow: none;
    }

    thead tr th {
      font-weight: 600;
      background-color: #f5f5f5;
    }

    tbody {
      tr {
        transition: all 0.3s ease;

        &.status-unedited-hover:hover {
          background-color: rgba(255, 77, 77, 0.05);
        }

        &.status-editing-hover:hover {
          background-color: rgba(255, 193, 7, 0.05);
        }

        &.status-edited-hover:hover {
          background-color: rgba(76, 175, 80, 0.05);
        }
      }
    }

    .status-indicator {
      .status-chip {
        min-width: 100px;
        justify-content: center;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-size: 0.7rem;
        padding: 2px 4px;

        &.bg-negative {
          background: linear-gradient(45deg, #ff4d4d, #ff6b6b);
        }

        &.bg-warning {
          background: linear-gradient(45deg, #ffc107, #ffca28);
        }

        &.bg-positive {
          background: linear-gradient(45deg, #4caf50, #66bb6a);
        }
      }
    }
  }

  .stats-card {
    .stat-box {
      transition: all 0.3s ease;
      border: 1px solid transparent;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .calendar-card {
    .q-date {
      box-shadow: none;
    }
  }

  .q-fab {
    .q-fab__actions {
      .q-fab__action {
        margin: 8px 0;
      }
    }
  }
}
</style>
