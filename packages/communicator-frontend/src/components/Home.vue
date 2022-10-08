<template>
  <div class="h__root">
    <transition name="h__fade">
      <div v-if="isLoading" :key="'LOADING'" class="h__panel pb-1">
        <HashLoader :size="200" color="#FFFFFF" class="h__loader" />
      </div>
      <div v-if="isStart" :key="'START'" class="h__panel">
        <v-btn class="h__scan-button" block tile elevation="0">
          BERÜHREN ZUM STARTEN
        </v-btn>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HashLoader } from "@saeris/vue-spinners";
import { ApplicationStore, State } from "@/store/ApplicationStore";
import { getModule } from "vuex-module-decorators";

@Component({
  components: {
    HashLoader,
  },
})
export default class Home extends Vue {
  private get applicationStore(): ApplicationStore {
    return getModule(ApplicationStore, this.$store);
  }

  protected get state(): State {
    return this.applicationStore.currentState;
  }

  protected get isStart(): boolean {
    return this.state === State.START;
  }

  protected get isLoading(): boolean {
    return this.state === State.LOADING;
  }

  protected get isError(): boolean {
    return this.state === State.ERROR;
  }
}
</script>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss" scoped>
@import "../styles/global.scss";

.h__root {
  width: 800px;
  height: 480px;
}

.h__panel {
  position: absolute;
  width: 800px;
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: black;
}

.h__scan-button {
  @include g__font-large;

  align-items: stretch;
  white-space: normal;
  color: white;
  padding: 0 !important;
  background-color: map-get($cyan, "darken-3") !important;
}

.h__scan-button ::v-deep(.v-btn__content) {
  flex: auto;
  line-height: 1 !important;
}

.h__fade-enter {
  opacity: 0;
}

.h__fade-enter-active {
  transition: opacity 1s;
}

.h__fade-leave-active {
  transition: opacity 1s;
}

.h__fade-leave-to {
  opacity: 0;
}
</style>
