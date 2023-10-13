<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const picked = ref("Image");
const tagged = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string | undefined, image: string | undefined, tagged: string) => {
  const taggedParsed = tagged
    .replace(" ", "")
    .split(",")
    .filter((x) => x.length !== 0);
  try {
    await fetchy("api/posts", "POST", {
      body: { content: content, image: image, tagged: taggedParsed },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
  picked.value = "Image";
  tagged.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(picked === 'Content' ? text : undefined, picked === 'Image' ? text : undefined, tagged)">
    <p>Select a post type:</p>
    <label for="image"> <input type="radio" name="type" id="image" value="Image" v-model="picked" required /> Image</label>
    <label for="content"> <input type="radio" name="type" id="content" value="Content" v-model="picked" required /> Content</label>
    <textarea id="text" v-model="text" placeholder="Create a post!" required> </textarea>
    <input id="tagged" type="text" v-model="tagged" placeholder="Add tagged usernames!" />
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

input[type="text"] {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
  border: 1px solid black;
}
</style>
