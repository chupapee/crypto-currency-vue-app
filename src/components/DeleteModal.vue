<template>
  <div class="w-80 h-52 bg-white text-black rounded-lg p-4 text-xl text-center flex flex-col justify-evenly">
    <p>Are you sure you want to delete this task?</p>
    <div class="flex text-left [&>button]:w-full flex-col">
      <p>Введите <span class="text-red-500">{{ $options.CONFIRMATION_CODE }}</span></p>
      <input :placeholder="$options.CONFIRMATION_CODE" type="text" class="border-2 p-2 px-3 my-2" v-model="confirmationCode">
      <button :disabled="!isConfirmationCorrect" @click="confirm" class="baseBtn">ok</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'deleteModal',
  CONFIRMATION_CODE: 'ПОДТВЕРЖДАЮ',
  data() {
    return {
      confirmationCode: ''
    }
  },
  methods: {
    log(data) {
      console.log(data);
    },
    confirm() {
      this.$emit('confirm')
    }
  },
  computed: {
    isConfirmationCorrect() {
      return this.confirmationCode === this.$options.CONFIRMATION_CODE
    }
  },
  emits: {
    confirm: null,
    close: null
  }
}

</script>