<template>
  <v-app>
    <v-main>
      <router-view name="home"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
.v-main__wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: grey;
}
</style>
