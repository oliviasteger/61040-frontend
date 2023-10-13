<script setup lang="ts">
import ProfileWrapperComponent from "../components/Profile/ProfileWrapperComponent.vue";
</script>

<template>
  <main class="column">
    <ProfileWrapperComponent :username="$route.params.username" />
  </main>
</template>
