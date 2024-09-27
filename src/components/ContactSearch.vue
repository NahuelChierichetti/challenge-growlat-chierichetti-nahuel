<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
const text = ref(null);
</script>

<template>
  <div class="card flex p-4 py-[17px] border-r border-gray-200 hidden lg:flex">
      <InputText v-model="text" type="text" size="large" placeholder="Buscar contacto por nombre o teléfono" class="w-[100%]" />
  </div>
</template>

<style scoped>

</style>