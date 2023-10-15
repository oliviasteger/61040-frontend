<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <p class="author">
    <router-link :to="{ name: 'Profile', params: { username: props.post.author } }">{{ props.post.author }}</router-link>
    {{ props.post.tagged.length !== 0 ? "with" : "" }}
    <span v-for="(n, i) in props.post.tagged" :key="i">
      <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
      <span v-if="i < props.post.tagged.length - 1">, </span>
    </span>
  </p>
  <p>{{ props.post.content }}</p>
  <img :src="post.image" />
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>
