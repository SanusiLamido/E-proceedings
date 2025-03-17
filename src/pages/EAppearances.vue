<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row q-col-gutter-md">
      <!-- Appearances Table -->
      <div class="col-md-8 col-xs-12">
        <q-card class="q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">All Appearances</div>
          </q-card-section>

          <q-table
            flat
            bordered
            dense
            wrap-cells
            :rows="appearances"
            :columns="columns"
            row-key="id"
          >
            <template v-slot:body-cell-signature="props">
              <q-td :props="props">
                <q-img
                  v-if="props.row.signature"
                  :src="props.row.signature"
                  width="50px"
                  height="50px"
                  fit="contain"
                />
                <span v-else>No Signature</span>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- Appearances Calendar -->
      <div class="col-md-4 col-xs-12">
        <q-card class="q-pa-md full-height">
          <q-card-section>
            <div class="text-h6">Appearances Calendar</div>
          </q-card-section>

          <q-date
            v-model="selectedDate"
            :events="eventDates"
            mask="YYYY-MM-DD"
            color="primary"
            minimal
            class="full-width"
            :event-color="getEventColor"
            @update:model-value="openModal"
          />
        </q-card>
      </div>
    </div>

    <!-- Modal -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card class="q-pa-md" style="width: 600px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Appearances on {{ selectedDate }}</div>
        </q-card-section>

        <q-card-section>
          <q-table
            dense
            bordered
            flat
            wrap-cells
            :rows="modalAppearances"
            :columns="columns"
            row-key="id"
          >
            <template v-slot:body-cell-signature="props">
              <q-td :props="props">
                <q-img
                  v-if="props.row.signature"
                  :src="props.row.signature"
                  width="50px"
                  height="50px"
                  fit="contain"
                />
                <span v-else>No Signature</span>
              </q-td>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Print" color="primary" @click="printModal" />
          <q-btn label="Close" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  setup() {
    const $q = useQuasar()
    const selectedDate = ref(new Date().toISOString().split('T')[0])
    const appearances = ref([])
    const modalAppearances = ref([])
    const eventDates = ref([])
    const appearanceCounts = ref({})
    const isModalOpen = ref(false)

    const columns = [
      { name: 'fullName', label: 'Full Name', field: 'fullName', align: 'left' },
      { name: 'phone', label: 'Phone Number', field: 'phone', align: 'left' },
      { name: 'appearingFor', label: 'Appearing for', field: 'appearingFor', align: 'left' },
      { name: 'dateTime', label: 'Date', field: 'dateTime', align: 'center' },
      { name: 'signature', label: 'Signature', field: 'signature', align: 'center' },
    ]

    const fetchAppearances = async () => {
      try {
        $q.loading.show({ message: 'Loading Appearances...' })

        const [appearancesRes, countsRes] = await Promise.all([
          fetch('https://api.xjudiciary.com/api/viewlastapperance'),
          fetch('https://api.xjudiciary.com/api/count-appearances'),
        ])

        if (!appearancesRes.ok || !countsRes.ok) throw new Error('Failed to fetch data')

        const [appearancesData, countsData] = await Promise.all([
          appearancesRes.json(),
          countsRes.json(),
        ])

        appearances.value = appearancesData.map((item) => ({
          id: item.id,
          fullName: item.full_name,
          phone: item.phone_number,
          appearingFor: `${item.number} ${item.docket_name}`,
          dateTime: item.formatted_date,
          signature: item.signature,
        }))

        eventDates.value = countsData.map((item) => item.date_format.replace(/-/g, '/'))
        appearanceCounts.value = countsData.reduce((acc, item) => {
          acc[item.date_format.replace(/-/g, '/')] = item.count
          return acc
        }, {})
      } catch (error) {
        $q.notify({ type: 'negative', message: 'Error fetching data' })
        console.error(error)
      } finally {
        $q.loading.hide()
      }
    }

    const openModal = async (date) => {
      selectedDate.value = date
      isModalOpen.value = true
      try {
        $q.loading.show({ message: 'Loading Appearances...' })
        const res = await fetch(`https://api.xjudiciary.com/api/viewappearance/${date}`)
        if (!res.ok) throw new Error('Failed to fetch data')
        const modalAppearancesData = await res.json()
        modalAppearances.value = modalAppearancesData.map((item) => ({
          id: item.id,
          fullName: item.full_name,
          phone: item.phone_number,
          appearingFor: `${item.number} ${item.docket_name}`,
          dateTime: item.formatted_date,
          signature: item.signature,
        }))
      } catch (error) {
        $q.notify({ type: 'negative', message: 'Error fetching data' })
        console.error(error)
      } finally {
        $q.loading.hide()
      }
    }

    const getEventColor = (date) => {
      const count = appearanceCounts.value[date] || 0
      if (count >= 20) return 'red'
      if (count >= 10) return 'orange'
      if (count >= 5) return 'yellow'
      return 'blue'
    }

    const printModal = () => {
      window.print()
    }

    onMounted(fetchAppearances)

    return {
      selectedDate,
      appearances,
      modalAppearances,
      eventDates,
      appearanceCounts,
      isModalOpen,
      columns,
      getEventColor,
      openModal,
      printModal,
    }
  },
})
</script>

<style>
.q-card {
  border-radius: 10px;
}
</style>
