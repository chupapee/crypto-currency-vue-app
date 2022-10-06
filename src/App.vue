<template>
  <div class="wrap">
    <Form @add="create" />
    <Posts @delete="remove" v-bind:posts='posts'/>
  </div>
</template>

<script>
import Posts from './components/Posts.vue'
import Form from './components/Form.vue'

export default {
  components: {
    Posts,
    Form
},
    data() {
      return {
        posts: [
          { id: 1, title: 'text1', description: 'Lorem ipsum dolor sit amet.' },
          { id: 2, title: 'text2', description: 'Lorem ipsum dolor sit amet.' },
          { id: 3, title: 'text3', description: 'Lorem ipsum dolor sit amet.' },
          { id: 4, title: 'text4', description: 'Lorem ipsum dolor sit amet.' },
        ],
      }
    },
    methods: {
      mounted() {
        console.log(this.posts);
      },
      create(post) {
        this.posts.push({...post})
      },
      remove(postId) {
        // console.log(postId);
        // console.log(this.posts[0]);
        // const newList = this.posts.filter(({id}) => id !== postId)
        // this.posts = {...newList}
      }
    },
  }
</script>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.wrap {
  padding: 15px;
  margin: 15px;
}
</style>