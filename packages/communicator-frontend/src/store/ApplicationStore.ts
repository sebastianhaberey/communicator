import { Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ name: "ApplicationStore", namespaced: true })
export class ApplicationStore extends VuexModule {
  drawer = false;

  @Mutation
  updateDrawer(drawer: boolean): void {
    this.drawer = drawer;
  }
}
