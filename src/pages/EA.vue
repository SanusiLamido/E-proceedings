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
  <confirmation-dialog
    :isOpen="confirmationDialogVisible"
    :message="confirmationMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import SignaturePad from 'signature_pad'
import axios from 'axios'
import { useQuasar } from 'quasar'
import ConfirmationDialog from 'src/components/ConfirmationDialog.vue'

export default {
  components: {
    ConfirmationDialog,
  },
  setup() {
    const $q = useQuasar()
    const form = ref({ position: '', fullName: '', yearOfCall: '', phoneNumber: '' })
    const partyInformation = ref('')
    const selectedRole = ref('')
    const selectedCaseId = ref(null)
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
    const confirmationDialogVisible = ref(false)
    const confirmationMessage = ref('')
    let signaturePad = null

    onMounted(async () => {
      await nextTick()
      if (signatureCanvas.value) {
        signaturePad = new SignaturePad(signatureCanvas.value)
      }
      try {
        const response = await axios.get('https://api.xjudiciary.com/api/causelist/today')

        caseOptions.value = response.data.map((caseItem) => ({
          label: caseItem.number + ' - ' + caseItem.name,
          dataDid: caseItem.id,
        }))
      } catch (error) {
        console.error('Error fetching cases:', error)
      }
    })

    const logSelection = () => {
      if (selectedCases.value.length > 0) {
        selectedCaseId.value = selectedCases.value[selectedCases.value.length - 1].dataDid
        dialogVisible.value = true
      } else {
        console.error('No case selected')
      }
    }

    const plaintiffSelected = () => {
      selectedRole.value = 'Plaintiff/Applicant'
      const caseItem = caseOptions.value.find((c) => c.dataDid === selectedCaseId.value)

      if (caseItem) {
        const newItem = {
          dataDid: selectedCaseId.value,
          text: `${caseItem.label} - for ${partyInformation.value} Plaintiff/Applicant`,
        }

        if (!selectedCasesArray.value.some((item) => item.dataDid === selectedCaseId.value)) {
          selectedCasesArray.value.push(newItem)
        }
      }

      partyInformation.value = ''
      dialogVisible.value = false
    }

    const defendantSelected = () => {
      selectedRole.value = 'Defendant/Respondent'
      const caseItem = caseOptions.value.find((c) => c.dataDid === selectedCaseId.value)

      if (caseItem) {
        const newItem = {
          dataDid: selectedCaseId.value,
          text: `${caseItem.label} - for ${partyInformation.value} Defendant/Respondent`,
        }

        if (!selectedCasesArray.value.some((item) => item.dataDid === selectedCaseId.value)) {
          selectedCasesArray.value.push(newItem)
        }
      }

      partyInformation.value = ''
      dialogVisible.value = false
    }

    const clearSignature = () => signaturePad?.clear()

    const removeCase = (index) => {
      selectedCases.value.splice(index, 1)
      selectedCasesArray.value.splice(index, 1)
    }

    const registerAppearance = async () => {
      const signatureData = signaturePad ? signaturePad.toDataURL() : null

      if (signaturePad?.isEmpty()) {
        $q.notify({ type: 'negative', message: 'Please provide your signature.' })
        return
      }

      if (
        !form.value.position ||
        !form.value.fullName ||
        !form.value.yearOfCall ||
        !selectedCasesArray.value.length ||
        !signatureData
      ) {
        $q.notify({
          type: 'negative',
          message: 'Please fill in all required fields and select options.',
        })
        return
      }

      confirmationMessage.value = `You have selected the following cases: \n${selectedCasesArray.value.map((item) => item.text).join('\n')}\nDo you want to continue?`
      confirmationDialogVisible.value = true
    }

    const handleConfirm = async () => {
      confirmationDialogVisible.value = false
      $q.loading.show({ message: 'Registering Appearances...' })

      const signatureData = signaturePad ? signaturePad.toDataURL() : null

      const requestData = {
        docket_id: selectedCasesArray.value,
        position: form.value.position,
        full_name: form.value.fullName,
        year_of_call: form.value.yearOfCall,
        more_info: selectedCasesArray.value,
        signature: signatureData,
        phone_number: form.value.phoneNumber,
      }

      try {
        const response = await axios.post(
          'https://api.xjudiciary.com/api/add-appearances',
          requestData,
        )
        console.log('API Response:', response.data)
        $q.loading.hide()
        $q.notify({ type: 'positive', message: 'Appearances Registered Successfully' })
        form.value = { position: '', fullName: '', yearOfCall: '', phoneNumber: '' }
        selectedCasesArray.value = []
        signaturePad.clear()
      } catch (error) {
        console.error('Error making API call:', error)
        $q.loading.hide()
        $q.notify({ type: 'negative', message: 'Error registering appearances. Please try again.' })
      }
    }

    const handleCancel = () => {
      confirmationDialogVisible.value = false
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
      confirmationDialogVisible,
      confirmationMessage,
      handleConfirm,
      handleCancel,
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
