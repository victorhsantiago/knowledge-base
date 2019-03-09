<template>
	<div class="stats">
		<div class="stats-icon">
			<i :class="icon" :style="style"></i>
		</div>
		<div class="stats-info">
			<span class="stats-title">{{ title }}</span>
			<span class="stats-value">{{ value }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: "Stats",
	props: ["title", "value", "icon", "color"],
	computed: {
		style() {
			return "color: " + (this.color || "#000");
		}
	}
};
</script>

<style scoped>
	.stats {
		flex: 1;
		display: flex;
		border-radius: 8px;
		margin: 10px;
		padding: 20px;
		background-color: #777;
		transition: all 0.5s ease;
		color: #ccc;
	}

	.stats:hover {
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
	}

	.stats-icon {
		display: flex;
		align-items: center;
	}

	.stats-icon i {
		font-size: 5em;
	}

	.stats-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.stats.title {
		font-size: 1.2em;
	}

	.stats-value {
		margin-top: 14px;
		font-size: 3em;
	}
</style>
