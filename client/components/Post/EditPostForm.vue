<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const text = ref(props.post.content ? props.post.content : props.post.image);
const picked = ref(props.post.content ? "Content" : "Image");
const tagged = ref(props.post.tagged.length === 0 ? "" : props.post.tagged.toString());
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string | null, image: string | null, tagged: string) => {
  const taggedParsed =
    tagged === null
      ? null
      : tagged
          .replace(" ", "")
          .split(",")
          .filter((x) => x.length !== 0);
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { content: content, image: image, tagged: taggedParsed } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(picked === 'Content' ? text : null, picked === 'Image' ? text : null, tagged === '' ? null : tagged)" class="pure-form">
    <span class="author">
      <router-link :to="{ name: 'Profile', params: { username: props.post.author } }">{{ props.post.author }}</router-link>
      {{ props.post.tagged.length !== 0 ? "with" : "" }}
      <span v-for="(n, i) in props.post.tagged" :key="i">
        <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
        <span v-if="i < props.post.tagged.length - 1">, </span>
      </span>
    </span>
    <p>Select a post type:</p>
    <label for="image"> <input type="radio" name="type" id="image" value="Image" v-model="picked" required /> Image</label>
    <label for="content"> <input type="radio" name="type" id="content" value="Content" v-model="picked" required /> Text</label>
    <p></p>
    <textarea id="text" v-model="text" :placeholder="picked === 'Content' ? 'Add some text!' : 'Add an image URL!'" required> </textarea>
    <input id="tagged" type="text" v-model="tagged" placeholder="Add tagged usernames!" />
    <div class="base">
      <menu>
        <li><button class="pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </form>
</template>
