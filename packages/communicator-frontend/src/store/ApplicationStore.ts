import { Module, Mutation, VuexModule } from "vuex-module-decorators";

export enum State {
  LOADING = "LOADING",
  START = "START",
  CHOICE = "CHOICE",
  ERROR = "ERROR",
}

@Module({ name: "ApplicationStore", namespaced: true })
export class ApplicationStore extends VuexModule {
  currentState: State = State.START;

  @Mutation
  updateCurrentState(queryState: State): void {
    this.currentState = queryState;
  }
}
