<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-md-8">
        <h3>CASES MANAGEMENT</h3>
        <div class="d-flex justify-between q-mb-md">
          <q-btn v-if="!searchActive" icon="search" color="primary" @click="toggleSearch" />
          <q-input
            v-else
            outlined
            placeholder="SEARCH..."
            style="max-width: 200px"
            @blur="toggleSearch"
          />
          <q-btn
            label="ADD NEW CASE"
            color="primary"
            class="q-ml-auto"
            @click="addCaseDialog = true"
          />
        </div>
        <q-table
          flat
          bordered
          class="table-left-align"
          :rows="cases"
          :columns="[
            { name: 'case_info', label: 'CASE INFORMATION', field: 'case_info', align: 'left' },
            { name: 'status', label: 'CASE STATUS', field: 'status', align: 'left' },
            { name: 'suite_type', label: 'TYPE', field: 'suite_type', align: 'left' },
            {
              name: 'formatted_next_activity',
              label: 'DATE OF NEXT SITTING',
              field: 'formatted_next_activity',
              align: 'left',
            },
            { name: 'actions', label: 'ACTIONS', field: 'actions', align: 'left' },
          ]"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-case_info="props">
            <q-td :props="props">
              <div>
                <strong>{{ props.row.number }}</strong
                ><br />
                {{ props.row.name }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn label="ACTIONS" color="primary" @click="openMenu(props.row)">
                <q-menu v-model="props.row.menuOpen">
                  <q-list>
                    <q-item clickable @click="handleEdit(props.row)">
                      <q-item-section>EDIT</q-item-section>
                    </q-item>
                    <q-item clickable @click="handleStrikeOut(props.row)">
                      <q-item-section>STRIKE OUT / RELISTING</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col-md-4">
        <div class="calendar-container">
          <h4>CAUSE LIST CALENDAR</h4>
          <q-date
            v-model="date"
            :events="Object.keys(events)"
            :event-label="(date) => eventsFn(date)"
          />
        </div>
      </div>
    </div>

    <q-dialog v-model="addCaseDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">ADD NEW CASE</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newCaseDate" label="DATE" type="date" />
          <q-input v-model="newCaseCount" label="NUMBER OF CASES" type="number" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CANCEL" v-close-popup />
          <q-btn flat label="ADD" @click="addNewCase" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
.table-left-align .q-table__container {
  text-align: left;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'CaseManagement',
  setup() {
    const cases = ref([])
    const searchActive = ref(false)
    const addCaseDialog = ref(false)
    const newCaseDate = ref('')
    const newCaseCount = ref(0)
    const date = ref(new Date().toISOString().split('T')[0])
    const events = ref({})

    const eventsFn = (date) => {
      return events.value[date] ? `${events.value[date]} Cases` : ''
    }

    const fetchCases = async () => {
      try {
        const response = await axios.get('https://api.xjudiciary.com/api/alldockets')
        cases.value = response.data.map((item) => ({
          number: item.number,
          name: `${item.complainant} VS ${item.defendant}`,
          status: item.status,
          suite_type: item.suite_type,
          formatted_next_activity:
            item.date_of_next_activity === '0000-00-00'
              ? new Date(item.date_of_sitting).toISOString().split('T')[0]
              : new Date(item.date_of_next_activity).toISOString().split('T')[0],
          menuOpen: false,
        }))

        events.value = cases.value.reduce((acc, caseItem) => {
          acc[caseItem.formatted_next_activity] = (acc[caseItem.formatted_next_activity] || 0) + 1
          return acc
        }, {})
      } catch (error) {
        console.error('Error fetching cases:', error)
      }
    }

    onMounted(() => {
      fetchCases()
    })

    return {
      cases,
      addCaseDialog,
      newCaseDate,
      newCaseCount,
      searchActive,
      date,
      events,
      eventsFn,
    }
  },
})
</script>
