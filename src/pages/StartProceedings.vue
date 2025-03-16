<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
          <!-- Left Side: Live Transcription -->
          <div class="col-12 col-md-8">
            <q-card class="proceedings-card">
              <q-card-section>
                <h2>Case Name</h2>
                <p class="text-grey-7"><strong>File Number:</strong> 2024/001</p>
                <p class="text-grey-7"><strong>Status:</strong> Ongoing</p>
                <q-separator spaced />

                <!-- Live Transcription -->
                <div id="liveTranscriptionResult" class="q-mt-md transcription-box">
                  Live transcription will appear here.
                </div>

                <!-- Final Transcription -->
                <q-card class="q-mt-md transcription-card">
                  <q-card-section>
                    <h6>Final Transcription</h6>
                    <div id="finalTranscriptionResult" class="q-py-sm">
                      Final transcription will be displayed here.
                    </div>
                  </q-card-section>
                </q-card>
              </q-card-section>
            </q-card>

            <!-- Recording Control Buttons -->
            <div class="q-mt-md row justify-center">
              <q-btn round color="primary" icon="play_arrow" size="xl" @click="startRecordingAndTranscription" v-if="!isRecording" />
              <q-btn round color="warning" icon="pause" size="xl" @click="pauseRecordingAndTranscription" v-if="isRecording" />
              <q-btn round color="info" icon="play_arrow" size="xl" @click="resumeRecordingAndTranscription" v-if="isPaused" />
              <q-btn round color="red" icon="stop" size="xl" class="q-ml-md" @click="endProceeding" />
            </div>
          </div>

          <!-- Right Side: Case & Time Info -->
          <div class="col-12 col-md-4">
            <q-card class="q-mb-md text-center stats-card">
              <q-card-section>
                <h3 class="text-primary">{{ formattedTime }}</h3>
                <p class="text-grey-8">Current Time</p>
              </q-card-section>
            </q-card>

            <!-- Microphone Selection -->
            <q-card class="q-mb-md">
              <q-card-section>
                <q-select v-model="selectedMicrophone" :options="microphoneOptions" label="Select Microphone" dense outlined />
              </q-card-section>
            </q-card>

            <!-- Upload Form -->
            <q-file v-model="audioFile" label="Upload Proceeding Audio" dense outlined class="q-mb-md" />
            <q-btn color="dark" label="Upload" class="full-width" @click="uploadAudio" />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <!-- End Proceedings Modal -->
    <q-dialog v-model="endProceedingDialog">
      <q-card>
        <q-card-section>
          <h5>Next Activity Details</h5>
          <q-select v-model="selectedActivity" :options="activityOptions" label="Next Activity" dense outlined class="q-mb-md" />
          <q-input v-model="activityDate" type="date" label="Activity Date" dense outlined class="q-mb-md" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Submit" @click="submitActivity" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Static data
const isRecording = ref(false);
const isPaused = ref(false);
const selectedMicrophone = ref(null);
const microphoneOptions = ref([{ label: "Microphone 1", value: "microphone1" }, { label: "Microphone 2", value: "microphone2" }]);
const audioFile = ref(null);
const endProceedingDialog = ref(false);
const selectedActivity = ref("");
const activityDate = ref("");

// Static current time display
const formattedTime = computed(() => {
  const now = new Date();
  return now.toLocaleTimeString();
});

const uploadAudio = () => {
  if (!audioFile.value) {
    alert("Please select an audio file.");
    return;
  }
  alert("Audio uploaded successfully!");
};

const startRecordingAndTranscription = () => {
  isRecording.value = true;
  isPaused.value = false;
};

const pauseRecordingAndTranscription = () => {
  isRecording.value = false;
  isPaused.value = true;
};

const resumeRecordingAndTranscription = () => {
  isRecording.value = true;
  isPaused.value = false;
};

const endProceeding = () => {
  endProceedingDialog.value = true;
};

const submitActivity = () => {
  alert("Activity submitted!");
};

onMounted(() => {
  setInterval(() => {
    formattedTime.value = new Date().toLocaleTimeString();
  }, 1000);
});
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
  padding: 20px;
}

/* Transcription Boxes */
.transcription-box {
  min-height: 60px;
  font-family: "Courier New", monospace;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.transcription-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Case Stats */
.stats-card {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  background-color: white;
  padding: 20px;
  text-align: center;
}
</style>
