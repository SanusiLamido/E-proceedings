<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Toolbar -->

        <div class="row q-col-gutter-md">
          <!-- Appearances Table -->
          <div class="col-12 col-md-8">
            <q-card>
              <q-card-section>
                <div class="text-h5">All Appearances</div>
              </q-card-section>
              <q-table flat bordered :rows="appearances" :columns="columns" row-key="id">
                <template v-slot:body-cell-signature="props">
                  <q-td :props="props">
                    <q-icon name="edit" class="cursor-pointer" />
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </div>

          <!-- Calendar -->
          <div class="col-12 col-md-4">
            <q-card>
              <q-card-section>
                <div class="text-h6">Appearances Calendar</div>
              </q-card-section>
              <q-date v-model="selectedDate" minimal today-btn />
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Static proceedings for testing
const staticProceedings = ref([
  { id: 1, row_number: '2024/001', name: 'State vs John Doe', status: 'Pending' },
  { id: 2, row_number: '2024/002', name: 'State vs Jane Smith', status: 'Ongoing' },
  { id: 3, row_number: '2024/003', name: 'State vs Michael Johnson', status: 'Closed' },
])

const remainingCases = ref(2)
const attendedCases = ref(1)
const allCases = ref(staticProceedings.value.length)

const openProceeding = () => {
  router.push('/startproceedings')
}

onMounted(() => {
  // Simulating data fetch
})
</script>

<style scoped>
/* Page background */
.q-page {
  background-color: #f8f9fa;
}

/* Proceedings Card */
.proceedings-card {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  background-color: white;
  min-height: 500px;
  padding: 20px;
}

/* Scrollable List */
.scrollable-list {
  max-height: 450px;
  overflow-y: auto;
  border-radius: 8px;
}

/* Proceeding Item */
.proceeding-item {
  transition: background-color 0.2s ease-in-out;
}

.proceeding-item:hover {
  background-color: #f0f0f0;
}

/* Case Stats */
.stats-card {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  background-color: white;
  margin-bottom: 20px;
  padding: 20px;
  text-align: center;
}

/* Number Styling */
h4 {
  font-size: 2rem;
  margin-bottom: 4px;
}

/* Text styles */
p {
  font-size: 1rem;
  font-weight: 500;
}
</style>
