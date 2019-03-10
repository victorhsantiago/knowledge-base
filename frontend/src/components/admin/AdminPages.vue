<template>
  <div class="admin-pages">
    <app-page-title icon="fa fa-cogs" main="Administração do Sistema" sub="Cadastros & Cia"></app-page-title>
    <div class="admin-pages-tab">
      <md-tabs>
        <md-tab md-label="Artigos">
          <app-article-admin></app-article-admin>
        </md-tab>
        <md-tab md-label="Categorias">
          <app-category-admin></app-category-admin>
        </md-tab>
        <md-tab md-label="Usuários">
          <app-user-admin></app-user-admin>
        </md-tab>
      </md-tabs>
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
