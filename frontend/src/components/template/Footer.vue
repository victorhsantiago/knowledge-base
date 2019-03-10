<template>
  <footer class="footer">
    <span>
      Copyright
      <strong>amparo</strong> ©
    </span>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  grid-area: footer;
  color: #aaa;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
