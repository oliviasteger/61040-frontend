<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["user", "status"]);
const emit = defineEmits(["refreshFriends"]);
const phone = ref("");
const userInput = ref(props.user ? props.user : "");

async function sendRequest(user: string, phone: string) {
  try {
    await fetchy(`/api/friend/requests/${user}`, "POST", { body: { phone: phone } });
  } catch (_) {
    return;
  }
  emit("refreshFriends");
}

async function acceptRequest() {
  try {
    await fetchy(`/api/friend/accept/${props.user}`, "PUT");
  } catch (_) {
    return;
  }
  emit("refreshFriends");
}

async function rejectRequest() {
  try {
    await fetchy(`/api/friend/reject/${props.user}`, "PUT");
  } catch (_) {
    return;
  }
  emit("refreshFriends");
}

async function deleteRequest() {
  try {
    await fetchy(`/api/friend/requests/${props.user}`, "DELETE");
  } catch (_) {
    return;
  }
  emit("refreshFriends");
}

async function deleteFriend() {
  try {
    await fetchy(`/api/friends/${props.user}`, "DELETE");
  } catch (_) {
    return;
  }
}
</script>

<template>
  <article v-if="status == 'none'">
    <p v-if="user !== undefined">Send friend request to {{ props.user }}</p>
    <form @submit.prevent="sendRequest(userInput, phone)">
      <h3>Send a friend request</h3>
      <label for="username">User to send friend request to: <input type="text" v-model="userInput" :disabled="user !== undefined" required /></label>
      <label for="phone"> Last 4 digits of phone number: <input type="tel" maxlength="4" v-model="phone" placeholder="..." required /></label>
      <button type="submit" class="button-success pure-button">Send</button>
    </form>
  </article>
  <article v-else-if="status === 'sent'">
    <p>Sent friend request to {{ props.user }}</p>
    <button class="button-error pure-button" @click="deleteRequest()">Delete</button>
  </article>
  <article v-else-if="status == 'received'">
    <span>Received friend request from {{ props.user }}</span>
    <menu
      ><li><button class="button-success pure-button" @click="acceptRequest()">Accept</button></li>
      <li><button class="button-error pure-button" @click="rejectRequest()">Reject</button></li></menu
    >
  </article>
  <article v-else>
    <span>Friends with {{ props.user }}</span>
    <menu><button class="button-error pure-button" @click="deleteFriend()">Delete</button></menu>
  </article>
</template>
