<template>
  <div>
    <v-form>
      <input type="hidden" id="article-id" v-model="article.id">
      <v-card-text>
        <v-progress-linear :indeterminate="true" v-if="sending"></v-progress-linear>
        <!-- article information area -->
        <v-text-field
          name="article-name"
          id="article-name"
          autocomplete="given-name"
          label="Nome do artigo"
          v-model="article.name"
          maxlength="20"
          :disabled="sending || mode === 'remove'"
          :rules="[rules.required]"
          clearable
        ></v-text-field>

        <v-text-field
          label="Descrição"
          name="article-description"
          id="article-description"
          autocomplete="given-name"
          v-model="article.description"
          maxlength="60"
          :disabled="sending || mode === 'remove'"
          :rules="[rules.required]"
          clearable
        ></v-text-field>

        <v-text-field
          name="article-imageUrl"
          id="article-imageUrl"
          autocomplete="given-name"
          label="Imagem URL"
          v-model="article.imageUrl"
          :disabled="sending || mode === 'remove'"
          clearable
        />

        <!-- listagem de categorias -->
        <div v-if="mode === 'save'">
          <v-select
            label="Categoria"
            v-model="article.categoryId"
            :items="categories"
            item-text="path"
            item-value="id"
            :disabled="mode === 'remove'"
          ></v-select>
          <!-- listagem de usuários -->
          <v-select
            label="Usuário"
            v-model="article.userId"
            :items="users"
            item-text="user"
            item-value="id"
            :disabled="mode === 'remove'"
          ></v-select>
        </div>

        <!-- Editor de texto -->
        <div class="md-layout-item">
          <vue-editor v-model="article.content" placeholder="Era uma vez..."></vue-editor>
        </div>
      </v-card-text>
      <!-- Action buttons -->
      <v-card-actions>
        <v-btn
          type="submit"
          primary
          raised
          :disabled="sending"
          @click.prevent="saveArticle"
          v-if="mode === 'save'"
        >Salvar artigo</v-btn>
        <v-btn
          type="submit"
          accent
          raised
          :disabled="sending"
          @click.prevent="remove"
          v-if="mode === 'remove'"
        >Remover artigo</v-btn>
        <v-btn type="submit" flat secondary :disabled="sending" @click.prevent="clearForm">Cancelar</v-btn>
      </v-card-actions>
    </v-form>

    <!-- Tabela de artigos -->
    <v-data-table :headers="headers" :items="articles" v-model="articles">
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.description }}</td>
        <td>
          <template>
            <v-btn class="md-icon-button md-raised md-primary md-dense" @click="loadArticle(props)">
              <i class="fa fa-pencil"></i>
            </v-btn>
            <v-btn
              class="md-icon-button md-raised md-accent md-dense"
              @click="loadArticle(item, 'remove')"
            >
              <i class="fa fa-trash"></i>
            </v-btn>
          </template>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/global";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { VueEditor } from "vue2-editor";

export default {
  name: "ArticleAdmin",
  components: { vueEditor: VueEditor },
  mixins: [validationMixin],
  data: () => ({
    mode: "save",
    article: {},
    articles: [],
    categories: [],
    users: [],
    page: 1,
    limit: 0,
    count: 0,
    sending: false,
    rules: {
      required: value => !!value || "Por favor, preencha este campo.",
      counter: value => value.length <= 20 || "Limite de 20 caractéres"
    },
    headers: [
      { text: "Nome", value: "name" },
      { text: "Descrição", value: "description" },
      { text: "Ações" }
    ]
  }),
  methods: {
    loadArticles() {
      const url = `${baseApiUrl}/articles?page=${this.page}`;
      axios.get(url).then(res => {
        this.articles = res.data.data;
        this.count = res.data.count;
        this.limit = res.data.limit;
      });
    },
    validateArticle() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveArticle();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.article[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.mode = "save";
      this.article = {};
    },
    saveArticle() {
      this.sending = true;
      const method = this.article.id ? "put" : "post";
      const id = this.article.id ? `/${this.article.id}` : "";

      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadArticles();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    remove() {
      this.sending = true;
      const id = this.article.id;
      axios
        .delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadArticles();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    loadArticle(article, mode = "save") {
      this.mode = mode;
      axios
        .get(`${baseApiUrl}/articles/${article.id}`)
        .then(res => (this.article = res.data));
    },
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios.get(url).then(res => {
        this.categories = res.data.map(category => {
          return { id: category.id, path: category.path };
        });
      });
    },
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data.map(user => {
          return {
            id: user.id,
            user: `${user.name} - ${user.email}`
          };
        });
      });
    }
  },
  mounted() {
    this.loadUsers();
    this.loadCategories();
    this.loadArticles();
  },
  watch: {
    page() {
      this.loadArticles();
    }
  },
  validations: {
    article: {
      name: {
        required
      },
      description: {
        required
      }
    }
  }
};
</script>

<style>
.ql-snow {
  background-color: #ddd;
  color: darkslategray;
}
</style>
