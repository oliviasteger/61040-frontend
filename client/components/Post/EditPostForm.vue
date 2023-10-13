<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const text = ref(props.post.content ? props.post.content : props.post.image);
const picked = ref(props.post.content ? "Content" : "Image");
const tagged = ref(props.post.tagged);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string | undefined, image: string | undefined, tagged: string) => {
  const taggedParsed = tagged
    .replace(" ", "")
    .split(",")
    .filter((x) => x.length !== 0);
  try {
    await fetchy(`api/posts/${props.post._id}`, "PATCH", { body: { update: { content: content, image: image, tagged: taggedParsed } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form @submit.prevent="editPost(picked === 'Content' ? text : undefined, picked === 'Image' ? text : undefined, tagged)">
    <p class="author">{{ props.post.author }} {{ props.post.tagged.length !== 0 ? "with" : "" }} {{ props.post.tagged.join(", ") }}</p>
    <p>Select a post type:</p>
    <label for="image"> <input type="radio" name="type" id="image" value="Image" v-model="picked" required /> Image</label>
    <label for="content"> <input type="radio" name="type" id="content" value="Content" v-model="picked" required /> Content</label>
    <textarea id="text" v-model="text" placeholder="Create a post!" required> </textarea>
    <input id="tagged" type="text" v-model="tagged" placeholder="Add tagged usernames!" />
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPost')">Cancel</button></li>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </div>
  </form>
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
</style>
