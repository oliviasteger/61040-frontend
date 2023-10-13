<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
import CreateThreadForm from "@/components/Thread/CreateThreadForm.vue";
import EditThreadForm from "@/components/Thread/EditThreadForm.vue";
import ThreadComponent from "@/components/Thread/ThreadComponent.vue";

const props = defineProps(["post", "thread"]);
const loaded = ref(false);
let threads = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getThreads() {
  let threadResults;
  if (props.post) {
    try {
      threadResults = await fetchy(`api/posts/${props.post._id}/threads`, "GET");
    } catch (_) {
      return;
    }
  } else if (props.thread) {
    try {
      threadResults = await fetchy(`api/threads/${props.thread._id}/threads`, "GET");
    } catch (_) {
      return;
    }
  }

  threads.value = threadResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getThreads();
  loaded.value = true;
});
</script>

<template>
  <CreateThreadForm v-if="post" :post="post" @refreshThreads="getThreads" />
  <CreateThreadForm v-if="thread" :thread="thread" @refreshThreads="getThreads" />
  <section class="threads" v-if="loaded && threads.length !== 0">
    <article v-for="thread in threads" :key="thread._id">
      <ThreadComponent v-if="editing !== thread._id" :thread="thread" @refreshThreads="getThreads" @editThread="updateEditing" />
      <EditThreadForm v-else :thread="thread" @refreshThreads="getThreads" @editThread="updateEditing" />
      <div class="feedback">
        <ReactionComponent :thread="thread" />
        <ThreadListComponent :thread="thread" />
      </div>
    </article>
  </section>
  <p v-else-if="loaded">No threads found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.threads {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
