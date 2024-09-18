<script setup>

import MainChart from './MainChart.vue'
import WidgetsStatsA from '../widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from '../widgets/WidgetsStatsTypeD.vue'


const progressGroupExample3 = [
  {
    title: 'Organic Search',
    icon: 'cib-google',
    percent: 56,
    value: '191,235',
  },
  { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
  { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
  { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
]

</script>

<template>
  <div>

    <WidgetsStatsD class="mb-4" />

  </div>
</template>
