<template>
  <v-app>
    <v-main>
      <home />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from "@/components/Home.vue";

@Component({
  components: {
    Home,
  },
})
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
