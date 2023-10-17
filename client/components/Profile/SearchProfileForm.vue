<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";

const props = defineProps(["username"]);
const username = ref(props.username);

const redirect = async () => {
  void router.push({ name: "Profile", params: { username: username.value } });
};
</script>

<template>
  <form @submit.prevent="redirect()" class="pure-form">
    <menu class="search">
      <input type="text" v-model="username" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </menu>
  </form>
</template>
