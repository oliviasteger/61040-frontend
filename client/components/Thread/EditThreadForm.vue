<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["thread"]);
const text = ref(props.thread.content);
const emit = defineEmits(["editThread", "refreshThreads"]);

const editThread = async (content: string) => {
  try {
    await fetchy(`/api/threads/${props.thread._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }

  emit("editThread");
  emit("refreshThreads");
};
</script>

<template>
  <form @submit.prevent="editThread(text)">
    <span class="author">
      <router-link :to="{ name: 'Profile', params: { username: props.thread.user } }">{{ props.thread.user }}</router-link>
    </span>
    <textarea id="text" v-model="text" placeholder="Create a thread!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="pure-button" @click="emit('editThread')">Cancel</button></li>
      </menu>
      <p v-if="props.thread.dateCreated !== props.thread.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.thread.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.thread.dateCreated) }}</p>
    </div>
  </form>
</template>
