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
    <h3>Activity recap</h3>
    <div class="horizontal cards">
      <div class="card">
        <p>✉️</p>
        <b class="statistic">{{ recap.numPost }} {{ recap.numPost == "1" ? "post" : "posts" }}</b>
        <p>this month</p>
      </div>
      <div class="card">
        <p>💬</p>
        <b class="statistic">{{ recap.numThread }} {{ recap.numThread == "1" ? "comment" : "comments" }}</b>
        <p>this month</p>
      </div>

      <div class="card">
        <p>🙂</p>
        <b class="statistic">{{ recap.numReaction }} {{ recap.numReaction == "1" ? "reaction" : "reactions" }}</b>
        <p>this month</p>
      </div>
    </div>
    <div class="vertical cards">
      <div class="card" v-if="recap.mostInteractedWith.length > 0">
        👥 &nbsp; You've interacted with
        <span v-for="(n, i) in recap.mostInteractedWith" :key="i">
          <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
          <span v-if="i < recap.mostInteractedWith.length - 2">, </span>
          <span v-else-if="i == recap.mostInteractedWith.length - 2 && recap.mostInteractedWith.length != 2">, and</span>
          <span v-else-if="i == recap.mostInteractedWith.length - 2 && recap.mostInteractedWith.length == 2"> and </span>
        </span>
        the most this month!
      </div>
      <div class="card" v-if="recap.leastInteractedWith.length > 0">
        👥 &nbsp; You haven't interacted with
        <span v-for="(n, i) in recap.leastInteractedWith" :key="i">
          <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
          <span v-if="i < recap.leastInteractedWith.length - 2">, </span>
          <span v-else-if="i == recap.leastInteractedWith.length - 2 && recap.leastInteractedWith.length != 2">, or </span>
          <span v-else-if="i == recap.leastInteractedWith.length - 2 && recap.leastInteractedWith.length == 2"> or </span>
        </span>
        much this month. Maybe it's time to reach out. Look out for activity suggestion announcements, and invite them to do something!
      </div>
      <div class="card" v-else-if="recap.mostInteractedWith.length == 0 && recap.leastInteractedWith.length == 0">👥 &nbsp; <span>Interact with more users to get a recap on interactions!</span></div>
    </div>
  </article>
</template>
