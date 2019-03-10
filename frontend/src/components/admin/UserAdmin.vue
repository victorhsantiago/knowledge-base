<template>
  <div class="user-admin">
    <form novalidate class="md-layout">
      <md-card class="md-layout-item md-small-size-100">
        <md-card-content>
          <input type="hidden" id="user-id" v-model="user.id">

          <!-- User information area -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')" md-clearable>
                <label for="user-name">Nome...</label>
                <md-input
                  name="user-name"
                  id="user-name"
                  autocomplete="given-name"
                  v-model="user.name"
                  :disabled="sending || mode === 'remove'"
                />
                <span
                  class="md-error"
                  v-if="!$v.user.name.required"
                >Por favor, informe o nome do usuário</span>
                <span class="md-error" v-else-if="!$v.user.name.minlength">Nome inválido</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('email')" md-clearable>
                <label for="user-email">Email...</label>
                <md-input
                  type="email"
                  name="user-email"
                  id="user-email"
                  v-model="user.email"
                  :disabled="sending || mode === 'remove'"
                />
                <span
                  class="md-error"
                  v-if="!$v.user.email.required"
                >Por favor, informe o email do usuário.</span>
                <span class="md-error" v-else-if="!$v.user.email.email">Email inválido</span>
              </md-field>
            </div>
          </div>

          <!-- Password confimation area -->
          <div class="md-layout md-gutter" v-if="mode === 'save'">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('password')">
                <label for="user-password">Senha...</label>
                <md-input
                  name="user-password"
                  id="user-password"
                  v-model="user.password"
                  :disabled="sending"
                  type="password"
                />
                <span
                  class="md-error"
                  v-if="!$v.user.password.required"
                >Por favor, informe a senha do usuário.</span>
                <span class="md-error" v-else-if="!$v.user.password.minlength">Senha inválida.</span>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('confirmPassword')">
                <label for="user-confirm-password">Confirme a senha...</label>
                <md-input
                  type="password"
                  name="user-confirm-password"
                  id="user-confirm-password"
                  v-model="user.confirmPassword"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.user.confirmPassword.required"
                >Por favor, confirme a senha.</span>
                <span
                  class="md-error"
                  v-else-if="!$v.user.confirmPassword.minlength"
                >Confirmação inválida.</span>
              </md-field>
            </div>
          </div>

          <!-- Action buttons -->
          <md-card-actions>
            <div class="input" v-show="mode === 'save'">
              <md-checkbox
                id="user-admin"
                v-model="user.admin"
                class="md-primary"
                :disabled="sending"
              >Administrador?</md-checkbox>
            </div>
            <md-button
              type="submit"
              class="md-primary md-raised"
              :disabled="sending"
              @click.prevent="validateUser"
              v-if="mode === 'save'"
            >Salvar usuário</md-button>
            <md-button
              type="submit"
              class="md-accent md-raised"
              :disabled="sending"
              @click.prevent="remove"
              v-if="mode === 'remove'"
            >Remover usuário</md-button>
            <md-button type="submit" :disabled="sending" @click.prevent="clearForm">Cancelar</md-button>
          </md-card-actions>

          <md-progress-bar md-mode="indeterminate" v-if="sending"/>
        </md-card-content>
      </md-card>
    </form>

    <!-- User table -->
    <md-table v-model="users" md-sort="name" md-sort-order="asc" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="email">{{ item.email }}</md-table-cell>
        <md-table-cell md-label="Admin" md-sort-by="admin">{{ item.admin }}</md-table-cell>
        <md-table-cell md-label="Ações">
          <template>
            <md-button class="md-icon-button md-raised md-primary md-dense" @click="loadUser(item)">
              <i class="fa fa-pencil"></i>
            </md-button>
            <md-button
              class="md-icon-button md-raised md-accent md-dense"
              @click="loadUser(item,'remove')"
            >
              <i class="fa fa-trash"></i>
            </md-button>
          </template>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/global";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "UserAdmin",
  mixins: [validationMixin],
  data: () => ({
    mode: "save",
    user: {},
    users: [],
    sending: false
  }),
  methods: {
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
      });
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.user[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.mode = "save";
      this.user.id = "";
      this.user.name = null;
      this.user.email = null;
      this.user.password = null;
      this.user.confirmPassword = null;
      this.user.admin = null;
    },
    saveUser() {
      this.sending = true;
      const method = this.user.id ? "put" : "post";
      const id = this.user.id ? `/${this.user.id}` : "";

      axios[method](`${baseApiUrl}/users${id}`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadUsers();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    remove() {
      this.sending = true;
      const id = this.user.id;
      axios
        .delete(`${baseApiUrl}/users/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadUsers();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    loadUser(user, mode = "save") {
      this.mode = mode;
      this.user = { ...user };
    }
  },
  mounted() {
    this.loadUsers();
  },
  validations: {
    user: {
      name: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      },
      confirmPassword: {
        required,
        minLength: minLength(3)
      }
    }
  }
};
</script>

<style scoped>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.input {
  padding-left: 16px;
}
</style>
