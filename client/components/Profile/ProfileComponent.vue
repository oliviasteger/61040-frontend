<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["profile"]);
const emit = defineEmits(["editProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <p class="username">{{ props.profile.user }}</p>
  <p>Display name: {{ props.profile.name }}</p>
  <p>Display details: {{ props.profile.details }}</p>
  <div class="base">
    <menu v-if="props.profile.user == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editProfile', props.profile._id)">Edit</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.profile.dateCreated !== props.profile.dateUpdated">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.profile.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
