<template>
  <div class="post" v-for="item in posts">
    <div> <strong> title: </strong> {{ item.title }} </div>
    <div> <strong> description: </strong> {{ item.description }} </div>
    <button @click="remove(item.id)" class="remove">remove</button>
  </div>
</template>

<script>
  export default {
    props: {
      posts: {
        type: Array,
        required: true,
      }
    },
    methods: {
      remove(id) {
        this.$emit('delete', id)
      }
    }
  }
</script>

<style scoped>
  .post {
    border: 2px darkgreen solid;
    margin: 15px 0;
    padding: 15px;
  }
  .remove {
    padding: 5px 0;
    cursor: pointer;
    color: red;
    border: none;
    background: none;
  }
</style>