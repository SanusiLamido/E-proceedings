<template>
  <q-page class="q-pa-md">
    <q-layout>
      <!-- Header -->
      <q-header> </q-header>

      <!-- Page Content -->
      <q-page-container>
        <q-page class="q-pa-md">
          <div class="row q-col-gutter-lg justify-center">
            <!-- Today's Proceedings Widget -->
            <q-card
              class="col-12 col-sm-6 col-md-4 widget-card"
              clickable
              @click="$router.push('/proceedings')"
            >
              <q-card-section class="widget-content">
                <q-icon name="gavel" class="widget-icon" />
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-h6 text-center">Today's Proceedings</q-item-label>
                    <q-item-label caption class="text-grey-7 text-center"
                      >View and manage today's court proceedings.</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>

            <!-- E Appearances Widget -->
            <q-card
              class="col-12 col-sm-6 col-md-4 widget-card"
              clickable
              @click="$router.push('/appearances')"
            >
              <q-card-section class="widget-content">
                <q-icon name="person" class="widget-icon" />
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-h6 text-center">Appearance</q-item-label>
                    <q-item-label caption class="text-grey-7 text-center"
                      >View and manage online appearances.</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>

            <!-- My Proceedings Widget -->
            <q-card
              class="col-12 col-sm-6 col-md-4 widget-card"
              clickable
              @click="$router.push('/my-proceedings-page')"
            >
              <q-card-section class="widget-content">
                <q-icon name="article" class="widget-icon" />
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-h6 text-center">My Proceedings</q-item-label>
                    <q-item-label caption class="text-grey-7 text-center"
                      >View and manage my proceedings.</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>

            <!-- Additional Widgets -->
            <q-card class="col-12 col-sm-6 col-md-4 widget-card" v-for="n in 5" :key="n">
              <q-card-section class="widget-content">
                <q-icon name="widgets" class="widget-icon" />
                <div class="text-h6 text-center text-weight-medium">Widget {{ n }}</div>
                <div class="text-subtitle2 text-grey-7 text-center">
                  Description for Widget {{ n }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup></script>

<style scoped>
/* Page background */
.q-page {
  background-color: #f8f9fa;
}

/* Widget styling */
.widget-card {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  background-color: white;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Ensure 3 widgets per row */
.col-md-4 {
  flex: 0 0 calc(33.333% - 24px); /* Adjust width for 3 items per row with spacing */
  max-width: calc(33.333% - 24px);
}

/* Ensure proper spacing */
.q-col-gutter-lg {
  gap: 24px;
}

/* Widget hover effect */
.widget-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* Centered content */
.widget-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Centered black icons */
.widget-icon {
  font-size: 42px;
  color: black;
  margin-bottom: 10px;
}

/* Text styles */
.text-h6 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-subtitle2 {
  font-size: 0.875rem;
  color: #6c757d;
}
</style>
