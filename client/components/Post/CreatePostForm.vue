<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const text = ref("");
const picked = ref("Image");
const tagged = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string | null, image: string | null, tagged: string) => {
  const taggedParsed = tagged
    .replace(" ", "")
    .split(",")
    .filter((x) => x.length !== 0);
  try {
    await fetchy("/api/posts", "POST", {
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
  <form @submit.prevent="createPost(picked === 'Content' ? text : null, picked === 'Image' ? text : null, tagged)">
    <h3>Create a post</h3>
    <p>Select a post type:</p>
    <label for="image"> <input type="radio" name="type" id="image" value="Image" v-model="picked" required /> Image</label>
    <label for="content"> <input type="radio" name="type" id="content" value="Content" v-model="picked" required /> Content</label>
    <textarea id="text" v-model="text" :placeholder="picked === 'Content' ? 'Add some text!' : 'Add an image URL!'" required> </textarea>
    <input id="tagged" type="text" v-model="tagged" placeholder="Add tagged usernames!" />
    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>
