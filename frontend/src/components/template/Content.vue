<template>
  <div class="content">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Content"
};
</script>

<style scoped>
.fade-enter-active {
  transition: all 0.2s ease;
}
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.content {
  grid-area: content;
  padding: 20px;
}
</style>
