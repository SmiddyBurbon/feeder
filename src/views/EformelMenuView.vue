<template>
  <div>
    <AppHeader></AppHeader>
    <div class="menu">
      <ul>
        <li>
          <router-link to="studio?type=eformel_results">
            <div class="thumb">
              <img src="/img/eformel/preview/results.png" />
            </div>
            <span>Ergebnisse</span>
          </router-link>
        </li>
        <!-- Currently only Ergebnisse is used. To bring the other graphic types back, uncomment these entries,
             the matching lines in components/studio/PreviewCanvas.vue and the redirect in router.ts.
             (Preview images for them no longer exist; add img/eformel/preview/<type>.png or drop the thumbnail.)
        <li>
          <router-link to="studio?type=eformel_drivers">
            <div class="thumb">
              <img :src="'/img/eformel/preview/drivers.png'" />
            </div>
            <span>Fahrerwertung</span>
          </router-link>
        </li>
        <li>
          <router-link to="studio?type=eformel_teams">
            <div class="thumb">
              <img :src="'/img/eformel/preview/teams.png'" />
            </div>
            <span>Teamwertung</span>
          </router-link>
        </li>
         <li>
          <router-link to="studio?type=eformel_schedule">
            <div class="thumb">
              <img :src="'/img/eformel/preview/schedule.png'" />
            </div>
            <span>Rennkalender</span>
          </router-link>
        </li>
        <li>
          <router-link to="studio?type=eformel_quali">
            <div class="thumb">
              <img src="/img/eformel/preview/quali.png" />
            </div>
            <span>Quali</span>
          </router-link>
        </li>
        -->
      </ul>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'EformelMenuView',
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
