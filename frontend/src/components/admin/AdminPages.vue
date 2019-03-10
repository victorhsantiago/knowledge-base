<template>
  <div class="admin-pages">
    <app-page-title icon="fa fa-cogs" main="Administração do Sistema" sub="Cadastros & Cia"></app-page-title>
    <div class="admin-pages-tab">
      <v-tabs slider-color="yellow">
        <v-tab ripple>Artigos</v-tab>
        <v-tab-item>
          <app-article-admin/>
        </v-tab-item>
        <v-tab ripple>Categorias</v-tab>
        <v-tab-item>
          <app-category-admin/>
        </v-tab-item>
        <v-tab ripple>Usuários</v-tab>
        <v-tab-item>
          <app-user-admin/>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import ArticleAdmin from "./ArticleAdmin";
import CategoryAdmin from "./CategoryAdmin";
import UserAdmin from "./UserAdmin";

export default {
  name: "AdminPages",
  components: {
    appPageTitle: PageTitle,
    appArticleAdmin: ArticleAdmin,
    appCategoryAdmin: CategoryAdmin,
    appUserAdmin: UserAdmin
  }
};
</script>

<style>
</style>
