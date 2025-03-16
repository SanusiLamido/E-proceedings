<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <section class="hero-section q-pa-md">
      <div class="container q-mx-auto" style="max-width: 1200px">
        <div class="row items-center" style="min-height: 80vh">
          <div class="col-12 col-md-6 q-pr-md">
            <h1 class="text-h2 text-weight-bold q-mb-md">
              E-Proceedings
              <br />
              <span class="text-primary">Management System</span>
            </h1>
            <p class="text-h6 text-grey-8 q-mb-xl">
              Streamline your court proceedings with our modern, efficient, and user-friendly
              digital management system.
            </p>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-auto">
                <q-btn
                  to="/my-proceedings"
                  color="primary"
                  label="My Proceedings"
                  class="full-width"
                  size="lg"
                  unelevated
                />
              </div>
              <div class="col-12 col-sm-auto">
                <q-btn
                  color="grey-3"
                  text-color="primary"
                  label="Learn More"
                  class="full-width"
                  size="lg"
                  unelevated
                  @click="scrollToFeatures"
                />
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 q-pt-md-none q-pt-xl">
            <img
              src="../assets/hero-illustration.svg"
              alt="Hero Illustration"
              style="width: 100%"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features-section q-py-xl bg-grey-1">
      <div class="container q-mx-auto q-px-md" style="max-width: 1200px">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md">Key Features</h2>
          <p class="text-h6 text-grey-8">Discover what makes our system stand out</p>
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="feature-card">
              <q-card-section>
                <div class="text-center q-mb-md">
                  <q-icon name="description" size="4em" color="primary" />
                </div>
                <h3 class="text-h5 text-weight-bold text-center q-mb-md">Digital Management</h3>
                <p class="text-grey-8 text-center">
                  Efficiently manage and organize all your court proceedings in one centralized
                  digital platform.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="feature-card">
              <q-card-section>
                <div class="text-center q-mb-md">
                  <q-icon name="search" size="4em" color="primary" />
                </div>
                <h3 class="text-h5 text-weight-bold text-center q-mb-md">Smart Search</h3>
                <p class="text-grey-8 text-center">
                  Quickly find any proceeding with our powerful search and filtering capabilities.
                </p>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="feature-card">
              <q-card-section>
                <div class="text-center q-mb-md">
                  <q-icon name="analytics" size="4em" color="primary" />
                </div>
                <h3 class="text-h5 text-weight-bold text-center q-mb-md">Analytics</h3>
                <p class="text-grey-8 text-center">
                  Get valuable insights with comprehensive analytics and reporting tools.
                </p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section q-py-xl">
      <div class="container q-mx-auto q-px-md" style="max-width: 1200px">
        <div class="row q-col-gutter-lg">
          <div class="col-6 col-md-3">
            <div class="text-center">
              <div class="text-h2 text-primary text-weight-bold">5K+</div>
              <div class="text-subtitle1 text-grey-8">Proceedings</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center">
              <div class="text-h2 text-primary text-weight-bold">98%</div>
              <div class="text-subtitle1 text-grey-8">Accuracy</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center">
              <div class="text-h2 text-primary text-weight-bold">24/7</div>
              <div class="text-subtitle1 text-grey-8">Availability</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-center">
              <div class="text-h2 text-primary text-weight-bold">100+</div>
              <div class="text-subtitle1 text-grey-8">Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section q-py-xl bg-primary text-white">
      <div class="container q-mx-auto q-px-md" style="max-width: 1200px">
        <div class="row items-center justify-between">
          <div class="col-12 col-md-7">
            <h2 class="text-h3 text-weight-bold q-mb-md">Ready to Get Started?</h2>
            <p class="text-h6 q-mb-md">
              Join thousands of legal professionals who are already using our system.
            </p>
          </div>
          <div class="col-12 col-md-4">
            <q-btn
              to="/my-proceedings"
              color="white"
              text-color="primary"
              label="Go to My Proceedings"
              class="full-width"
              size="lg"
              unelevated
            />
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const featuresSection = ref(null)

const scrollToFeatures = () => {
  featuresSection.value.$el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss">
.index-page {
  .hero-section {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  }

  .feature-card {
    height: 100%;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
    }
  }

  .stats-section {
    background-color: white;
  }

  .cta-section {
    background: linear-gradient(135deg, var(--q-primary) 0%, darken($primary, 10%) 100%);
  }
}
</style>
