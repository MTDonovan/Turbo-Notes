<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    /**
     * Initialize the checklist vuex state using the current data set
     * in the device's local storage.
     */
    this.$store.commit("initLocalStorage");
  }
}
</script>
