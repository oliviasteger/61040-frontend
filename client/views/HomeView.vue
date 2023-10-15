<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="!isLoggedIn" style="text-align: center">Please log in to access posts!</h1>
    </section>
    <PostListComponent />
  </main>
</template>
