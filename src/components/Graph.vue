<template>
  <div ref="graph" class="graph" v-if="(Object.keys(selected).length)">
    <p class="text-xl font-bold">{{(selected.name)}} - USD</p>
    <div class="w-full border-l-2 border-b-2 h-80 pt-10 border-black mt-11 flex items-end">
      <p v-for="price in graph" :style="{height: `${price + 10}%`}" class="mx-[1px] w-[40px] rounded-t-lg first:ml-0 last:mr-0 bg-indigo-600 max-h-full"></p>
    </div>
  </div>
</template>

<script>
  export default {
    
    
    props: {
      selected: {
        type: Object,
        required: true,
        default: {},
      },
      graph: {
        type: Object,
        required: false,
        default: [],
      }
    }
  }
</script>