<template>
  <div id="studio">
    <AppHeader></AppHeader>
    <button type="button" id="optionsButton" class="secondary" @click="toggleSidebar()"><img :src="optionsButton" /></button>
    <div id="editor">
      <StudioSidebar id="aside" :class="{ open: sidebarOpen }"></StudioSidebar>
      <PreviewCanvas></PreviewCanvas>
    </div>
    <ExportButton></ExportButton>
    <div id="safariMessage" v-if="isSafari">
      <p>Safari might not produce optimal results. We recommend using Chrome or Firefox.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useEditorStore } from '@/stores/editor'
import StudioSidebar from '@/components/studio/StudioSidebar.vue'
import PreviewCanvas from '@/components/studio/PreviewCanvas.vue'
import ExportButton from '@/components/studio/ExportButton.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'StudioView',
  components: { StudioSidebar, PreviewCanvas, ExportButton, AppHeader },
  computed: {
    ...mapState(useEditorStore, ['sidebarOpen']),
    optionsButton() {
      return this.sidebarOpen ? '/img/icons/ic_close.svg' : '/img/icons/ic_options.svg'
    },
    isSafari() {
      return navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
    }
  },
  methods: {
    ...mapActions(useEditorStore, ['toggleSidebar'])
  }
}
</script>

<style>
:root {
  --white: #FFF;
  --bg-grey: #F7F7F8;
  --grey: #808B96;
  --black: #2C3E50;
}
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100vw;
  width: 100vh;
  overflow: hidden;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  background: var(--white);
  font-family: Karla, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--black);
  display: grid;
  width: 100vw;
  height: 100vh;
}
#studio {
  position: relative;
}
#optionsButton {
  display: none;
  position: fixed;
  top: 6rem;
  left: 1.5rem;
  z-index: 999;
}
#editor {
  display: grid;
  position: relative;
  width: 100vw;
  height: calc(100vh - 4rem);
  margin-top: 4rem;
  grid-template-columns: 25vw 75vw;
}
#footer_logo {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
}
#safariMessage {
  display: block;
  background-color: var(--red);
  color: var(--white);
  font-weight: 700;
  padding: 1rem 4rem;
  width: 100vw;
  position: absolute;
  bottom: 0;
  animation-name: showSafariMessage;
  animation-duration: .5s;
  animation-timing-function: ease-in-out;
}
@keyframes showSafariMessage {
  from  { bottom: -100%; }
  to    { bottom: 0; }
}
@media screen and (max-width: 1024px) {
  #editor {
    display: block;
  }
  #aside {
    position: absolute;
    width: auto;
    min-width: 50vw;
    height: calc(100vh - 4rem);
    top: 0;
    left: -100vw;
    z-index: 2;
    padding-top: 8rem;
    transition: .2s ease-in-out;
    -webkit-transition: .2s ease-in-out;
    -moz-transition: .2s ease-in-out;
  }
  #optionsButton {
    display: block;
  }
  #optionsButton img {
    display: block;
  }
}
@media screen and (max-width: 600px) {
  #editor {
    display: block;
  }
  #aside {
    position: absolute;
    width: 100vw;
    min-width: 100vw;
    height: 100%;
    top: 0;
    left: -100vw;
    z-index: 99;
    padding-top: 8rem;
  }
  #optionsButton {
    display: block;
  }
}
#aside.open {
  left: 0;
}
</style>
