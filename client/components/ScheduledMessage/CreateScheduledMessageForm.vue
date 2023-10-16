<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const recipients = ref("");
const scheduledTime = ref("");
const content = ref<
  Array<{
    type: "Image" | "Content";
    text: string;
  }>
>([]);
const emit = defineEmits(["refreshMessages"]);

const createScheduledMessage = async (
  title: string,
  scheduledTime: string,
  content: {
    type: "Image" | "Content";
    text: string;
  }[],
  recipients: string,
) => {
  const recipientsParsed = recipients
    .replace(" ", "")
    .split(",")
    .filter((x) => x.length !== 0);
  const contentParsed = content.map((entry) => {
    if (entry.type == "Image") return { imageUrl: entry.text, content: null };
    else return { content: entry.text, imageUrl: null };
  });

  const dateParsed = new Date(scheduledTime).getTime();

  try {
    await fetchy("/api/scheduledmessages", "POST", {
      body: { title: title, scheduledTime: dateParsed, content: contentParsed, recipients: recipientsParsed },
    });
  } catch (_) {
    return;
  }
  emit("refreshMessages");
  emptyForm();
};

const addContent = () => {
  content.value.push({ type: "Image", text: "" });
};

const removeContent = () => {
  if (content.value.length > 0) {
    content.value.pop();
  }
};

const emptyForm = () => {
  content.value = [];
  title.value = "";
  recipients.value = "";
  scheduledTime.value = "";
};
</script>

<template>
  <form @submit.prevent="createScheduledMessage(title, scheduledTime, content, recipients)">
    <h3>Schedule a message</h3>
    <input id="title" type="text" v-model="title" placeholder="Add a message title!" />
    <article v-for="(entry, i) in content" :key="i">
      <p>Select content type:</p>
      <label :for="'image' + i"> <input type="radio" :name="'type' + i" :id="'image' + i" value="Image" v-model="entry.type" required /> Image</label><br />
      <label :for="'content' + i"> <input type="radio" :name="'type' + i" :id="'content' + i" value="Content" v-model="entry.type" required /> Text</label>
      <p></p>
      <textarea :id="'text' + i" v-model="entry.text" placeholder="Add some content!" required> </textarea>
    </article>
    <button id="addContent" class="pure-button-primary pure-button" @click="addContent">Add content</button>
    <button v-if="content.length > 0" id="removeContent" class="button-error pure-button" @click="removeContent">Remove last content</button>
    <input id="recipients" type="text" v-model="recipients" placeholder="Add recipient usernames!" />
    <label for="time">Select send date: <input id="time" name="time" type="date" v-model="scheduledTime" required /></label>
    <button type="submit" class="pure-button-primary pure-button">Schedule message</button>
  </form>
</template>
