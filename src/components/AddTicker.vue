<template>
  <div class="flex flex-col">
    <span class="py-2 text-lg font-medium">Тикер</span>
    <input
      v-model="ticker"
      @keydown.enter="!disabled && add()"
      placeholder="Например DOGE"
      type="text"
      class="px-4 py-3 uppercase mr-4 border-[1px] mb-2 border-solid rounded-lg outline-none hover:border-blue-700 focus:border-blue-700 w-1/4"
    >
    <button @click="add" :disabled="disabled" class="baseBtn">Добавить +</button>
  </div>
</template>

<script>
  export default {
    name: 'addTicker',

    data() {
      return {
        ticker: '',
      }
    },

    methods: {
      add() {
        if(this.ticker)
        this.$emit('addTicker', this.ticker)
        this.ticker = ''
      }
    },

    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },

    emits: {
      'addTicker': ticker => (
        typeof ticker === 'string' && ticker.length > 0
      )
    }
  }
</script>