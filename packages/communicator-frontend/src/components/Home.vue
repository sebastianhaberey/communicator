<template>
  <div class="home pa-12">
    <v-btn class="scan-button" color="blue" :rounded="true" :outlined="true">
      Scan
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  width: 800px;
  height: 480px;
  background: white;
}

.scan-button {
  height: 100% !important;
}
</style>
