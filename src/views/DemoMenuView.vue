<template>
  <div>
    <AppHeader></AppHeader>
    <div class="menu">
      <ul>
        <li>
          <router-link to="/studio?type=demo_table">
            <div class="thumb">
              <img src="/img/demo/preview/table.png" />
            </div>
            <span>Premier League Table<br />(auto-filled)</span>
          </router-link>
        </li>
        <li>
          <router-link to="/studio?type=demo_score">
            <div class="thumb">
              <img src="/img/demo/preview/score.png" />
            </div>
            <span>Match Score: EURO 2020 &nbsp; Premier League</span>
          </router-link>
        </li>
        <li>
          <router-link to="/studio?type=demo_formulae">
            <div class="thumb">
              <img src="/img/demo/preview/formulae.png" />
            </div>
            <span>Formula E Race Result</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'DemoMenuView',
  components: { AppHeader },
  data() {
    return {};
  },
  methods: {

  }
}
</script>

<style>
.menu {
  width: 100vw;
  overflow: scroll;
}
</style>
