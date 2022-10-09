<template>
  <div class="h__root">
    <transition name="h__fade">
      <div v-if="state === 'LOADING'" :key="'LOADING'" class="h__panel">
        <div class="h__centered">
          <HashLoader :size="100" color="#FFFFFF" class="h__loader" />
        </div>
      </div>
      <div v-if="state === 'SPLASH'" :key="'SPLASH'" class="h__panel">
        <div class="h__single">
          <v-btn
            class="h__button_large blue darken-3"
            tile
            depressed
            @click="start()"
          >
            QUICKSCANNER V1.0
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'START'" :key="'START'" class="h__panel">
        <div class="h__double">
          <v-btn
            class="h__button_medium cyan darken-3"
            tile
            depressed
            @click="scan()"
          >
            SCANNEN
          </v-btn>
          <v-btn
            class="h__button_medium pink darken-3"
            tile
            depressed
            @click="shutdown()"
          >
            HERUNTERFAHREN
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'CONTINUE'" :key="'CONTINUE'" class="h__panel">
        <div class="h__triple">
          <v-btn
            class="h__button_medium cyan darken-3"
            tile
            depressed
            @click="scan()"
          >
            NÄCHSTE<br />
            SEITE<br />
            SCANNEN
          </v-btn>
          <v-btn
            class="h__button_medium lime darken-3"
            tile
            depressed
            @click="send()"
          >
            DOKUMENT<br />
            SENDEN<br />
            12 SEITEN
          </v-btn>
          <v-btn
            class="h__button_medium pink darken-3"
            tile
            depressed
            @click="cancel()"
          >
            ABBRECHEN
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'SUCCESS'" :key="'SUCCESS'" class="h__panel">
        <div class="h__single">
          <v-btn
            class="h__button_large green darken-3"
            tile
            depressed
            @click="splash()"
          >
            SENDEN ERFOLGREICH!
          </v-btn>
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
import { get } from "@/logic/service/QueryService";
import { COMMUNICATOR_BACKEND_SHUTDOWN_URL } from "@/logic/function/UrlFunctions";

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

  protected set state(state: State) {
    this.applicationStore.updateCurrentState(state);
  }

  protected start(): void {
    this.state = State.START;
  }

  protected scan(): void {
    this.state = State.LOADING;
    setTimeout(() => {
      this.state = State.CONTINUE;
    }, 5000);
  }

  protected async shutdown(): Promise<void> {
    await get<void>({ url: COMMUNICATOR_BACKEND_SHUTDOWN_URL });
  }

  protected send(): void {
    this.state = State.LOADING;
    setTimeout(() => {
      this.state = State.SUCCESS;
    }, 2000);
  }

  protected cancel(): void {
    this.state = State.SPLASH;
  }

  protected splash(): void {
    this.state = State.SPLASH;
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
  background-color: black;
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
  column-gap: 5px;
}

.h__double {
  padding: 5px;
  flex-grow: 1; // needed to fill container horizontally
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 5px;
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
