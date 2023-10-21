<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["message"]);
const content = ref(
  props.message.content.map((obj: { imageUrl: string } | { content: string }) => {
    if ("imageUrl" in obj && obj.imageUrl !== null) return { type: "Image", text: obj.imageUrl };
    if ("content" in obj && obj.content !== null) return { type: "Content", text: obj.content };
  }),
);

const title = ref(props.message.title);
const recipients = ref(props.message.recipients.toString());
const scheduledTime = ref(props.message.scheduledTime);
const emit = defineEmits(["editMessage", "refreshMessages"]);

const editMessage = async (
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
    else return { imageUrl: null, content: entry.text };
  });
  const dateParsed = new Date(scheduledTime).getTime();

  try {
    await fetchy(`/api/scheduledmessages/${props.message._id}`, "PATCH", { body: { update: { title: title, scheduledTime: dateParsed, content: contentParsed, recipients: recipientsParsed } } });
  } catch (e) {
    return;
  }
  emit("editMessage");
  emit("refreshMessages");
};

const addContent = () => {
  content.value.push({ type: "Image", text: "" });
};

const removeContent = () => {
  if (content.value.length > 1) {
    content.value.pop();
  }
};
</script>

<template>
  <form @submit.prevent="editMessage(title, scheduledTime, content, recipients)">
    <input id="title" type="text" v-model="title" placeholder="Add a message title!" required />
    <input id="recipients" type="text" v-model="recipients" placeholder="Add recipient usernames!" required />
    <label for="time">Select send date: <input id="time" name="time" type="date" v-model="scheduledTime" required /></label>
    <article class="inverse-article" v-for="(entry, i) in content" :key="i">
      <p>Select content type:</p>
      <label :for="'image' + i"> <input type="radio" :name="'type' + i" :id="'image' + i" value="Image" v-model="entry.type" required /> Image</label>
      <label :for="'content' + i"> <input type="radio" :name="'type' + i" :id="'content' + i" value="Content" v-model="entry.type" required /> Text</label>
      <p></p>
      <textarea :id="'text' + i" v-model="entry.text" :placeholder="entry.type === 'Content' ? 'Add some text!' : 'Add an image URL!'" required> </textarea>
    </article>
    <button id="addContent" class="pure-button-primary pure-button" @click="addContent">Add content</button>
    <button v-if="content.length > 1" id="removeContent" class="button-error pure-button" @click="removeContent">Remove last content</button>

    <div class="base">
      <menu>
        <li><button class="pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="pure-button" @click="emit('editMessage')">Cancel</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.message.dateCreated !== props.message.dateUpdated">Edited on: {{ formatDate(props.message.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.message.dateCreated) }}</p>
      </article>
    </div>
  </form>
</template>
