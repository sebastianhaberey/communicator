<template>
  <div class="h__root">
    <transition name="h__fade">
      <div v-if="isLoading" :key="'LOADING'" class="h__panel">
        <div class="h__centered">
          <HashLoader :size="100" color="#FFFFFF" class="h__loader" />
        </div>
      </div>
      <div v-if="isStart" :key="'START'" class="h__panel">
        <div class="h__single">
          <v-btn class="h__button_large cyan darken-3" tile>
            BERÜHREN ZUM STARTEN
          </v-btn>
        </div>
      </div>
      <div v-if="isChoice" :key="'CHOICE'" class="h__panel">
        <div class="h__triple">
          <v-btn class="h__button_medium cyan darken-3" tile>
            WEITERE<br />SEITE<br />
            SCANNEN
          </v-btn>
          <v-btn class="h__button_medium lime darken-3" tile>
            DOKUMENT<br />
            SENDEN<br />
            12 SEITEN
          </v-btn>
          <v-btn class="h__button_medium pink darken-3" tile> ABBRECHEN </v-btn>
        </div>
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

  protected get isChoice(): boolean {
    return this.state === State.CHOICE;
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
  background-color: darkslategray;
}

.h__centered {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h__single {
  padding: 5px;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.h__triple {
  padding: 5px;
  flex-grow: 1; // needed to fill container horizontally
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 5px;
}

.h__button {
  color: white;
  //text-shadow: 2px 2px black;
  white-space: normal; // needed for line break to work
  display: block; // needed for line break to work
  padding: 0 !important; // needed to eliminate left / right padding inside button
  height: unset !important; // needed for button to fill container vertically
}

.h__button ::v-deep(.v-btn__content) {
  line-height: 1 !important; // needed for reasonable line spacing
}

.h__button_large {
  @extend .h__button;
  @include g__font-large;
}

.h__button_medium {
  @extend .h__button;
  @include g__font-medium;
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
