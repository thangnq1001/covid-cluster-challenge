<template>
  <div id="app">
    <div
      tabindex="0"
      @keydown.up="up"
      @keydown.down="down"
      @keydown.left="left"
      @keydown.right="right"
      class="hex-grid"
    >
      <HexGrid
        :width="600"
        :height="600"
        :viewBox="viewBoxString"
      >
        <Layout
          :size="hexagonSize"
          :flat="true"
          :spacing="1.05"
          :origin="{x: 0, y: 0}"
          class="hex-layout"
        >
          <Hexagon
            v-for="(hexagon) of hexagons"
            :key="hexagon.name"
            :q="hexagon.x"
            :r="hexagon.y"
            :s="0"
            class="hex-item"
          >
            <TextComponent>{{ hexagon.name }}</TextComponent>
          </Hexagon>
        </Layout>
      </HexGrid>
    </div>
    <div class="control-panel container p-3">
      <h2 class="text-center">Console</h2>
      <p class="m-0">* Type in and press Enter or click the buttons to execute</p>
      <p class="m-0">* Focus the left frame and use up/down/left/right to move the grid</p>
      <hr>
      <div class="row">
        <label for="add-first-hexagon" class="col-sm-3 col-form-label">First hexagon at (0,0)</label>
        <div class="col-sm-9">
          <input
            type="text"
            id="add-first-hexagon"
            v-model="addFirstHexagonModel.name"
            placeholder="hexagon name"
            class="form-control"
            @keydown.enter="addFirstHexagon"
            :disabled="hexagons.length > 0"
          />
        </div>
        <div class="offset-sm-3 col-sm-9 console-button">
          <button
            class="btn btn-primary btn-block btn-sm"
            @click="addFirstHexagon"
            :disabled="hexagons.length > 0"
          >
            Add
          </button>
        </div>
        <div class="col-sm-12 console-result">
          Result: {{ addFirstHexagonModel.result }}
        </div>
      </div>
      <hr>
      <div class="row">
        <label for="find-neighbors-input" class="col-sm-3 col-form-label">Find neighbors of</label>
        <div class="col-sm-9">
          <Multiselect
            id="find-neighbors-input"
            v-model="findNeighborsModel.of"
            :options="hexagonNames"
            :show-labels="false"
            :disabled="hexagons.length === 0"
            placeholder="Hexagon name"
            @close="findNeighbors"
          />
        </div>
        <div class="offset-sm-3 col-sm-9 console-button">
          <button
            class="btn btn-primary btn-block btn-sm"
            @click="findNeighbors"
            :disabled="hexagons.length === 0 || !findNeighborsModel.of"
          >
            Find
          </button>
        </div>
        <div class="col-sm-12 console-result">
          Result: {{ foundNeighborsString }}
        </div>
      </div>
      <hr>
      <div class="row add-neighbor">
        <label for="add-neighbor-of" class="col-sm-3 col-form-label">Add neighbor of</label>
        <div class="col-sm-3">
          <Multiselect
            id="add-neighbor-of"
            v-model="addNeighborModel.of"
            :options="hexagonNames"
            :disabled="hexagons.length === 0"
            :show-labels="false"
          />
        </div>
        <label for="add-neighbor-border" class="col-sm-1 col-form-label">at</label>
        <div class="col-sm-2">
          <select
            id="add-neighbor-border"
            v-model="addNeighborModel.border"
            :disabled="hexagons.length === 0"
            class="custom-select"
          >
            <option
              v-for="(border) of borderOptions"
              :key="border"
              :value="border"
            >
              {{ border }}
            </option>
          </select>
        </div>
        <label for="add-neighbor-name" class="col-sm-1 col-form-label">name</label>
        <div class="col-sm-2">
          <input
            type="text"
            :min="0"
            :max="5"
            id="add-neighbor-name"
            v-model="addNeighborModel.name"
            :disabled="hexagons.length === 0"
            placeholder="name"
            class="form-control"
            @keydown.enter="addNeighbor"
          />
        </div>
        <div class="offset-sm-3 col-sm-9 console-button">
          <button
            class="btn btn-primary btn-block btn-sm"
            @click="addNeighbor"
            :disabled="hexagons.length === 0 || !addNeighborModel.of || addNeighborModel.border == null || !addNeighborModel.name"
          >
            Add
          </button>
        </div>
        <div class="col-sm-12 console-result">
          Result: {{ addNeighborModel.result }}
        </div>
      </div>
      <hr>
      <div class="row remove-hexagon">
        <label for="remove-hexagon-name" class="col-sm-3 col-form-label">Remove hexagon</label>
        <div class="col-sm-9">
          <Multiselect
            id="remove-hexagon-name"
            v-model="removeHexagonModel.name"
            :options="hexagonNames"
            :show-labels="false"
            :disabled="hexagons.length === 0"
            placeholder="Hexagon name"
          />
        </div>
        <div class="offset-sm-3 col-sm-9 console-button">
          <button
            class="btn btn-danger btn-block btn-sm"
            @click="removeHexagon"
            :disabled="hexagons.length === 0 || !removeHexagonModel.name"
          >
            Remove
          </button>
        </div>
        <div class="col-sm-12 console-result">
          Result: {{ removeHexagonModel.result }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {Hexagon, HexGrid, Layout, Text} from 'vue-hexgrid';
  import {buildHexagonGraph, getBorder, getNewHexagonPosition} from "./utils/hexagon";
  import {Multiselect} from "vue-multiselect";
  import 'vue-multiselect/dist/vue-multiselect.min.css';
  import {message} from "./constants/messages";
  import {BORDER_OPTIONS, DEFAULT_VIEW_BOX, HEXAGON_SIZE, LOCAL_STORAGE_KEY} from "./constants/constants";

  export default {
    name: 'App',

    components: {
      HexGrid,
      Layout,
      Hexagon,
      TextComponent: Text,
      Multiselect,
    },

    data() {
      return {
        hexagonSize: HEXAGON_SIZE,
        viewBox: DEFAULT_VIEW_BOX,
        borderOptions: BORDER_OPTIONS,

        hexagons: [],
        findNeighborsModel: {
          of: '',
          results: [],
          error: '',
        },
        addNeighborModel: {
          of: '',
          name: '',
          border: null,
          result: '',
        },
        removeHexagonModel: {
          name: '',
          result: '',
        },
        addFirstHexagonModel: {
          name: '',
          result: '',
        },
      }
    },

    computed: {
      viewBoxString() {
        return `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
      },
      foundNeighborsString() {
        if (this.findNeighborsModel.error) {
          return this.findNeighborsModel.error;
        }
        return `[${this.findNeighborsModel.results.map(neighbor => `(${neighbor.border}, ${neighbor.name})`).join(', ')}]`;
      },
      hexagonNames() {
        return this.hexagons.map(h => h.name);
      }
    },

    created() {
      let hexagons = localStorage.getItem(LOCAL_STORAGE_KEY.HEXAGONS);
      if (hexagons) {
        this.hexagons = JSON.parse(hexagons);
      }
    },

    methods: {
      up() {
        this.viewBox.y -= 5;
      },

      down() {
        this.viewBox.y += 5;
      },

      left() {
        this.viewBox.x -= 5;
      },

      right() {
        this.viewBox.x += 5;
      },

      addFirstHexagon() {
        // validate
        if (this.hexagons.length > 0) {
          return;
        }
        if (!this.addFirstHexagonModel.name) {
          this.addFirstHexagonModel.result = message.newHexagonNameEmpty();
          return;
        }
        // add
        this.hexagons.push({x: 0, y: 0, name: this.addFirstHexagonModel.name});
        this.saveToLocalStorage();
      },

      findNeighbors() {
        this.findNeighborsModel.error = '';
        this.findNeighborsModel.results = [];
        if (!this.findNeighborsModel.of) {
          return;
        }
        let queriedHexagon = this.hexagons.find(h => h.name === this.findNeighborsModel.of);
        if (!queriedHexagon) {
          this.findNeighborsModel.error = message.queriedHexagonNotExist(this.findNeighborsModel.of);
          return;
        }
        this.hexagons.forEach(h => {
          if (h === queriedHexagon) {
            return;
          }
          let border = getBorder(queriedHexagon, h);
          if (border > -1) {
            this.findNeighborsModel.results.push({border: border, name: h.name})
          }
        })
      },

      addNeighbor() {
        if (!this.addNeighborModel.of) {
          this.addNeighborModel.result = message.queriedHexagonEmpty();
          return;
        }
        if (this.addNeighborModel.border == null || this.addNeighborModel.border < 0 || this.addNeighborModel.border > 5) {
          this.addNeighborModel.result = message.borderInvalid();
          return;
        }
        if (!this.addNeighborModel.name) {
          this.addNeighborModel.result = message.newHexagonNameEmpty();
          return;
        }
        let queriedHexagon = this.hexagons.find(h => h.name === this.addNeighborModel.of);
        if (!queriedHexagon) {
          this.addNeighborModel.result = message.queriedHexagonNotExist(this.addNeighborModel.of)
          return;
        }
        if (this.hexagons.some(h => h.name === this.addNeighborModel.name)) {
          this.addNeighborModel.result = message.newHexagonNameDuplicate(this.addNeighborModel.name);
          return;
        }
        let newHexagonPosition = getNewHexagonPosition(queriedHexagon, this.addNeighborModel.border);
        if (this.hexagons.some(h => h.x === newHexagonPosition.x && h.y === newHexagonPosition.y)) {
          this.addNeighborModel.result = message.newHexagonPositionTaken();
          return;
        }
        this.hexagons.push({
          ...newHexagonPosition,
          name: this.addNeighborModel.name
        });
        this.addNeighborModel.result = message.addHexagonSuccess(this.addNeighborModel.name);
        this.saveToLocalStorage();
      },

      removeHexagon() {
        if (!this.removeHexagonModel.name) {
          this.removeHexagonModel.result = message.queriedHexagonEmpty();
          return;
        }
        if (!this.hexagons.find(h => h.name === this.removeHexagonModel.name)) {
          this.removeHexagonModel.result = message.queriedHexagonNotExist(this.removeHexagonModel.name);
          return;
        }

        let newHexagons = this.hexagons.filter(h => h.name !== this.removeHexagonModel.name);
        // remove is safe with 2 or less hexagons
        if (this.hexagons.length <= 2) {
          this.hexagons = newHexagons;
          this.saveToLocalStorage();
          return;
        }
        // else has to check if links are broken
        let graph = buildHexagonGraph(newHexagons);
        let visitedHexagons = graph.bfsAndGetVisitedVertexes(newHexagons[0].name);

        if (Object.keys(visitedHexagons).length === newHexagons.length) {
          this.hexagons = newHexagons;
          this.saveToLocalStorage();
          this.removeHexagonModel.result = message.removeHexagonSuccess(this.removeHexagonModel.name);
        } else {
          this.removeHexagonModel.result = message.removeHexagonFailure(this.removeHexagonModel.name);
        }
        this.removeHexagonModel.name = '';
      },

      saveToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY.HEXAGONS, JSON.stringify(this.hexagons));
      }
    }
  }

  </script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 10px;
    display: flex;

    .hex-grid {
      flex: 1;
      background-color: #0c282c;

      .hex-layout {
        .hex-item {
          fill: #4499a9;
          fill-opacity: 0.6;

          &:hover {
            fill: #7be3f6;
            fill-opacity: 0.8;

            text {
              fill-opacity: 1;
            }
          }

          polygon {
            stroke: #7be3f6;
            stroke-width: 0.2;
            transition: fill-opacity 0.5s;
          }

          text {
            font-size: 0.3em;
            fill: white;
            fill-opacity: 0.7;
            transition: fill-opacity 0.5s;
          }
        }
      }
    }

    .control-panel {
      flex: 1;
      margin-left: 10px;
      .col-form-label, .console-result {
        font-weight: bold;
      }
      .console-result, .console-button {
        margin-top: 0.25rem;
      }
    }
  }
</style>
