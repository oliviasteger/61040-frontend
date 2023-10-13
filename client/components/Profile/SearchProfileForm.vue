<script setup lang="ts">
import { ref } from "vue";

const user = ref("");
const emit = defineEmits(["getProfileByUser"]);
</script>

<template>
  <form @submit.prevent="emit('getProfileByUser', user)" class="pure-form">
    <fieldset>
      <legend>Search by User</legend>
      <input id="user" type="text" v-model="user" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
