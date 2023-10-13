<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
import ThreadListComponent from "@/components/Thread/ThreadListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const props = defineProps(["author"]);

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getPostsByAuthor() {
  let query: Record<string, string> = props.author !== undefined ? { author: props.author } : {};
  console.log(query);
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
  <section v-if="isLoggedIn">
    <section class="posts" v-if="loaded && posts.length !== 0">
      <article v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPostsByAuthor" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPostsByAuthor" @editPost="updateEditing" />
        <div class="feedback">
          <ReactionComponent :post="post" />
          <ThreadListComponent :post="post" />
        </div>
      </article>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </section>
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

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
