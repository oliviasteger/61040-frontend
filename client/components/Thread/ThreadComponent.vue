<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["thread"]);
const emit = defineEmits(["editThread", "refreshThreads"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteThread = async () => {
  try {
    await fetchy(`api/threads/${props.thread._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshThreads");
};
</script>

<template>
  <div class="thread">
    <p class="author">
      <router-link :to="{ name: 'Profile', params: { username: props.thread.user } }">{{ props.thread.user }}</router-link>
    </p>
    <p>{{ props.thread.content }}</p>
    <div class="base">
      <menu v-if="props.thread.user == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editThread', props.thread._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deleteThread">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.thread.dateCreated !== props.thread.dateUpdated">Edited on: {{ formatDate(props.thread.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.thread.dateCreated) }}</p>
      </article>
    </div>
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

.thread {
  background-color: #fff;
  padding: 1em;
  border-radius: 1em;
  margin-bottom: 1em;
}
</style>
