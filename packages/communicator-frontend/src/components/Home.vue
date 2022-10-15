<template>
  <div class="h__root">
    <transition name="h__fade">
      <div v-if="state === 'BUSY'" :key="'BUSY'" class="h__panel">
        <div class="h__centered">
          <HashLoader :size="100" color="#FFFFFF" class="h__loader" />
        </div>
      </div>
      <div v-if="state === 'START'" :key="'START'" class="h__panel">
        <div class="h__double_three_to_one">
          <v-btn
            :class="disabledClass"
            class="h__button_medium cyan darken-3"
            tile
            depressed
            @click="scanFirstPage()"
          >
            SCANNEN
          </v-btn>
          <v-btn
            :class="disabledClass"
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
            :class="disabledClass"
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
            :class="disabledClass"
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
            :class="disabledClass"
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
            :class="disabledClass"
            class="h__button_large green darken-3"
            tile
            depressed
            @click="start()"
          >
            SENDEN ERFOLGREICH!
          </v-btn>
        </div>
      </div>
      <div v-if="state === 'ERROR'" :key="'ERROR'" class="h__panel">
        <div class="h__single">
          <v-btn
            :class="disabledClass"
            class="h__button_large red darken-3"
            tile
            depressed
            @click="start()"
          >
            FEHLER
          </v-btn>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { HashLoader } from "@saeris/vue-spinners";
import { query } from "@/logic/service/QueryService";

const BACKEND_URL = "/api";
const SHUTDOWN_URL = BACKEND_URL + "/shutdown";
const SCAN_URL = BACKEND_URL + "/scan";
const SEND_URL = BACKEND_URL + "/send";
const BUTTON_DISABLE_PERIOD = 1000;

export enum State {
  BUSY = "BUSY",
  START = "START",
  CONTINUE = "CONTINUE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

@Component({
  components: {
    HashLoader,
  },
})
export default class Home extends Vue {
  state: State = State.START;
  page: number;
  buttonsDisabled = false;

  start(): void {
    this.protectButtons();
    this.state = State.START;
  }

  protected pageString(): string {
    return this.page > 1 ? `${this.page} SEITEN` : `${this.page} SEITE`;
  }

  protected async scanFirstPage(): Promise<void> {
    this.protectButtons();
    this.state = State.BUSY;
    this.page = 1;
    try {
      await Home.scan(this.page);
      this.state = State.CONTINUE;
    } catch (e) {
      this.state = State.ERROR;
    }
  }

  protected async scanNextPage(): Promise<void> {
    this.protectButtons();
    this.state = State.BUSY;
    this.page += 1;
    try {
      await Home.scan(this.page);
      this.state = State.CONTINUE;
    } catch (e) {
      this.state = State.ERROR;
    }
  }

  protected async shutdown(): Promise<void> {
    this.protectButtons();
    await Home.triggerShutdown();
  }

  protected async wrapUpAndSend(): Promise<void> {
    this.protectButtons();
    this.state = State.BUSY;
    try {
      await Home.finalizeScan();
      await Home.send();
      this.state = State.SUCCESS;
    } catch (e) {
      this.state = State.ERROR;
    }
  }

  protected cancel(): void {
    this.protectButtons();
    this.state = State.START;
  }

  private static async scan(page: number): Promise<void> {
    return query<void>({
      method: "post",
      url: SCAN_URL,
      params: { index: page },
    });
  }

  private static async finalizeScan(): Promise<void> {
    return query<void>({
      method: "post",
      url: SCAN_URL,
      params: { index: -1 },
    });
  }

  private static async send(): Promise<void> {
    return query<void>({ method: "post", url: SEND_URL });
  }

  private static triggerShutdown(): Promise<void> {
    return query<void>({ method: "post", url: SHUTDOWN_URL });
  }

  protected protectButtons(): void {
    this.buttonsDisabled = true;
    setTimeout(() => {
      this.buttonsDisabled = false;
    }, BUTTON_DISABLE_PERIOD);
  }

  protected get disabledClass(): Record<string, unknown> {
    return {
      h__disabled: this.buttonsDisabled,
    };
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

.h__disabled {
  pointer-events: none;
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
