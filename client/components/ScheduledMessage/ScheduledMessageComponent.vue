<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["message", "status"]);
const emit = defineEmits(["editMessage", "refreshMessages"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteMessage = async () => {
  try {
    await fetchy(`/api/scheduledmessages/${props.message._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshMessages");
};
</script>

<template>
  <p class="author">
    <span>From: </span><router-link :to="{ name: 'Profile', params: { username: props.message.user } }">{{ props.message.user }}</router-link>
    <br />
    <span>To: </span>
    <span v-for="(n, i) in props.message.recipients" :key="i">
      <router-link :to="{ name: 'Profile', params: { username: n } }">{{ n }}</router-link>
      <span v-if="i < props.message.recipients.length - 1">, </span>
    </span>
  </p>
  <p class="message-title">{{ props.message.title }}</p>

  <section v-for="(c, i) in props.message.content" :key="'content' + i">
    <img v-if="'imageUrl' in c" :src="c.imageUrl" />
    <p v-if="'content' in c">{{ c.content }}</p>
  </section>
  <div class="base">
    <menu v-if="props.message.user == currentUsername && props.status == 'editable'">
      <li><button class="btn-small pure-button" @click="emit('editMessage', props.message._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteMessage">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.status == 'editable'">Scheduled to send at: {{ formatDate(props.message.scheduledTime) }}</p>
      <p v-else>Sent at: {{ formatDate(props.message.scheduledTime) }}</p>
    </article>
  </div>
</template>
