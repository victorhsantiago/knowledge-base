<template>
  <div class="page-title">
    <h1>
      <i v-if="icon" :class="icon"></i>
      {{ main }}
    </h1>
    <h2>{{ sub }}</h2>
    <hr>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["icon", "main", "sub"]
};
</script>

<style scoped>
h1 {
  color: #555;
}

.page-title h2 {
  color: #999;
  margin-top: 5px;
  font-size: 1.3em;
}
</style>
