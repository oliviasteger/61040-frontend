<script setup lang="ts">
import ProfileListComponent from "../components/Profile/ProfileListComponent.vue";
</script>

<template>
  <main class="column">
    <ProfileListComponent :username="$route.params.username" />
  </main>
</template>
