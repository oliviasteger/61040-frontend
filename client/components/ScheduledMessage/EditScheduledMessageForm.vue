<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["message"]);
const content = ref(
  props.message.content.map((obj) => {
    if ("imageUrl" in obj) return { type: "Image", text: obj.imageUrl };
    if ("content" in obj) return { type: "Content", text: obj.content };
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
  console.log(title, scheduledTime, content, recipients);
  const recipientsParsed = recipients
    .replace(" ", "")
    .split(",")
    .filter((x) => x.length !== 0);
  const contentParsed = content.map((entry) => {
    if (entry.type == "Image") return { imageUrl: entry.text };
    if (entry.type == "Content") return { content: entry.text };
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
  if (content.value.length > 0) {
    content.value.pop();
  }
};
</script>

<template>
  <form @submit.prevent="editMessage(title, scheduledTime, content, recipients)">
    <p class="author">
      <span>From: </span><router-link :to="{ name: 'Profile', params: { username: props.message.user } }">{{ props.message.user }}</router-link>
      <br />
      <span>To: </span>
      <span v-for="(n, i) in props.message.recipients" :key="i">
        <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
        <span v-if="i < props.message.recipients.length - 1">, </span>
      </span>
    </p>
    <input id="title" type="text" v-model="title" placeholder="Add a message title!" />
    <article v-for="(entry, i) in content" :key="i">
      <p>Select content type:</p>
      <label :for="'image' + i"> <input type="radio" :name="'type' + i" :id="'image' + i" value="Image" v-model="entry.type" required /> Image</label><br />
      <label :for="'content' + i"> <input type="radio" :name="'type' + i" :id="'content' + i" value="Content" v-model="entry.type" required /> Text</label>
      <p></p>
      <textarea :id="'text' + i" v-model="entry.text" placeholder="Create a post!" required> </textarea>
    </article>
    <button id="addContent" class="pure-button-primary pure-button" @click="addContent">Add content</button>
    <button v-if="content.length > 0" id="removeContent" class="button-error pure-button" @click="removeContent">Remove last content</button>
    <input id="recipients" type="text" v-model="recipients" placeholder="Add recipient usernames!" />
    <label for="time">Select send date: <input id="time" name="time" type="date" v-model="scheduledTime" required /></label>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editMessage')">Cancel</button></li>
      </menu>
      <p v-if="props.message.dateCreated !== props.message.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.message.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.message.dateCreated) }}</p>
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
