<script setup lang="ts">
import { computed, ref } from "vue";

import { useFriendsStore } from "@/stores/friends";
const { friends, sentRequests, receivedRequests, sendRequest, deleteRequest, acceptRequest, rejectRequest, deleteFriend } = useFriendsStore();

const props = defineProps(["user"]);
const status = computed(() => {
  if (!props.user) return "none";
  else if (friends.includes(props.user.toString())) return "friend";
  else if (sentRequests.map((request) => request.to).includes(props.user.toString())) return "sent";
  else if (receivedRequests.map((request) => request.from).includes(props.user.toString())) return "received";
  else return "none";
});

const emit = defineEmits(["refreshFriends"]);
const phone = ref("");
const userInput = ref(props.user ? props.user : "");

async function sendRequestLocal(user: string, phone: string) {
  await sendRequest(user, phone);
  emit("refreshFriends");
}

async function deleteRequestLocal(user: string) {
  await deleteRequest(user);
  emit("refreshFriends");
}

async function acceptRequestLocal(user: string) {
  await acceptRequest(user);
  emit("refreshFriends");
}

async function rejectRequestLocal(user: string) {
  await rejectRequest(user);
  emit("refreshFriends");
}

async function deleteFriendLocal(user: string) {
  await deleteFriend(user);
  emit("refreshFriends");
}
</script>

<template>
  <div v-if="status === 'friend'">
    <article>
      <div class="base">
        <span
          >Friends with <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link></span
        >
        <menu><button class="button-error pure-button" @click="deleteFriendLocal(props.user)">Delete</button></menu>
      </div>
    </article>
  </div>
  <div v-else-if="status === 'sent'">
    <article>
      <div class="base">
        <p>
          Friend request to <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link>
        </p>
        <menu>
          <button class="button-error pure-button" @click="deleteRequestLocal(props.user)">Delete</button>
        </menu>
      </div>
    </article>
  </div>
  <div v-else-if="status == 'received'">
    <article>
      <div class="base">
        <span
          >Friend request from <router-link :to="{ name: 'Profile', params: { username: props.user } }">{{ props.user }}</router-link>
        </span>
        <menu
          ><li><button class="button-success pure-button" @click="acceptRequestLocal(props.user)">Accept</button></li>
          <li><button class="button-error pure-button" @click="rejectRequestLocal(props.user)">Reject</button></li></menu
        >
      </div>
    </article>
  </div>
  <div v-else>
    <form @submit.prevent="sendRequestLocal(userInput, phone)" class="pure-form">
      <h3>Send friend request</h3>
      <input type="text" v-model="userInput" :disabled="user !== undefined" placeholder="User to send request to" required />
      <input type="tel" maxlength="4" v-model="phone" placeholder="Last 4 digits of the user's phone number" required />
      <button type="submit" class="button-success pure-button">Send</button>
    </form>
  </div>
</template>
