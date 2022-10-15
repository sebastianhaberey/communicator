<template>
  <div class="h__root">
    <transition name="h__fade">
      <div v-if="state === 'BUSY'" :key="'LOADING'" class="h__panel">
        <div class="h__centered blue-grey darken-3">
          <HashLoader :size="100" color="#FFFFFF" class="h__loader" />
        </div>
      </div>
      <div v-if="state === 'START'" :key="'START'" class="h__panel">
        <div class="h__double_three_to_one">
          <v-btn
            class="h__button_medium cyan darken-3"
            tile
            depressed
            @click="scanFirstPage()"
          >
            SCANNEN
          </v-btn>
          <v-btn
            class="h__button_medium pink darken-3"
            tile
            depressed
            @click="shutdown()"
          >
            RUNTER<br />
            FAHREN
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'CONTINUE'" :key="'CONTINUE'" class="h__panel">
        <div class="h__triple">
          <v-btn
            class="h__button_medium cyan darken-3"
            tile
            depressed
            @click="scanNextPage()"
          >
            NÄCHSTE<br />
            SEITE<br />
            SCANNEN
          </v-btn>
          <v-btn
            class="h__button_medium lime darken-3"
            tile
            depressed
            @click="wrapUpAndSend()"
          >
            DOKUMENT<br />
            SENDEN<br />
            {{ pageString() }}
          </v-btn>
          <v-btn
            class="h__button_medium pink darken-3"
            tile
            depressed
            @click="cancel()"
          >
            VERWERFEN
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'SUCCESS'" :key="'SUCCESS'" class="h__panel">
        <div class="h__single">
          <v-btn
            class="h__button_large green darken-3"
            tile
            depressed
            @click="start()"
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
import { post } from "@/logic/service/QueryService";
import { SCAN_URL, SHUTDOWN_URL } from "@/logic/function/UrlFunctions";

export enum State {
  BUSY = "BUSY",
  START = "START",
  CONTINUE = "CONTINUE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

function wait(timeout = 3000): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, timeout),
  );
}

@Component({
  components: {
    HashLoader,
  },
})
export default class Home extends Vue {
  state: State = State.START;
  page: number;

  start(): void {
    this.state = State.START;
  }

  protected pageString(): string {
    return this.page > 1 ? `${this.page} SEITEN` : `${this.page} SEITE`;
  }

  protected async scanFirstPage(): Promise<void> {
    this.state = State.BUSY;
    this.page = 1;
    await Home.scan(this.page);
    this.state = State.CONTINUE;
  }

  protected async scanNextPage(): Promise<void> {
    this.state = State.BUSY;
    this.page += 1;
    await Home.scan(this.page);
    this.state = State.CONTINUE;
  }

  protected async shutdown(): Promise<void> {
    await post<void>(SHUTDOWN_URL);
  }

  protected async wrapUpAndSend(): Promise<void> {
    this.state = State.BUSY;
    await Home.wrapUpScanning();
    // TODO trigger sending endpoint
    this.state = State.SUCCESS;
  }

  protected cancel(): void {
    this.state = State.START;
  }

  private static async scan(page: number): Promise<void> {
    await post<void>(SCAN_URL, undefined, { index: page });
    // return wait(3000);
  }

  private static async wrapUpScanning(): Promise<void> {
    await post<void>(SCAN_URL, undefined, { index: -1 });
    // return wait(3000);
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
  padding: 5px;
}

.h__centered {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h__single {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  column-gap: 5px;
}

.h__double {
  flex-grow: 1; // needed to fill container horizontally
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 5px;
}

.h__double_three_to_one {
  flex-grow: 1; // needed to fill container horizontally
  display: grid;
  grid-template-columns: 3fr 1fr;
  column-gap: 5px;
}

.h__triple {
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
