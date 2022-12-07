<template>
  <!-- updating ticker -->
  <div class="flex flex-col">
    <span class="py-2 text-lg font-medium">Тикер</span>
    <input
      v-model="tickerName"
      @keydown.enter="add"
      placeholder="Например DOGE"
      type="text"
      class="px-4 py-3 uppercase mr-4 border-[1px] mb-2 border-solid rounded-lg outline-none hover:border-blue-700 focus:border-blue-700 w-1/4"
    >
    <button @click="add" class="baseBtn">Добавить +</button>
  </div>

  <!-- filter & pagination -->
  <div class="flex flex-col border-y-2 border-gray-600 border-solid p-4 my-4">
    <div v-if="tickers.length > 6">
      <button @click="page = page - 1" v-if="page > 1" class="baseBtn mr-4">Назад</button>
      <button @click="page = page + 1" v-if="page * 6 < tickers.length" class="baseBtn">Вперед</button>
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
  <div v-if="tickers.length" class="border-y-2 border-gray-600 border-solid p-4 my-4 grid grid-cols-3 justify-items-center">
    <template key="ticker.name" v-for="ticker in paginatedTickers">
      <div class="flex flex-col items-center gap-4 my-2 p-4 rounded-lg border-2 cursor-pointer"
        :class="selected === ticker ? 'border-red-300' : 'border-transparent'"
        @click="select(ticker)">
        <p class="uppercase font-medium text-xl text-gray-500">{{ticker.name}} - USD</p>
        <p class="font-medium text-3xl">{{ticker.price}}</p>
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
  <template v-if="(selected)">
    <p class="text-xl font-bold">{{(selected.name)}}- USD</p>
    <div ref="graph" class="w-full border-l-2 border-b-2 h-80 pt-10 border-black mt-11 flex items-end">
      <p v-for="price in graph" :style="{height: `${price + 10}%`}" class="mx-[1px] w-10 rounded-t-lg first:ml-0 last:mr-0 bg-indigo-600 max-h-[99%]"></p>
    </div>
  </template>

</template>

<script>
import { subscribeToTicker, unSubscribeToTicker } from './api'

export default {
  name: 'App',
  data() {
    return {
      tickerName: '',
      filter: '',
      selected: null,

      tickers: [],

      page: 1,

      graph: []
    }
  },
  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams)
    if(windowData) {
      this.page = Number(windowData.page ?? 1)
      this.filter = windowData.filter ?? ''
    }

    const tickers = this.getFromLocalstorage()
    if (tickers && tickers.length) {
      this.tickers = tickers
      tickers.forEach(ticker => subscribeToTicker(ticker.name, (newPrice) => {this.updateTicker(ticker, newPrice)}))
    }
  },

  computed: {
    maxGraphElements() {
      return this.graph.length / 40
    },
    filteredTickers() {
      if(this.tickers.length > 0) {
        return this.tickers.filter(({name}) => name.includes(this.filter.toUpperCase()))
      }
    },
    paginatedTickers() {
      const start = 6 * (this.page - 1)
      const end = this.page * 6
      
      if(this.tickers.length > 0) {
        return this.filteredTickers.slice(start, end)
      }
      return this.tickers
    }
  },

  methods: {
    log(data) {
      console.log(data);
    },
    select(ticker) {
      if(this.selected === ticker){
        this.selected = null
        this.graph = []
      }
      else {
        this.selected = ticker
        this.graph = []
        this.graph.push(+String(ticker.price).slice(0, 2))
      }
    },
    updateTicker(ticker, newPrice) {
      this.tickers
      .filter(t => t.name === ticker.name)
      .forEach(t => t.price = newPrice)
      this.setTolocalstorage()
      if(this.selected.name === ticker.name) {
        if(this.maxGraphElements > this.$refs.graph.clientWidth) this.graph.shift()
        if(this.selected.name === ticker.name) this.graph.push(+String(Math.random() * 100).slice(0, 2))
      }
    },
    add() {
      if(this.tickerName) {
        const currentTicker = {
          id: Date.now(),
          name: this.tickerName.toUpperCase(),
          price: '-',
          status: null
        }
        
        this.tickers.push(currentTicker)
        
        subscribeToTicker(currentTicker, newPrice => {
          this.updateTicker(currentTicker.name, newPrice)
        })
        
        this.setTolocalstorage()
        this.tickerName = ''
      }
    },
    del(tickerToRemove) {
      if(this.selected === tickerToRemove) this.selected = null
      this.tickers = this.tickers.filter(ticker => ticker !== tickerToRemove)
      this.setTolocalstorage()
    },
    setTolocalstorage() {
      localStorage.setItem('tickerList', JSON.stringify(this.tickers))
    },
    getFromLocalstorage() {
      return JSON.parse(localStorage.getItem('tickerList'))
    }
  },
  
  watch: {
    add() {
      this.page = this.tickers.length
    },
    paginatedTickers() {
      if(this.paginatedTickers.length === 0 && this.page > 1) this.page -= 1
    },
    page() {
      window.history.pushState(null, document.title, `${window.location.pathname}?page=${this.page}&filter=${this.filter}`)
    },
    filter() {
      this.page = 1
      window.history.pushState(null, document.title, `${window.location.pathname}?page=${this.page}&filter=${this.filter}`)
    }
  }
}
</script>

<style src="./style.css">

</style>