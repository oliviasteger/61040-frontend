<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const emit = defineEmits(["refreshThreads"]);
const props = defineProps(["post", "thread"]);

const createThread = async (content: string) => {
  if (props.post) {
    try {
      await fetchy(`/api/posts/${props.post._id}/threads`, "POST", { body: { root: props.post._id, content: content } });
    } catch (_) {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`/api/posts/${props.thread.root}/threads`, "POST", { body: { root: props.thread.root, target: props.thread._id, content: content } });
    } catch (_) {
      return;
    }
  }

  emit("refreshThreads");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <form @submit.prevent="createThread(text)">
    <textarea id="text" v-model="text" placeholder="Create a thread!" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create Thread</button>
  </form>
</template>
