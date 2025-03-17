<template>
  <q-page class="q-pa-md">
    <h1 class="text-center">Print Appearances</h1>

    <!-- Print Button -->
    <q-btn color="wheat" class="q-mb-md" @click="printTable">Print Table</q-btn>

    <!-- Table Container -->
    <div ref="printableArea">
      <q-table dense :rows="tableData" :columns="columns" row-key="id" flat bordered>
        <template v-slot:top>
          <div class="text-center full-width">
            <div class="court-header">
              <img
                class="qrcode float-right"
                :src="qrCodeSrc"
                alt="QR Code"
                width="100"
                height="100"
              />
              <p>
                IN THE STATE HIGH COURT OF NIGERIA <br />
                IN JALINGO
              </p>
              <img
                class="qrcode float-left"
                :src="qrCodeSrc"
                alt="QR Code"
                width="100"
                height="100"
              />
              <p>IN TARABA THE JALINGO JUDICIAL DIVISION HOLDEN AT KANO</p>
              <p>
                <strong>{{ formattedDate }}</strong>
              </p>
              <p>BEFORE HIS LORDSHIP HON. Justice JoeL Agya</p>
              <p>PRESIDING JUDGE JALINGO</p>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      api: 'https://your-api-url.com/api', // Replace with your actual API
      tableData: [],
      columns: [
        { name: 'id', label: 'ID', field: 'row_number', align: 'left' },
        { name: 'suite', label: 'SUITE NO', field: 'number', align: 'left' },
        { name: 'parties', label: 'PARTIES', field: 'name', align: 'left' },
        { name: 'for', label: 'FOR', field: 'status', align: 'left' },
        { name: 'plaintiff', label: 'PLAINTIFF/APPLICANT', field: 'plaintiff', align: 'left' },
        { name: 'year_call_p', label: 'YEAR OF CALL', field: 'year_call_p', align: 'left' },
        { name: 'defendant', label: 'DEFENDANT/RESPONDENT', field: 'defendant', align: 'left' },
        { name: 'year_call_d', label: 'YEAR OF CALL', field: 'year_call_d', align: 'left' },
      ],
      formattedDate: '',
      qrCodeSrc: '',
    }
  },
  mounted() {
    const dateParam = this.getParameterByName('date')
    if (dateParam) {
      this.fetchTableData(dateParam)
    } else {
      console.error('Missing date parameter')
    }
  },
  methods: {
    getParameterByName(name) {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get(name)
    },
    async fetchTableData(dateParam) {
      try {
        const response = await axios.get(`${this.api}/causelist/${dateParam}`)
        this.tableData = response.data
        const encryptedDate = this.encryptDate(dateParam)
        this.qrCodeSrc = `https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=https://amobeda.ejudge.ng/ea?qr=${encryptedDate}`
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
    printTable() {
      window.print()
    },
    encryptDate(date) {
      const plainText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-'
      const cipherText = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm5432109876-'
      return date
        .split('')
        .map((char) => (plainText.includes(char) ? cipherText[plainText.indexOf(char)] : char))
        .join('')
    },
  },
}
</script>

<style scoped>
.court-header {
  text-align: center;
  font-family: 'Comfortaa', cursive;
  text-transform: uppercase;
}

.qrcode {
  position: absolute;
}

.float-left {
  left: 0;
}

.float-right {
  right: 0;
}

@media print {
  body * {
    visibility: hidden;
  }
  #printableArea,
  #printableArea * {
    visibility: visible;
  }
  #printableArea {
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
