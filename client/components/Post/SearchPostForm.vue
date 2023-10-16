<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByAuthor', author)" class="pure-form">
    <menu class="search">
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </menu>
  </form>
</template>
