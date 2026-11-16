<template>
  <div>
    <div class="buttons">
      <button id="download" class="primary" @click="downloadImage()">.PNG<img src="@/assets/img/icons/ic_download.svg" /></button>
    </div>
    <div id="exportable"></div>
  </div>
</template>

<script>
  import { renderToCanvas } from '@/app/export'
  import { saveAs } from 'file-saver';

  // Exported at twice the layout size (1024px layouts -> 2048px PNG) so text and images stay sharp on high-DPI screens.
  const EXPORT_SCALE = 2

  export default {
    name: 'ExportButton',
    data() {
      return {
      }
    },
    methods: {
      async downloadImage() {
        var canvas = document.getElementById('preview')
        var width = canvas.offsetWidth;
        var height = canvas.clientHeight;

        var clone = canvas.cloneNode(true);
        clone.id = "clone";
        var exportable = document.getElementById('exportable')
        var child = exportable.lastElementChild;

        while (child) {
            exportable.removeChild(child);
            child = exportable.lastElementChild;
        }

        clone.style.transform = 'scale(1)';
        clone.id = "clone";
        clone.style.width = width + "px";
        clone.style.height = height + "px";
        exportable.style.width = width + "px";
        exportable.style.height = height + "px";
        clone.style.margin = "0";
        exportable.appendChild(clone);

        canvas = document.getElementById('exportable')

        // Let fonts finish loading and the clone get laid out before the clone is rendered.
        await document.fonts.ready
        await new Promise((resolve) => setTimeout(resolve, 100))

        const rendered = await renderToCanvas(canvas, EXPORT_SCALE)
        rendered.toBlob((blob) => {
          if (blob) saveAs(blob, 'image.png')
        })
      }
    }
  }
</script>

<style scoped>
  .buttons {
    position: absolute;
    bottom: 2rem;
    right: 1.5rem;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  button:not(:last-of-type) {
    margin-right: 1rem;
  }
  #download {
    background-color: var(--turquoise);
    color: var(--black);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    z-index: 999;
  }
  #download img {
    width: 2.5rem;
    height: 2.5rem;
    margin-left: 1rem;
  }
  #exportable {
    position: absolute;
    top: -9999px;
    right: -9999px;
    z-index: 9;
  }
</style>
