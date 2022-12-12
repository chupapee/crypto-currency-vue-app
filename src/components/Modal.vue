<template>
  <div
    v-if="isOpen"
    @click="close"
    class="absolute left-0 right-0 top-0 bottom-0 bg-black/30 flex justify-center items-center"
  >
    <div @click.stop>
      <slot name="content" :confirm="confirm"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
  },

  mounted() {
    document.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  },
  modalController: null,

  methods: {
    handleKeydown(e) {
      e.code === "Escape" && this.close();
    },
    open() {
      let resolve;
      let reject;
      const modalPromise = new Promise((ok, fail) => {
        (resolve = ok), (reject = fail);
      });
      this.$options.modalController = { resolve, reject };
      this.isOpen = true;
      return modalPromise;
    },
    confirm() {
      this.$options.modalController.resolve(true);
      this.isOpen = false;
    },
    close() {
      this.$options.modalController.resolve(false);
      this.isOpen = false;
    },
  },
};
</script>
