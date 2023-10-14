<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["thread"]);
const text = ref(props.thread.content);
const emit = defineEmits(["editThread", "refreshThreads"]);

const editThread = async (content: string) => {
  try {
    await fetchy(`api/threads/${props.thread._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }

  emit("editThread");
  emit("refreshThreads");
};
</script>

<template>
  <div class="thread">
    <form @submit.prevent="editThread(text)">
      <textarea id="text" v-model="text" placeholder="Create a thread!" required> </textarea>
      <div class="base">
        <menu>
          <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
          <li><button class="btn-small pure-button" @click="emit('editThread')">Cancel</button></li>
        </menu>
        <p v-if="props.thread.dateCreated !== props.thread.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.thread.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(props.thread.dateCreated) }}</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.thread {
  background-color: #fff;
  padding: 1em;
  border-radius: 1em;
  margin-bottom: 1em;
}
</style>
