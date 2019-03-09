<template>
	<header class="header">
		<button
			v-if="!hideToggle"
			class="hamburger hamburger--arrowturn"
			type="button"
			:class="icon"
			@click="toggleMenu"
		>
			<span class="hamburger-box">
				<span class="hamburger-inner"></span>
			</span>
		</button>
		<div class="logo">
			<router-link to="/" class="link">
				<img src="@/assets/logo-white.png">
			</router-link>
		</div>
		<app-user-dropdown v-if="!hideUserDropdown"></app-user-dropdown>
	</header>
</template>

<script>
import UserDropdown from "./UserDropdown";

export default {
	name: "Header",
	components: { appUserDropdown: UserDropdown },
	props: {
		title: String,
		hideToggle: Boolean,
		hideUserDropdown: Boolean
	},
	computed: {
		icon() {
			return this.$store.state.isMenuVisible ? "is-active" : "";
		}
	},
	methods: {
		toggleMenu() {
			this.$store.commit("toggleMenu");
		}
	}
};
</script>

<style scoped>
	.header {
		grid-area: header;
		background: linear-gradient(to left, #63a4ff, #1976d2);

		display: flex;
		justify-content: center;
		align-items: center;

		z-index: 1;
	}

	.logo {
		flex-grow: 1;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.link {
		height: 70%;
	}

	.link > img {
		height: 100%;
		width: auto;
	}
</style>
