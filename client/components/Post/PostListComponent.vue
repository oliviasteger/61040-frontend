<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import ReactionComponent from "@/components/Reaction/ReactionComponent.vue";
import ThreadListComponent from "@/components/Thread/ThreadListComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import AnnouncementComponent from "../Announcement/AnnouncementComponent.vue";
import RecapComponent from "../Recap/RecapComponent.vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <br />
    <RecapComponent />
    <AnnouncementComponent />
    <CreatePostForm @refreshPosts="getPosts" />
    <div class="row">
      <h2 v-if="!searchAuthor">Posts:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <div v-for="post in posts" :key="post._id">
        <article>
          <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
          <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        </article>
        <div class="feedback">
          <ReactionComponent :post="post" />
          <ThreadListComponent :post="post" />
        </div>
      </div>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  max-width: 50em;
}
</style>
