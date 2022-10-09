import { Module, Mutation, VuexModule } from "vuex-module-decorators";

export enum State {
  LOADING = "LOADING",
  SPLASH = "SPLASH",
  START = "START",
  CONTINUE = "CONTINUE",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

@Module({ name: "ApplicationStore", namespaced: true })
export class ApplicationStore extends VuexModule {
  currentState: State = State.SPLASH;

  @Mutation
  updateCurrentState(queryState: State): void {
    this.currentState = queryState;
  }
}
