<template>
  <div class="auth-content">
    <div class="auth-modal">
      <md-progress-bar md-mode="indeterminate" v-if="sending"/>

      <img src="@/assets/logo.png" alt="Logo amparo" width="200">

      <div class="auth-title">{{ showSignup ? 'Cadastro' : 'Login' }}</div>

      <md-field md-clearable v-if="showSignup">
        <label>Nome</label>
        <md-input v-model="user.name"/>
      </md-field>
      <md-field md-clearable>
        <label>E-mail</label>
        <md-input v-model="user.email" name="email"/>
      </md-field>
      <md-field>
        <label>Senha</label>
        <md-input
          type="password"
          v-model="user.password"
          name="password"
          v-on:keyup.enter="signIn"
        />
      </md-field>
      <md-field v-if="showSignup">
        <label>Confirme a senha</label>
        <md-input type="password" v-model="user.confirmPassword" v-on:keyup.enter="signUp"/>
      </md-field>

      <md-button
        v-if="!showSignup"
        class="md-primary md-raised"
        :disabled="sending"
        @click="signIn"
      >Entrar</md-button>
      <md-button v-else class="md-primary md-raised" :disabled="sending" @click="signUp">Cadastrar</md-button>

      <a href @click.prevent="showSignup = !showSignup">
        <span v-if="showSignup">Já tem cadastro? Acess o Login</span>
        <span v-else>Não tem cadastro? Registre-se aqui</span>
      </a>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Auth",
  data() {
    return {
      sending: false,
      showSignup: false,
      user: {}
    };
  },
  methods: {
    signIn() {
      this.sending = true;
      axios
        .post(`${baseApiUrl}/signin`, this.user)
        .then(res => {
          this.$store.commit("setUser", res.data); //setar usuário na aplicação
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.sending = false;
        })
        .then(this.$router.push({ path: "/home" }))
        .catch(showError);
    },
    signUp() {
      axios
        .post(`${baseApiUrl}/signin`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.user = {};
          this.showSignup = false;
        })
        .catch(showError);
    }
  }
};
</script>


<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-modal {
  width: 350px;
  padding: 35px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-title {
  font-size: 1.2em;
  font-weight: 100;
  margin-top: 25px;
}

.auth-modal a {
  margin-top: 25px;
}
</style>
