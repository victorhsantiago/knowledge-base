<template>
	<div class="articles-by-category">
		<page-title icon="fa fa-folder-o" :main="category.name" sub="Categoria"/>
		<ul>
			<li v-for="(article, i) in articles" :key="i">
				<article-item :article="article"/>
			</li>
		</ul>
		<div class="load-more">
			<md-button
				class="md-raised"
				@click="getArticles"
				v-if="loadMore"
			>Carregar mais</md-button>
		</div>
	</div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import ArticleItem from "./ArticleItem";

export default {
	name: "ArticlesByCategory",
	components: { pageTitle: PageTitle, articleItem: ArticleItem },
	data: () => ({
		category: {},
		articles: [],
		page: 1,
		loadMore: true
	}),
	methods: {
		getGategory() {
			const url = `${baseApiUrl}/categories/${this.category.id}`;
			axios(url).then(res => (this.category = res.data));
		},
		getArticles() {
			const url = `${baseApiUrl}/categories/${
				this.category.id
			}/articles?page=${this.page}`;
			axios(url).then(res => {
				this.articles = this.articles.concat(res.data);
				this.page++;

				if (res.data.length === 0) this.loadMore = false;
			});
		}
	},
	watch: {
		$route(to) {
			this.category.id = this.$route.params.id;
			this.articles = [];
			this.page = 1;
			this.loadMore = true;

			this.getGategory();
			this.getArticles();
		}
	},
	mounted() {
		this.category.id = this.$route.params.id;
		this.getGategory();
		this.getArticles();
	}
};
</script>

<style scoped>
	.articles-by-category ul {
		list-style-type: none;
		padding: 0;
	}

	.articles-by-category .load-more {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 25px;
	}
</style>
