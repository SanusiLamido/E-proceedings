<template>
  <div class="appearance-day-cell">
    <div class="day-number">{{ day }}</div>
    <div v-if="count > 0" class="appearance-count">{{ count }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppearanceDayCell',
  props: {
    day: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
})
</script>

<style lang="scss" scoped>
.appearance-day-cell {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .day-number {
    font-size: 14px;
  }

  .appearance-count {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
