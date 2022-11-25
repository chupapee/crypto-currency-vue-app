<template>
  <div class="app">
    <div class="bg-white h-[80vh] overflow-auto flex flex-col w-full max-w-xl mx-auto my-5 border-2 px-3 py-4 rounded-lg">
      <div class="flex sticky top-0 left-0 right-0">
        <button class="bg-white w-full px-3 py-4 border-2 border-b-0">Current</button>
        <button class="bg-gray-500 w-full px-3 py-4 text-white">Done</button>
      </div>
      
      <div class="bg-white flex my-4">
        <input
          class="border-2 px-3 py-4 border-solid rounded-lg w-full mr-3 outline-none focus:border-blue-600 hover:border-blue-600 border-blue-400"
          @keydown.enter="add"
          type="text"
          v-model="newTask"
        >
        <button class="text-3xl text-white px-10 bg-blue-600 hover:bg-blue-800 duration-150 border-solid border-2 rounded-lg" @click="add">+</button>
      </div>
  
      <div class="bg-white flex flex-col" v-if="tasks.length">
        <template key="task.id" v-for="task in tasks">
          <div class="flex py-4 text-lg items-center">
            <input class="mr-4 h-6 w-6" type="checkbox" @click="task.status = 'checked'">
            <p class="w-full" :class="task.status === 'checked' ? 'line-through' : 'none'">{{task.text}}</p>
            <button @click="del(task.id)" class="py-2 px-4 border-red-500 rounded-lg border-solid border-[1px] hover:bg-red-400 hover:text-white">Del</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      newTask: '',
      tasks: []
    }
  },
  methods: {
    add() {
      const task = {id: Math.random().toFixed(4), text: this.newTask, status: null}
      this.tasks.push(task)
      this.newTask = ''
    },
    del(id) {
      const tasks = this.tasks.filter(task => task.id !== id )
      this.tasks = tasks
    },
    check(id) {
      this.tasks
    }
  }
}
</script>

<style src="./style.css">

</style>