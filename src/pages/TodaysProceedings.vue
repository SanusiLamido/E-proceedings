<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Proceedings List -->
          <div class="col-12 col-md-8">
            <q-card class="proceedings-card">
              <q-card-section>
                <h2 class="q-mb-md">Today's Proceedings</h2>
                <q-input filled v-model="searchQuery" label="Search proceedings..." class="q-mb-md" dense />

                <q-list bordered separator class="scrollable-list">
                  <!-- Static Proceedings for Testing -->
                  <q-item v-for="proceeding in staticProceedings" :key="proceeding.id" clickable @click="openProceeding" class="proceeding-item">
 <q-item-section>
                      <q-item-label><strong>Case Number:</strong> {{ proceeding.row_number }}</q-item-label>
                      <q-item-label><strong>Name:</strong> {{ proceeding.name }}</q-item-label>
                      <q-item-label caption class="text-grey-7">{{ proceeding.status }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Case Statistics -->
          <div class="col-12 col-md-4">
            <q-card class="stats-card">
              <q-card-section class="text-center">
                <h4 class="text-red">{{ remainingCases }}</h4>
                <p class="text-grey-8">Remaining Proceedings</p>
              </q-card-section>
            </q-card>

            <q-card class="stats-card">
              <q-card-section class="text-center">
                <h4 class="text-green">{{ attendedCases }}</h4>
                <p class="text-grey-8">Taken</p>
              </q-card-section>
            </q-card>

            <q-card class="stats-card">
              <q-card-section class="text-center">
                <h4 class="text-blue">{{ allCases }}</h4>
                <p class="text-grey-8">All</p>
              </q-card-section>
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
const searchQuery = ref("")

// Static proceedings for testing
const staticProceedings = ref([
  { id: 1, row_number: "2024/001", name: "State vs John Doe", status: "Pending" },
  { id: 2, row_number: "2024/002", name: "State vs Jane Smith", status: "Ongoing" },
  { id: 3, row_number: "2024/003", name: "State vs Michael Johnson", status: "Closed" },
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
