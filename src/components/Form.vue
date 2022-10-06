<template>
  <form class="form" @submit.prevent>
    <input
      v-model="post.title"
      class="input"
      type="text"
      placeholder="type new post title..."
    />
    <input
      v-model="post.description"
      class="input"
      type="text"
      placeholder="type new post description..."
    />
    <button @click="newPost">add</button>
</form>
</template>

<script>
  export default {
    data() {
      return {
        post: {
          id: Date.now(),
          title: '',
          description: '',
        }
      }
    },
    methods: {
      newPost() {
        this.$emit('add', this.post)
        this.post.title = '',
        this.post.description = ''
      }
    }
  }
</script>

<style scoped>
  .form {
    display: flex;
    gap: 10px;
  }

  button {
    padding: 5px 20px;
  }

  .input {
    padding: 5px;
  }
</style>