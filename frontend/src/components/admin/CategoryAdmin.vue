<template>
  <div class="category-admin">
    <form novalidate class="md-layout">
      <md-card class="md-layout-item md-small-size-100">
        <md-card-content>
          <input type="hidden" id="category-id" v-model="category.id">

          <!-- category information area -->
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('name')" md-clearable>
                <label for="category-name">Nome da categoria</label>
                <md-input
                  name="category-name"
                  id="category-name"
                  autocomplete="given-name"
                  v-model="category.name"
                  :disabled="sending || mode === 'remove'"
                />
                <span
                  class="md-error"
                  v-if="!$v.category.name.required"
                >Por favor, informe o nome da categoria</span>
              </md-field>
            </div>
          </div>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label for="path">Caminho</label>
                <md-select v-model="category.parentId" name="path" id="category-parentId">
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

          <!-- Action buttons -->
          <md-card-actions>
            <md-button
              type="submit"
              class="md-primary md-raised"
              :disabled="sending"
              @click.prevent="validateCategory"
              v-if="mode === 'save'"
            >Salvar categoria</md-button>
            <md-button
              type="submit"
              class="md-accent md-raised"
              :disabled="sending"
              @click.prevent="remove"
              v-if="mode === 'remove'"
            >Remover categoria</md-button>
            <md-button type="submit" :disabled="sending" @click.prevent="clearForm">Cancelar</md-button>
          </md-card-actions>

          <md-progress-bar md-mode="indeterminate" v-if="sending"/>
        </md-card-content>
      </md-card>
    </form>

    <!-- category table -->
    <md-table v-model="categories" md-sort="path" md-sort-order="asc" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Caminho" md-sort-by="path">{{ item.path }}</md-table-cell>
        <md-table-cell md-label="Ações">
          <template>
            <md-button
              class="md-icon-button md-raised md-primary md-dense"
              @click="loadCategory(item)"
            >
              <i class="fa fa-pencil"></i>
            </md-button>
            <md-button
              class="md-icon-button md-raised md-accent md-dense"
              @click="loadCategory(item,'remove')"
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
import { required } from "vuelidate/lib/validators";

export default {
  name: "CategoryAdmin",
  mixins: [validationMixin],
  data: () => ({
    mode: "save",
    category: {},
    categories: [],
    sending: false
  }),
  methods: {
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios.get(url).then(res => {
        // this.categories = res.data;
        this.categories = res.data.map(category => {
          return {
            ...category,
            value: category.id,
            text: category.path
          };
        });
      });
    },
    validateCategory() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveCategory();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.category[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.mode = "save";
      this.category = {};
    },
    saveCategory() {
      this.sending = true;
      const method = this.category.id ? "put" : "post";
      const id = this.category.id ? `/${this.category.id}` : "";

      axios[method](`${baseApiUrl}/categories${id}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadCategories();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    remove() {
      this.sending = true;
      const id = this.category.id;
      axios
        .delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.sending = false;
          this.clearForm();
          this.loadCategories();
        })
        .catch(showError)
        .then(() => {
          this.sending = false;
        });
    },
    loadCategory(category, mode = "save") {
      this.mode = mode;
      this.category = { ...category };
      this.category.parentId = category.parentId;
    }
  },
  mounted() {
    this.loadCategories();
  },
  validations: {
    category: {
      name: {
        required
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
