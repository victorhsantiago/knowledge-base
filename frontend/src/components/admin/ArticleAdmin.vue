<template>
  <div class="article-admin">
    <form novalidate class="md-layout">
      <md-card class="md-layout-item md-small-size-100">
        <md-card-content>
          <md-progress-bar md-mode="indeterminate" v-if="sending"/>

          <input type="hidden" id="article-id" v-model="article.id">

          <!-- article information area -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')" md-clearable>
                <label for="article-name">Nome do artigo</label>
                <md-input
                  name="article-name"
                  id="article-name"
                  autocomplete="given-name"
                  v-model="article.name"
                  :disabled="sending || mode === 'remove'"
                />
                <span
                  class="md-error"
                  v-if="!$v.article.name.required"
                >Por favor, informe o nome do artigo</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="path">Descrição</label>
                <md-input
                  name="article-description"
                  id="article-description"
                  autocomplete="given-name"
                  v-model="article.description"
                  :disabled="sending || mode === 'remove'"
                />
                <span
                  class="md-error"
                  v-if="!$v.article.description.required"
                >Por favor, informe a descrição do artigo</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="path">Imagem URL</label>
                <md-input
                  name="article-imageUrl"
                  id="article-imageUrl"
                  autocomplete="given-name"
                  v-model="article.imageUrl"
                  :disabled="sending || mode === 'remove'"
                />
              </md-field>
            </div>
          </div>

          <!-- listagem de categorias -->
          <div v-if="mode === 'save'">
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="path">Categoria</label>
                  <md-select v-model="article.categoryId" name="path" id="article-category">
                    <md-option
                      v-for="(c, index) in categories"
                      :key="index"
                      :value="c.id"
                      :disabled="mode === 'remove'"
                    >{{ c.path }}</md-option>
                  </md-select>
                </md-field>
              </div>
            </div>

            <!-- listagem de usuários -->
            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="path">Autor</label>
                  <md-select v-model="article.userId" name="path" id="article-user">
                    <md-option
                      v-for="(u, index) in users"
                      :key="index"
                      :value="u.id"
                      :disabled="mode === 'remove'"
                    >{{ u.user }}</md-option>
                  </md-select>
                </md-field>
              </div>
            </div>
          </div>

          <!-- Editor de texto -->
          <div class="md-layout-item">
            <vue-editor v-model="article.content" placeholder="Era uma vez..."></vue-editor>
          </div>

          <!-- Action buttons -->
          <md-card-actions>
            <md-button
              type="submit"
              class="md-primary md-raised"
              :disabled="sending"
              @click.prevent="saveArticle"
              v-if="mode === 'save'"
            >Salvar artigo</md-button>
            <md-button
              type="submit"
              class="md-accent md-raised"
              :disabled="sending"
              @click.prevent="remove"
              v-if="mode === 'remove'"
            >Remover artigo</md-button>
            <md-button type="submit" :disabled="sending" @click.prevent="clearForm">Cancelar</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </form>

    <!-- Tabela de artigos -->
    <md-table v-model="articles" md-sort="name" md-sort-order="asc" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Descrição" md-sort-by="description">{{ item.description }}</md-table-cell>

        <md-table-cell md-label="Ações">
          <template>
            <md-button
              class="md-icon-button md-raised md-primary md-dense"
              @click="loadArticle(item)"
            >
              <i class="fa fa-pencil"></i>
            </md-button>
            <md-button
              class="md-icon-button md-raised md-accent md-dense"
              @click="loadArticle(item,'remove')"
            >
              <i class="fa fa-trash"></i>
            </md-button>
          </template>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit"/>
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
    sending: false
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
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

.ql-snow {
  background-color: #ddd;
  color: darkslategray;
}
</style>
