<template>
	<div class="article-item">
		<router-link :to="{name: 'articleById', params: { id: article.id }}">
			<div class="article-item-image">
				<img
					v-if="article.imageUrl"
					:src="article.imageUrl"
					height="150"
					width="150"
					alt="Article"
				>
				<img
					v-else
					src="@/assets/article.png"
					height="150"
					width="150"
					alt="Article"
				>
			</div>
			<div class="article-item-info">
				<h2>{{ article.name }}</h2>
				<p>{{ article.description }}</p>
				<span class="article-item-author">
					<strong>Autor:</strong>
					{{ article.author }}
				</span>
			</div>
		</router-link>
	</div>
</template>

<script>
export default {
	name: "ArticleItem",
	props: ["article"]
};
</script>

<style>
	.article-item {
		border-radius: 8px;
		margin-bottom: 20px;
		background-color: #ccc;
		padding: 15px;
		transition: all 0.5s ease;
	}

	.article-item:hover {
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
	}

	.article-item a {
		display: flex;
		align-items: flex-start;
		text-decoration: none !important;
        color: #555 !important;
	}

	.article-item h2 {
		font-size: 1.7em;
	}

	.article-item-image {
		padding-right: 20px;
		margin-right: 20px;
	}

	.article-item-image img {
		border-radius: 5px;
	}

	.article-item-info {
		display: flex;
		align-self: stretch;
		flex-direction: column;
	}

	.article-item-info p {
		flex-grow: 1;
        font-size: 1.1em;
	}
</style>
