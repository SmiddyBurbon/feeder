<template>
  <div>
    <AppHeader></AppHeader>
    <div class="menu">
      <ul>
        <li>
          <router-link to="studio?type=feeder_table">
            <div class="thumb">
              <img src="/img/eformel/preview/results.webp" />
            </div>
            <span>Results</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'FeederMenuView',
  components: { AppHeader },
  data() {
    return {};
  },
  methods: {

  }
}
</script>

<style>
:root {
  --eFormel-100: #CDFBF2;
  --eFormel-200: #9DF8ED;
  --eFormel-300: #6AEAE5;
  --eFormel-400: #44D0D6;
  --eFormel-500: #11A7BB;
  --eFormel-600: #0C83A0;
  --eFormel-700: #086386;
  --eFormel-800: #05476C;
  --eFormel-900: #033359;
  --eFormel-font: 'Roboto Condensed', sans-serif;
}
</style>
