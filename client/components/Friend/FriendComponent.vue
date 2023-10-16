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
    <p v-if="user !== undefined">
      Send friend request to <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link>
    </p>
    <form @submit.prevent="sendRequest(userInput, phone)" class="pure-form pure-form-aligned">
      <h3>Send a friend request</h3>
      <fieldset>
        <div class="pure-control-group"><label for="username">User to send friend request to: </label><input type="text" v-model="userInput" :disabled="user !== undefined" required /></div>
      </fieldset>
      <fieldset>
        <div class="pure-control-group"><label for="phone"> Last 4 digits of phone number: </label><input type="tel" maxlength="4" v-model="phone" placeholder="..." required /></div>
      </fieldset>
      <button type="submit" class="button-success pure-button">Send</button>
    </form>
  </article>
  <article v-else-if="status === 'sent'">
    <div class="base">
      <p>
        Friend request to <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link>
      </p>
      <menu>
        <button class="button-error pure-button" @click="deleteRequest()">Delete</button>
      </menu>
    </div>
  </article>
  <article v-else-if="status == 'received'">
    <div class="base">
      <span
        >Friend request from <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link></span
      >
      <menu
        ><li><button class="button-success pure-button" @click="acceptRequest()">Accept</button></li>
        <li><button class="button-error pure-button" @click="rejectRequest()">Reject</button></li></menu
      >
    </div>
  </article>
  <article v-else>
    <div class="base">
      <span
        >Friends with <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link></span
      >
      <menu><button class="button-error pure-button" @click="deleteFriend()">Delete</button></menu>
    </div>
  </article>
</template>
