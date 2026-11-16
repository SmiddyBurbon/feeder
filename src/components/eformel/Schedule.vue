<template>
  <div id="canvas" :style="cssVars">
    <div class="headline">
      <div class="country" v-if="this.venue.country"><img :src="flagSrc(this.venue.country)" /></div>
      <div class="event">
        <h1><input class="inputH1" type="text" v-model="venue.title" @blur="updateEvent($event.target.value)" /></h1>
        <h2><input class="inputH2" @blur="updateEvent($event.target.value)" v-model="venue.subline" type="text" placeholder="E-Prix" /></h2>
      </div>
      <div v-if="this.options.sponsor" class="sponsor">
        <img src="/img/eformel/we_logo.svg" alt="Presented by Würth Elektronik" />
      </div>
    </div>

    <ul class="ranking">
      <li v-for="object in objects" :key="object.index" :id="'item' + object.index">
        <input
          class="position"
          type="text"
          :placeholder="[[object.position]]"
          v-model="object.position"
          @blur="updatePosition(object.index, $event.target.value)"
        />
        <div class="left">
          <div class="image-upload" v-if="options.flags">
            <label :for="'flag-input-' + object.index">
              <img
                class="flag"
                :src="flagSrc(object.country)"
              />
            </label>
            <input :id="'flag-input-' + object.index" type="file" @change="changeFlag(object.index)" />
          </div>
          <input
            class="name"
            type="text"
            placeholder="Venue"
            v-model="object.name"
            @blur="updateName(object.index, $event.target.value)"
          />
        </div>
        <div class="right">
          <input
            v-if="options.gap"
            class="gap"
            type="text"
            placeholder="Date"
            v-model="object.gap"
          />
          <div class="image-upload" v-if="options.cars">
            <label :for="'car-input-' + object.index">
              <img
                class="car"
                v-if="options.cars"
                :src="carSrc(object.car)"
              />
            </label>
            <input :id="'car-input-' + object.index" type="file" @change="changeCar(object.index)" />
          </div>
          <input
            v-if="options.points"
            class="points"
            type="number"
            placeholder="0"
            v-model="object.points"
            @blur="updatePoints(object.index, $event.target.value)"
          />
        </div>
      </li>
    </ul>

    <img id="logo" class="small" src="/img/eformel/logo_small.png" />
  </div>
</template>

<script>
  import { flagSrc, carSrc } from '@/app/assets'
  import { loadStored, saveStored } from '@/app/storage'
  import { showPickedImage } from '@/app/uploads'
  import { useEditorStore } from '@/stores/editor'
  import { findEntry } from '@/data/match'
  import { loadSeason } from '@/data/seasons'
  import { countryForVenue } from '@/data/venues'

  export default {
    name: 'Drivers',
    props: [
      'cars',
      'gap',
      'lines',
      'minLines',
      'maxLines',
      'colCount',
      'minColCount',
      'maxColCount',
    ],
    data() {
      return {
        venue: {
          title: '',
          subline: '',
          country: '',
        },
        objects: [],
        width: 1024,
        height: 1024,
        options: {
          bgimage: true,
          flags: true,
          gap: true,
          lines: 15,
          minLines: 1,
          maxLines: 80,
          colCount: 2,
          minColCount: 1,
          maxColCount: 2,
          sponsor: false,
        }
      }
    },
    mounted() {
      const savedObjects = loadStored('EFormelSchedule')
      if (Array.isArray(savedObjects)) this.objects = savedObjects
      else this.createList()

      const savedVenue = loadStored('EFormelScheduleVenue')
      if (savedVenue) {
        Object.assign(this.venue, { title: savedVenue.title, subline: savedVenue.subline, country: savedVenue.country })
      } else {
        this.venue.title = 'Rennkalender'
        this.venue.subline = 'Saison 2022/23'
        this.venue.country = ''
      }

      const editor = useEditorStore()
      editor.registerOptions(this.options)

      this.$watch(() => editor.csvImport, importResult => {
        const results = importResult.rows
        this.parseCSV(results)
      })

      this.$watch(() => editor.optionsRevision, () => {
          const options = editor.options
          if(options.lines < this.objects.length) {
            let diff = this.objects.length - options.lines
            for (var i = 0; i < diff; i++) {
              this.objects.pop()
            }
          }
          else if(options.lines > this.objects.length) {
            var diff = this.objects.length
            for (var j = options.lines; j > diff; j--) {
              this.createObject(this.objects.length)
            }
          }
          else if(options.colCount == 1) {
            this.setColumns(1);
          }
          else if(options.colCount == 2) {
            this.setColumns(2);
          }
      });
    },
    methods: {
      flagSrc,
      carSrc,
      updateEvent() {
        this.setCountry(this.venue.subline)
        this.persistVenue(this.venue)
      },
      setColumns(count) {
        if(count == 1) {
          document.getElementsByClassName("ranking")[0].style.columnCount = 1;
        }
        else {
          document.getElementsByClassName("ranking")[0].style.columnCount = 2;
        }
      },
      parseCSV(results) {
        if(results[0][6] && results[0][6].includes("QUALIFYING")) {
          for(let i = 1; i < results.length; i++) {
            this.objects[i-1].position = results[i][0]
            this.objects[i-1].name = results[i][28] + " " + results[i][29]
            this.objects[i-1].gap = results[i][3]
            this.options.gap = true
            this.options.points = false

            this.updateName(i-1, this.objects[i-1].name)
          }
        }
        else {
          if(results[1][26]) {
            for(let i = 1; i < results.length; i++) {
              this.objects[i-1].position = results[i][0]
              this.objects[i-1].name = results[i][26] + " " + results[i][27]
              this.objects[i-1].gap = results[i][5]
              this.options.gap = true
              this.options.points = false

              this.updateName(i-1, this.objects[i-1].name)
            }
          }
          else {
            for(let i = 0; i < results.length; i++) {
              this.objects[i].position = results[i][0]
              this.objects[i].name = results[i][1]
              this.objects[i].points = results[i][3]
              this.options.gap = false
              this.options.points = true

              this.updateName(i, this.objects[i].name)
            }
          }
        }
        console.log(this.objects)
      },
      setCountry(venue) {
        this.venue.country = countryForVenue(venue)
      },
      async updateName(i, input) {
        const match = findEntry(await loadSeason(), input)
        if (!match) return

        const row = this.objects[i]
        row.name = match.name
        row.country = match.flag
        row.car = match.car
        this.persistObjects(this.objects)
      },
      updatePosition(i, position) {
        this.objects[i].position = parseInt(position)
        if(this.objects[0].position > 1) {
          document.getElementById("canvas").style.backgroundPositionX = "100%";
        }
        else {
          document.getElementById("canvas").style.backgroundPositionX = "0";
        }
        this.persistObjects(this.objects)
      },
      updatePoints(i, points) {
        this.objects[i].points = parseInt(points)
        this.persistObjects(this.objects)
      },
      createList() {
        for (var i = 0; i < this.options.lines; i++) {
          this.createObject(i)
        }
      },
      createObject(i) {
        let object = {}
        object.index = i
        object.position = i + 1
        object.name = ""
        object.flag = ""
        object.gap = ""
        object.car = ""
        object.points = ""
        this.objects.push(object);
      },
      changeFlag(id) {
        showPickedImage('flag-input-' + id, document.querySelector('#item' + id + ' .flag'))
      },
      changeCar(id) {
        showPickedImage('car-input-' + id, document.querySelector('#item' + id + ' .car'))
      },
      persistObjects(objects) {
        saveStored('EFormelSchedule', objects)
      },
      persistVenue(venue) {
        saveStored('EFormelScheduleVenue', venue)
      }
    },
    computed: {
      cssVars() {
        return {
          '--width': this.width + 'px',
          '--height': this.height + 'px'
        }
      }
    }
  }
</script>

<style scoped>
  * {
    box-sizing: content-box;
  }
  #preview {
    width: var(--width);
    height: var(--height);
    transform-origin: 50% 50%;
    /*transform: scale(0.5);*/
    padding: 0;
  }
  #canvas {
    width: var(--width);
    height: var(--height);
    padding: 64px;
    background-color: var(--eFormel-500);
    color: var(--black);
    box-sizing: border-box;
    background-size: 2048px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .headline {
    background-color: var(--white);
    margin-bottom: 28px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    height: 88px;
  }
  .country {
    width: 140px;
    height: 88px;
  }
  .country img {
    display: block;
    width: auto;
    height: 88px;
  }
  .country, .event {
    display: inline;
  }
  .event {
    margin-left: 24px;
  }
  input,
  textarea {
    -webkit-appearance: none;
    border: none;
    outline: none;
    box-shadow: none;
    background: none;
    color: none;
    font-family: var(--eFormel-font);
    color: var(--eFormel-700);
    text-transform: uppercase;
    font-weight: 900;
    font-size: 32px;
    display: inline-block;
  }
  input::placeholder {
    color: var(--main-700);
    opacity: .64;
  }
  h1 input {
    font-size: 32px;
    width: 400px;
  }
  h2 input {
    font-size: 24px;
    font-weight: 400;
    width: 400px;
  }
  h1 {
    margin-top: -24px;
  }
  h2 {
    margin-top: -8px;
  }
  .sponsor {
    display: flex;
    position: absolute;
    right: 0;
  }
  .sponsor img {
    transform-origin: right;
    transform: scale(0.8);
    margin-right: 16px;
    width: auto;
  }
  .ranking {
    column-count: 2;
  }
  .ranking li {
    height: 56px;
    background-color: var(--white);
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    break-inside: avoid-column;
  }
  .ranking li:not(:last-of-type) {
    margin-bottom: 4px;
  }
  .ranking li .position {
    background-color: var(--eFormel-800);
    color: var(--eFormel-100);
    width: 56px;
    text-align: center;
    height: 100%;
    margin: 0 16px 0 0;
  }
  .ranking li .position::placeholder {
    color: var(--eFormel-100);
    opacity: 1;
  }
  .ranking li .name {
    font-size: 28px;
    color: var(--eFormel-700);
    width: 460px;
  }
  .ranking li .left, #ranking li .right {
    display: flex;
    flex-direction: row;
  }
  .ranking li .right {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
  }
  .ranking li .flag {
    height: 32px;
    width: 56px;
    margin-right: 16px;
    display: block;
  }
  .ranking li .gap {
    font-size: 24px;
    text-align: right;
    width: 120px;
    margin-right: 16px;
  }
  .ranking li .car {
    width: 221px;
    height: 56px;
    margin-left: 16px;
  }
  .ranking .points {
    background-color: var(--eFormel-100);
    color: var(--eFormel-700);
    text-align: right;
    width: 72px;
    height: 56px;
    padding-right: 40px;
    margin-left: 16px;
  }
  .ranking .position,
  .ranking .points {
    line-height: 56px;
  }
  .points::-webkit-inner-spin-button,
  .points::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  #logo {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 80px;
    position: absolute;
    bottom: 0;
    left: calc(50% - 40px);
  }
  .image-upload > input {
    display: none;
  }
</style>
