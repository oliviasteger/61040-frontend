<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const announcement = ref();

const loaded = ref(false);
const getAnnouncement = async () => {
  try {
    announcement.value = await fetchy(`/api/announcements`, "GET");
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getAnnouncement();
  loaded.value = true;
});
</script>

<template>
  <article v-if="loaded">
    <p>{{ announcement.body }}</p>
  </article>
</template>
