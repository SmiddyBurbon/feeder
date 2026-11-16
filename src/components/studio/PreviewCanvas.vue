<template>
  <main id="main">
    <div id="preview">
      <RankingTemplate v-if="rankingVariant" :key="rankingVariant" :variant="rankingVariant"></RankingTemplate>
      <EFormelQuali v-if="isType('eformel_quali')"></EFormelQuali>
      <EFormelSchedule v-if="isType('eformel_schedule')"></EFormelSchedule>

      <DemoTable v-if="isType('demo_table')"></DemoTable>
      <DemoScore v-if="isType('demo_score')"></DemoScore>
      <DemoFormulaE v-if="isType('demo_formulae')"></DemoFormulaE>

      <FeederTable v-if="isType('feeder_table')"></FeederTable>
    </div>
  </main>
</template>

<script>
  import RankingTemplate from '@/components/eformel/RankingTemplate.vue'
  import EFormelQuali from '@/components/eformel/Quali.vue'
  import EFormelSchedule from '@/components/eformel/Schedule.vue'

  import DemoTable from '@/components/demo/DemoTable.vue'
  import DemoScore from '@/components/demo/Score.vue'
  import DemoFormulaE from '@/components/demo/FormulaE.vue'

  import FeederTable from '@/components/feeder/FeederTable.vue'

  export default {
    name: 'PreviewCanvas',
    components: {
      RankingTemplate, EFormelQuali, EFormelSchedule,
      DemoTable, DemoScore, DemoFormulaE,
      FeederTable
    },
    computed: {
      rankingVariant() {
        const variants = { eformel_results: 'results', eformel_drivers: 'drivers', eformel_teams: 'teams' }
        return variants[this.$route.query.type] ?? null
      }
    },
    mounted() {
      this.resizeCanvas()
    },
    methods: {
      resizeCanvas() {
        var preview = document.getElementById('preview');
        var main = document.getElementById('main');
        let factor

        if (preview.getBoundingClientRect().height > preview.getBoundingClientRect().width) {
          factor = (main.clientHeight) / (preview.clientHeight);
        }
        else if (preview.getBoundingClientRect().height == preview.getBoundingClientRect().width) {
          if(main.getBoundingClientRect().height > main.getBoundingClientRect().width){
            factor = (main.offsetWidth) / preview.offsetWidth;
          }
          else {
            factor = (main.clientHeight) / (preview.clientHeight);
          }
        }
        else {
          factor = (main.offsetWidth) / preview.offsetWidth;
        }
        preview.style.transform = 'scale(' + factor + ')'
      },
      isType(type) {
        if (this.$route.query.type == type) {
          return true
        }
        else {
          return false
        }
      }
    }
  }
</script>

<style scoped>
  main {
    background-color: var(--bg-grey);
    background-image: url('@/assets/img/bg_pattern.svg');
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    height: calc(100vh - 4rem);
  }
  #preview {
    transform-origin: 50% 50%;
    /*transform: scale(0.5);*/
    padding: 0;
    width: auto;
    height: auto;
  }
</style>
