<template>
  <!-- add ticker -->
  <add-ticker :disabled="tooManyTickersAdded" @addTicker="add" />
  <button class="baseBtn mt-4" @click="openModal">modal</button>
  <Modal ref="modalRef">
    <template #content="{ open, close, confirm }">
      <DeleteModal @confirm="confirm()" />
    </template>
  </Modal>

  <!-- filter & pagination -->
  <div class="flex flex-col border-y-2 border-gray-600 border-solid p-4 my-4">
    <div v-if="tickers.length > 6">
      <button @click="page = page - 1" v-if="page > 1" class="baseBtn mr-4">
        Назад
      </button>
      <button
        @click="page = page + 1"
        v-if="page * 6 < tickers.length"
        class="baseBtn"
      >
        Вперед
      </button>
    </div>
    <div class="mt-4">
      <p class="text-xl font-medium text-gray-600 mb-1">filter:</p>
      <input
        v-model="filter"
        class="px-4 py-3 mr-4 border-[1px] mb-2 border-solid rounded-lg outline-none hover:border-blue-700 focus:border-blue-700 w-1/5"
      />
    </div>
  </div>

  <!-- list -->
  <div
    v-if="tickers.length"
    class="border-y-2 border-gray-600 border-solid p-4 my-4 grid grid-cols-3 justify-items-center"
  >
    <template key="ticker.name" v-for="ticker in paginatedTickers">
      <div
        class="flex flex-col items-center gap-4 my-2 p-4 px-10 rounded-lg border-[1px] cursor-pointer"
        :class="selected === ticker ? 'border-blue-600' : 'border-gray-300'"
        @click="select(ticker)"
      >
        <p class="uppercase font-medium text-xl text-gray-500">
          {{ ticker.name }} - USD
        </p>
        <p class="font-medium text-3xl">{{ ticker.price }}</p>
        <button
          class="hover:bg-blue-500 hover:text-white px-3 py-2 border-blue-600 rounded-lg border-solid border-[1px]"
          @click.stop="del(ticker)"
        >
          Удалить
        </button>
      </div>
    </template>
  </div>

  <!-- graph -->
  <div ref="graph">
    <Graph :selected="selected" :graph="graph" />
  </div>
</template>

<script>
import { subscribeToTicker, unSubscribeToTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";
import Graph from "./components/Graph.vue";
import Modal from "./components/Modal.vue";
import DeleteModal from "./components/DeleteModal.vue";

export default {
  name: "App",

  components: {
    AddTicker,
    Graph,
    Modal,
    DeleteModal,
  },

  data() {
    return {
      filter: "",
      selected: {},

      tickers: [],

      page: 1,

      graph: [],
      maxGraphElements: 1,
    };
  },

  mounted() {
    // setInterval(() => {console.log(this.graph)}, 1000)
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams
    );
    if (windowData) {
      this.page = Number(windowData.page ?? 1);
      this.filter = windowData.filter ?? "";
    }

    const tickers = this.getFromLocalstorage();
    if (tickers && tickers.length) {
      this.tickers = tickers;
      tickers.forEach((ticker) =>
        subscribeToTicker(ticker.name, (newPrice) => {
          this.updateTicker(ticker, newPrice);
        })
      );
    }
  },

  computed: {
    filteredTickers() {
      if (this.tickers.length > 0) {
        return this.tickers.filter(({ name }) =>
          name.includes(this.filter.toUpperCase())
        );
      }
    },
    paginatedTickers() {
      const start = 6 * (this.page - 1);
      const end = this.page * 6;

      if (this.tickers.length > 0) {
        return this.filteredTickers.slice(start, end);
      }
      return this.tickers;
    },
    tooManyTickersAdded() {
      return this.tickers.length >= 12;
    },
  },

  methods: {
    async openModal() {
      const modalResult = await this.$refs.modalRef.open();
      if (modalResult) alert("confirmed");
    },
    calculateMaxGraphElements() {
      if (!this.$refs.graph) return;
      this.maxGraphElements = (this.$refs.graph.offsetWidth / 40).toFixed(0);
    },
    log(data) {
      console.log(data);
    },
    select(ticker) {
      if (this.selected === ticker) {
        this.selected = null;
      } else {
        this.selected = ticker;
      }
    },
    updateTicker(ticker, newPrice) {
      this.tickers
        .filter((t) => t.name === ticker.name)
        .forEach((t) => {
          t.price = newPrice;
        });
      if (
        Object.keys(this.selected).length &&
        this.selected.name === ticker.name
      ) {
        this.graph.push(newPrice);
        while (this.graph.length > this.maxGraphElements) this.graph.shift();
      }
      this.setTolocalstorage();
    },
    add(ticker) {
      const newTicker = {
        id: Date.now(),
        name: ticker.toUpperCase(),
        price: "-",
      };

      this.tickers.push(newTicker);

      subscribeToTicker(newTicker, (newPrice) => {
        this.updateTicker(newTicker.name, newPrice);
      });

      this.setTolocalstorage();
    },
    del(tickerToRemove) {
      if (this.selected === tickerToRemove) this.selected = null;
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove);
      this.setTolocalstorage();
    },
    setTolocalstorage() {
      localStorage.setItem("tickerList", JSON.stringify(this.tickers));
    },
    getFromLocalstorage() {
      return JSON.parse(localStorage.getItem("tickerList"));
    },
  },

  watch: {
    selected() {
      this.graph = [];
      this.$nextTick().then(() => this.calculateMaxGraphElements());
    },
    add() {
      this.page = this.tickers.length;
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) this.page -= 1;
    },
    page() {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?page=${this.page}&filter=${this.filter}`
      );
    },
    filter() {
      this.page = 1;
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?page=${this.page}&filter=${this.filter}`
      );
    },
  },
};
</script>

<style src="./style.css"></style>
