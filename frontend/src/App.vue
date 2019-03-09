<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user }">
		<app-header
			title="amparo - Base de conhecimento"
			:hideToggle="!user"
			:hideUserDropdown="!user"
		></app-header>
		<app-menu v-if="user"></app-menu>
		<app-content></app-content>
		<app-footer></app-footer>
	</div>
</template>

<script>
import { mapState } from "vuex";
import Header from "@/components/template/Header";
import Menu from "@/components/template/Menu";
import Content from "@/components/template/Content";
import Footer from "@/components/template/Footer";

export default {
	name: "App",
	components: {
		appHeader: Header,
		appMenu: Menu,
		appContent: Content,
		appFooter: Footer
	},
	computed: mapState(["isMenuVisible", "user"]),
	data() {
		return {
			validatingToken: true
		};
	},
	methods: {
		// async validateToken() {
		// 	this.validatingToken = true;

		// 	const json = localStorage.getItem(userKey);
		// 	const userData = JSON.parse(json);
		// 	this.$store.commit("setUser", null);

		// 	if (!userData) {
		// 		this.validatingToken = false;
		// 		this.$router.push({ name: "auth" });
		// 		return;
		// 	}

		// 	const res = await axios.post(
		// 		`${baseApiUrl}/validateToken`,
		// 		userData
		// 	);

		// 	if (res.data) {
		// 		this.$store.commit("setUser", userData);
		// 	} else {
		// 	}
		// }
	}
};
</script>

<style>
	* {
		font-family: Roboto, sans-serif;
		box-sizing: border-box;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 250px 1fr;
		grid-template-areas:
			"header header"
			"menu content"
			"menu footer";
	}

	#app.hide-menu {
		grid-template-areas:
			"header header"
			"content content"
			"footer footer";
	}
</style>