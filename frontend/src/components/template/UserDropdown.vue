<template>
	<div class="user-dropdown">
		<div class="user-button">
			<span class="d-none d-sm-block">{{user.name}}</span>
			<div class="user-dropdown-img">
				<Gravatar :email="user.email" alt="User avatar"/>
			</div>
			<i class="fa fa-angle-down"></i>
		</div>
		<div class="user-dropdown-itens">
			<router-link to="/admin">
				<i class="fa fa-cogs"></i> Administração
			</router-link>
			<a href @click.prevent="logOut">
				<i class="fa fa-sign-out"></i> Sair
			</a>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";
import Gravatar from "vue-gravatar";

export default {
	name: "UserDropdown",
	components: { Gravatar },
	computed: mapState(["user"]),
	methods: {
		logOut() {
			localStorage.removeItem(userKey);
			this.$store.commit("setUser", null);
			this.$router.push({ name: "auth" });
		}
	}
};
</script>

<style scoped>
	.user-dropdown {
		position: relative;
		height: 100%;
	}

	.user-button {
		display: flex;
		align-items: center;
		color: #fff;
		font-weight: 100;
		height: 100%;
		padding: 0 20px;
	}

	.user-dropdown:hover {
		background-color: rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.user-dropdown-img {
		margin: 0 10px;
		border: 4px solid rgba(0, 0, 0, 0.2);
		border-radius: 9px;
	}

	.user-dropdown-img > img {
		max-height: 37px;
		border-radius: 5px;
	}

	.user-dropdown-itens {
		position: absolute;
		right: 0;
		border-radius: 0 0 0 5px;
		min-width: 170px;
		box-shadow: 0 8px 16px 0px rgba(0, 0, 0, 0.3);
		padding: 10px;
		z-index: 1;

		display: flex;
		flex-direction: column;
		flex-wrap: wrap;

		visibility: hidden;
		opacity: 0;
		transition: visibility 0.2s, opacity 0.5s linear;
	}

	.user-dropdown:hover .user-dropdown-itens {
		visibility: visible;
		opacity: 1;
	}

	.user-dropdown-itens > a {
		text-decoration: none;
		padding: 10px;
		transition: all 0.4s;
	}

	.user-dropdown-itens > a > i {
		margin-right: 15px;
	}

	.user-dropdown-itens > a:hover {
		background-color: rgba(0, 0, 0, 0.1);
		text-decoration: none;
	}
</style>
