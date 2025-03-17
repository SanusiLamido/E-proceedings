<template>
  <q-page class="flex flex-center bg-light">
    <q-card class="q-pa-lg shadow-3 rounded-borders bg-white" style="max-width: 550px; width: 100%">
      <div class="text-center">
        <q-img src="/assets/ejudgelogo.svg" width="80px" class="q-mb-md" />
        <p class="text-h6 text-bold text-primary">e-Court</p>
      </div>
      <q-separator class="q-mb-md" />

      <div class="text-center q-mb-md">
        <h4 class="text-bold text-dark">Justice Joel Agya</h4>
        <h6 class="text-grey-7">Court 1 Appearances Registration</h6>
      </div>
      <q-separator class="q-mb-md" />

      <div v-if="registrationSuccess" class="text-center q-mt-md">
        <q-img
          src="https://cdn-icons-png.flaticon.com/512/148/148767.png"
          width="30%"
          class="q-mb-md"
        />
        <p class="text-h6 text-green text-bold">Appearance Registered Successfully</p>
        <small class="text-red">Kindly refrain from registering multiple times</small>
        <q-btn
          color="primary"
          label="Add Another Appearance"
          class="q-mt-md"
          @click="resetForm"
          rounded
          unelevated
        />
      </div>

      <q-form v-else @submit.prevent="registerAppearance">
        <q-option-group
          v-model="form.position"
          :options="positions"
          type="radio"
          class="row justify-evenly"
          required
        />

        <q-input
          v-model="form.fullName"
          label="Full Name"
          outlined
          dense
          class="q-mb-md"
          :rules="[(v) => !!v || 'Full Name is required']"
        />

        <q-input
          v-model="form.yearOfCall"
          label="Year of Call to Bar"
          outlined
          dense
          readonly
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" @click="yearPicker = true" />
          </template>
        </q-input>

        <q-dialog v-model="yearPicker">
          <q-date
            v-model="form.yearOfCall"
            mask="YYYY"
            minimal
            :options="disableFutureYears"
            @update:model-value="yearPicker = false"
          />
        </q-dialog>

        <q-input
          v-model="form.phoneNumber"
          label="Phone Number"
          type="tel"
          outlined
          dense
          class="q-mb-md"
          :rules="[(v) => /^[0-9]{11}$/.test(v) || 'Enter a valid 11-digit phone number']"
        />

        <q-select
          multiple
          v-model="selectedCases"
          :options="caseOptions"
          label="Cases Appearing For"
          outlined
          dense
          class="q-mb-md"
          @update:model-value="logSelection()"
        />

        <q-list bordered class="q-mb-md bg-white" v-if="selectedCasesArray.length">
          <q-item v-for="(caseItem, index) in selectedCasesArray" :key="index" dense>
            <q-item-section>
              <q-item-label>{{ caseItem.text }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn icon="close" color="negative" flat dense @click="removeCase(index)" />
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-mb-md">
          <label class="text-bold">Signature:</label>
          <q-card class="q-pa-sm bg-white rounded-borders shadow-1">
            <q-card-section class="q-pa-none">
              <canvas ref="signatureCanvas" class="bordered signature-canvas" />
            </q-card-section>
            <q-card-section class="q-pa-none">
              <q-btn
                color="negative"
                label="Clear Signature"
                class="q-mt-md full-width"
                @click="clearSignature"
                rounded
                unelevated
              />
            </q-card-section>
          </q-card>
        </div>

        <q-btn
          type="submit"
          color="primary"
          label="Register Appearance"
          class="q-mt-md full-width"
          rounded
          unelevated
        />
      </q-form>
    </q-card>
  </q-page>
  <q-dialog v-model="dialogVisible" class="row">
    <q-card>
      <q-card-section>
        <div class="row justify-center text-h5">
          <strong>Select Role</strong>
        </div>
        <label>Party Information:</label>
        <q-input outlined v-model="partyInformation" label="Party Information" />
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="center">
        <q-btn color="primary" label="Plaintiff/Applicant" @click="plaintiffSelected" />
        <q-btn color="primary" label="Defendant/Respondent" @click="defendantSelected" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue'
import SignaturePad from 'signature_pad'
import axios from 'axios'

export default {
  setup() {
    const form = ref({ position: '', fullName: '', yearOfCall: '', phoneNumber: '' })
    const partyInformation = ref('')
    const selectedRole = ref('')
    const selectedCaseId = ref(null) // Store selected case ID
    const positions = ref([
      { label: 'Bar', value: 'Bar' },
      { label: 'Senior Advocate of Nigeria (SAN)', value: 'SAN' },
    ])
    const caseOptions = ref([])
    const selectedCases = ref([])
    const selectedCasesArray = ref([])
    const registrationSuccess = ref(false)
    const yearPicker = ref(false)
    const dialogVisible = ref(false)
    const signatureCanvas = ref(null)
    let signaturePad = null

    onMounted(async () => {
      await nextTick()
      if (signatureCanvas.value) {
        signaturePad = new SignaturePad(signatureCanvas.value)
      }
      try {
        const response = await axios.get('https://api.xjudiciary.com/api/causelist/today')
        caseOptions.value = response.data.map((caseItem) => ({
          label: caseItem.name,
          dataDid: caseItem.id, // Assuming the API returns an ID
        }))
      } catch (error) {
        console.error('Error fetching cases:', error)
      }
    })

    const logSelection = () => {
      dialogVisible.value = true
    }

    const plaintiffSelected = () => {
      selectedRole.value = 'Plaintiff/Applicant'
      dialogVisible.value = false
    }

    const defendantSelected = () => {
      selectedRole.value = 'Defendant/Respondent'
      dialogVisible.value = false
    }

    watch(selectedCases, (newCases) => {
      console.log(newCases)

      selectedCases.value.forEach((caseItem) => {
        const newItem = {
          dataDid: caseItem.dataDid,
          text: `${caseItem.label} - for ${partyInformation.value} ${selectedRole.value}`,
        }

        // Ensure no duplicates are added
        if (!selectedCasesArray.value.some((item) => item.dataDid === caseItem.dataDid)) {
          selectedCasesArray.value.push(newItem)
        }
      })
      console.log(selectedCasesArray.value)
    })

    const clearSignature = () => signaturePad?.clear()

    const removeCase = (index) => {
      selectedCases.value.splice(index, 1)
      selectedCasesArray.value.splice(index, 1)
    }

    const registerAppearance = async () => {
      if (
        !form.value.position ||
        !form.value.fullName ||
        !form.value.yearOfCall ||
        !form.value.phoneNumber ||
        !selectedCases.value.length
      ) {
        alert('Please fill all required fields')
        return
      }
      try {
        const signatureData = signaturePad ? signaturePad.toDataURL() : null
        const payload = {
          ...form.value,
          // selectedCases: selectedCasesArray.value, // Use the reactive array
          signature: signatureData,
        }
        await axios.post('https://api.xjudiciary.com/api/add-appearances', payload)
        registrationSuccess.value = true
      } catch (error) {
        console.error('Registration failed:', error)
        alert('Registration failed. Please try again.')
      }
    }

    const disableFutureYears = (date) => parseInt(date) <= new Date().getFullYear()

    return {
      form,
      positions,
      caseOptions,
      selectedCases,
      registrationSuccess,
      signatureCanvas,
      clearSignature,
      removeCase,
      dialogVisible,
      defendantSelected,
      plaintiffSelected,
      registerAppearance,
      yearPicker,
      disableFutureYears,
      logSelection,
      selectedCaseId,
      partyInformation,
      selectedCasesArray,
    }
  },
}
</script>

<style scoped>
.bg-light {
  background: #f9f9f9;
}
.q-card {
  border-radius: 12px;
}
.bordered {
  border: 2px dashed #ccc;
}
.signature-canvas {
  width: 100%;
  height: 150px;
}
</style>
