<template>
  <q-page class="proceeding-details-page q-pa-lg">
    <div class="max-w-[1400px] mx-auto">
      <!-- Header Section -->
      <div class="header-section q-mb-xl">
        <div class="row items-center justify-between q-mb-sm">
          <h1 class="text-h4 text-weight-bold text-primary">Proceeding Details</h1>
          <q-btn icon="arrow_back" color="primary" flat :to="{ name: 'proceedings' }">
            <q-tooltip>Back to Proceedings</q-tooltip>
          </q-btn>
        </div>
        <q-breadcrumbs class="text-grey-7">
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="My Proceedings" :to="{ name: 'proceedings' }" />
          <q-breadcrumbs-el :label="proceeding?.suitNo || 'Loading...'" />
        </q-breadcrumbs>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="row justify-center items-center" style="min-height: 400px">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <!-- Error State -->
      <q-banner v-else-if="error" class="bg-negative text-white q-mb-md">
        <template v-slot:avatar>
          <q-icon name="error" color="white" />
        </template>
        {{ error }}
        <template v-slot:action>
          <q-btn flat color="white" label="Retry" @click="fetchProceedingDetails" />
        </template>
      </q-banner>

      <!-- Content -->
      <template v-else-if="proceeding">
        <div class="row q-col-gutter-lg">
          <!-- Left Column -->
          <div class="col-12 col-md-8">
            <!-- Main Details Card -->
            <q-card flat bordered class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">Case Information</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <div class="text-grey-8 text-caption">Suit/Charge No</div>
                    <div class="text-body1 q-mb-md">{{ proceeding.suitNo }}</div>

                    <div class="text-grey-8 text-caption">Parties</div>
                    <div class="text-body1 q-mb-md">{{ proceeding.parties }}</div>

                    <div class="text-grey-8 text-caption">Case Status</div>
                    <div class="text-body1 q-mb-md">{{ proceeding.caseStatus }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="text-grey-8 text-caption">Date of Proceeding</div>
                    <div class="text-body1 q-mb-md">{{ proceeding.date }}</div>

                    <div class="text-grey-8 text-caption">Status</div>
                    <q-chip
                      :color="getStatusColor(proceeding.status)"
                      text-color="white"
                      class="q-mb-md"
                    >
                      {{ proceeding.status }}
                    </q-chip>

                    <div class="text-grey-8 text-caption">Last Updated</div>
                    <div class="text-body1 q-mb-md">{{ proceeding.lastUpdated || 'N/A' }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Proceeding Content -->
            <q-card flat bordered class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">Proceeding Content</div>
                <q-tabs
                  v-model="activeTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                >
                  <q-tab name="summary" label="Summary" />
                  <q-tab name="details" label="Details" />
                  <q-tab name="attachments" label="Attachments" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="activeTab" animated>
                  <q-tab-panel name="summary">
                    <p class="text-body1">{{ proceeding.summary || 'No summary available.' }}</p>
                  </q-tab-panel>

                  <q-tab-panel name="details">
                    <div v-html="proceeding.details || 'No detailed content available.'"></div>
                  </q-tab-panel>

                  <q-tab-panel name="attachments">
                    <div v-if="proceeding.attachments?.length" class="row q-col-gutter-md">
                      <div
                        v-for="attachment in proceeding.attachments"
                        :key="attachment.id"
                        class="col-12 col-sm-6 col-md-4"
                      >
                        <q-card flat bordered class="attachment-card">
                          <q-card-section class="row items-center">
                            <q-icon
                              :name="getFileIcon(attachment.type)"
                              size="md"
                              class="q-mr-sm"
                            />
                            <div class="text-body2">{{ attachment.name }}</div>
                          </q-card-section>
                          <q-card-actions align="right">
                            <q-btn flat color="primary" icon="download" label="Download" />
                          </q-card-actions>
                        </q-card>
                      </div>
                    </div>
                    <div v-else class="text-grey-7">No attachments available.</div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card-section>
            </q-card>
          </div>

          <!-- Right Column -->
          <div class="col-12 col-md-4">
            <!-- Actions Card -->
            <q-card flat bordered class="q-mb-lg">
              <q-card-section>
                <div class="text-h6 q-mb-md">Actions</div>
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <q-btn
                      color="primary"
                      icon="edit"
                      label="Edit Proceeding"
                      class="full-width"
                      @click="onEdit"
                    />
                  </div>
                  <div class="col-12">
                    <q-btn
                      color="secondary"
                      icon="print"
                      label="Print"
                      class="full-width"
                      @click="onPrint"
                    />
                  </div>
                  <div class="col-12">
                    <q-btn
                      color="negative"
                      icon="delete"
                      label="Delete"
                      class="full-width"
                      @click="onDelete"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- History Card -->
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">History</div>
                <q-timeline color="primary">
                  <q-timeline-entry
                    v-for="(event, index) in proceeding.history || []"
                    :key="index"
                    :title="event.action"
                    :subtitle="event.date"
                    :icon="event.icon || 'event'"
                  >
                    <div>{{ event.description }}</div>
                  </q-timeline-entry>
                </q-timeline>
                <div v-if="!proceeding.history?.length" class="text-grey-7">
                  No history available.
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()

// Data
const proceeding = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('summary')

// API Service (using the same base URL as ProceedingsPage)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com'

const fetchProceedingDetails = async () => {
  try {
    loading.value = true
    error.value = null
    const id = route.query.id

    if (!id) {
      throw new Error('Proceeding ID is required')
    }

    const response = await fetch(`${API_BASE_URL}/posts/${id}`)
    if (!response.ok) throw new Error('Failed to fetch proceeding details')
    const data = await response.json()

    // Transform the mock data to match our proceeding structure
    proceeding.value = {
      suitNo: `FHC/KN/CR/${data.id}`,
      parties: data.title.toUpperCase(),
      caseStatus: data.id % 3 === 0 ? 'trial' : data.id % 2 === 0 ? 'closed' : 'pending',
      date: new Date(Date.now() - data.id * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: data.id % 3 === 0 ? 'Unedited' : data.id % 2 === 0 ? 'Editing' : 'Edited',
      summary: data.body,
      details: `<p>${data.body}</p><p>Additional details would go here...</p>`,
      lastUpdated: new Date(
        Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000,
      ).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      history: [
        {
          action: 'Created',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Proceeding was created',
          icon: 'add',
        },
        {
          action: 'Updated',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          description: 'Content was modified',
          icon: 'edit',
        },
      ],
      attachments: [
        {
          id: 1,
          name: 'Document1.pdf',
          type: 'pdf',
        },
        {
          id: 2,
          name: 'Image1.jpg',
          type: 'image',
        },
      ],
    }
  } catch (err) {
    error.value = err.message
    $q.notify({
      type: 'negative',
      message: `Error loading proceeding details: ${err.message}`,
      position: 'top',
      timeout: 5000,
    })
  } finally {
    loading.value = false
  }
}

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

const getFileIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'picture_as_pdf'
    case 'image':
      return 'image'
    default:
      return 'insert_drive_file'
  }
}

const onEdit = () => {
  $q.notify({
    type: 'info',
    message: 'Edit feature coming soon',
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

const onDelete = () => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to delete this proceeding?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: 'info',
      message: 'Delete feature coming soon',
      position: 'top',
    })
  })
}

// Lifecycle
onMounted(() => {
  fetchProceedingDetails()
})
</script>

<style lang="scss">
.proceeding-details-page {
  .attachment-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
