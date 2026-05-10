<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div class="watermark-grid"></div>
  </div>
</template>

<style scoped>
.watermark-grid {
  position: absolute;
  inset: -50%; /* extend keluar viewport */

  background-image: url("/assets/img/100px.png");
  background-repeat: repeat;
  background-size: 150px 150px;

  opacity: 0.025;
  transform: rotate(-45deg);
}

.dark .watermark-grid {
  filter: brightness(0) invert(1);
  opacity: 0.03;
}
</style>