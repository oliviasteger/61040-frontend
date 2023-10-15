<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const recap = ref<Record<string, string>>({});

const getRecap = async () => {
  try {
    recap.value = await fetchy(`/api/recaps`, "POST");
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getRecap();
  loaded.value = true;
});
</script>

<template>
  <article v-if="loaded">
    <h3>Monthly recap</h3>
    <p>
      ✉️ You had <b>{{ recap.numPost }} {{ recap.numPost == "1" ? "post" : "posts" }}</b> this month!
    </p>
    <p>
      💬 You wrote <b> {{ recap.numThread }} {{ recap.numThread == "1" ? "comment" : "comments" }}</b> this month!
    </p>
    <p>
      🙂 You're on a roll with <b> {{ recap.numReaction }} {{ recap.numReaction == "1" ? "reaction" : "reactions" }}</b> this month!
    </p>
    <p>
      👥 You've interacted with
      <span v-for="(n, i) in recap.mostInteractedWith" :key="i">
        <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
        <span v-if="i < recap.mostInteractedWith.length - 2">, </span>
        <span v-else-if="i == recap.mostInteractedWith.length - 1 && recap.mostInteractedWith.length != 1">, and</span>
        <span v-else></span>
      </span>
      the most this month!
    </p>
    <p>
      👥 You haven't interacted with
      <span v-for="(n, i) in recap.leastInteractedWith" :key="i">
        <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
        <span v-if="i < recap.leastInteractedWith.length - 2">, </span>
        <span v-else-if="i == recap.leastInteractedWith.length - 1 && recap.mostInteractedWith.length != 1">, and</span>
        <span v-else></span>
      </span>
      much this month. Maybe it's time to reach out. Look out for activity suggestion announcements, and invite them to do something!
    </p>
  </article>
</template>
