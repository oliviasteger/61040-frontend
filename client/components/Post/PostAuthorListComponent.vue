<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
import ThreadListComponent from "@/components/Thread/ThreadListComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["author"]);

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getPostsByAuthor() {
  let query: Record<string, string> = props.author !== undefined ? { author: props.author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPostsByAuthor();
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <div v-for="post in posts" :key="post._id">
      <article v-if="editing !== post._id">
        <PostComponent :post="post" @refreshPosts="getPostsByAuthor" @editPost="updateEditing" />
      </article>
      <EditPostForm v-else :post="post" @refreshPosts="getPostsByAuthor" @editPost="updateEditing" />
      <div class="feedback">
        <ReactionComponent :post="post" />
        <ThreadListComponent :post="post" />
      </div>
    </div>
  </section>
  <article v-else-if="loaded">No posts found!</article>
  <article v-else>Loading...</article>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  width: 50em;
}
</style>
