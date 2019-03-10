<template>
  <div class="home">
    <app-page-title icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento"></app-page-title>
    <div class="stats">
      <app-stats title="Categorias" :value="stats.categories" icon="fa fa-folder" color="#d54d50"></app-stats>
      <app-stats title="Artigos" :value="stats.articles" icon="fa fa-file" color="#3bc480"></app-stats>
      <app-stats title="Usuários" :value="stats.users" icon="fa fa-user" color="#3282cd"></app-stats>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Stats from "./Stats";
import axios from "axios";
import { baseApiUrl } from "@/global";

export default {
  name: "Home",
  components: { appPageTitle: PageTitle, appStats: Stats },
  data() {
    return {
      stats: {}
    };
  },
  methods: {
    getStats() {
      axios.get(`${baseApiUrl}/stats`).then(res => (this.stats = res.data));
    }
  },
  mounted() {
    this.getStats();
  }
};
</script>

<style scoped>
.stats {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
