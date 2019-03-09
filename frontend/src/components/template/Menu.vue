<template>
	<aside class="menu" v-show="isMenuVisible">
		<div class="menu-filter">
			<md-field md-clearable>
				<label for="category-name">
					<i class="fa fa-search"></i>
				</label>
				<md-input v-model="treeFilter"/>
			</md-field>
		</div>
		<menu-tree
			:data="treeData"
			:options="treeOptions"
			:filter="treeFilter"
			ref="tree"
		/>
	</aside>
</template>

<script>
import { mapState } from "vuex";
import Tree from "liquor-tree";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
	name: "Menu",
	components: { menuTree: Tree },
	computed: mapState(["isMenuVisible"]),
	data() {
		return {
			treeFilter: "",
			treeData: this.getTreeData(),
			treeOptions: {
				propertyNames: { text: "name" },
				filter: { emptyText: "Categoria não encontrada" }
			}
		};
	},
	methods: {
		getTreeData() {
			const url = `${baseApiUrl}/categories/tree`;
			return axios.get(url).then(res => res.data);
		},
		onNodeSelect(node) {
			this.$router.push({
				name: "articlesByCategory",
				params: { id: node.id }
			});
		}
	},
	mounted() {
		this.$refs.tree.$on("node:selected", this.onNodeSelect);
	}
};
</script>

<style>
	aside {
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
	}
	.hide-menu {
		display: none;
	}

	.menu {
		grid-area: menu;
		background: linear-gradient(to left, #fff, #eee);

		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}

	.menu a,
	.menu a:hover {
		text-decoration: none !important;
		color: #333 !important;
	}

	.menu-filter {
		padding-right: 10px;
		padding-left: 10px;
	}

	.tree-filter-empty {
		color: #333;
		margin-left: 10px;
	}
</style>
