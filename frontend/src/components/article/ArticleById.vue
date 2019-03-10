<template>
  <div class="article-by-id">
    <page-title icon="fa fa-folder-o" :main="article.name" :sub="article.description"/>
    <div class="article-content" v-html="article.content"></div>
  </div>
</template>

<script>
import "highlightjs/styles/dracula.css";
import hljs from "highlightjs/highlight.pack.js";
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "ArticleById",
  components: { pageTitle: PageTitle },
  data: () => ({
    article: {}
  }),
  mounted() {
    const url = `${baseApiUrl}/articles/${this.$route.params.id}`;
    axios(url).then(res => (this.article = res.data));
  },
  updated() {
    document.querySelectorAll(".article-content pre").forEach(e => {
      hljs.highlightBlock(e);
    });
  }
};
</script>

<style>
.article-content {
  border-radius: 8px;
  padding: 20px;
}

.article-content pre {
  padding: 10px;
  border-radius: 8px;
  background-color: #1e1e1e;
  color: #ccc;
}

.article-content img {
  max-width: 100%;
}

.article-content :last-child {
  margin-bottom: 8px;
}
</style>
