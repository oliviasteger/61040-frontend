<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

import FriendComponent from "./FriendComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let friends = ref<Array<string>>([]);
let sent = ref<Array<Record<string, string>>>([]);
let received = ref<Array<Record<string, string>>>([]);

async function getFriendData() {
  let friendResults: string[] = [];

  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  friends.value = friendResults;

  let sentResults: {
    from: string;
    to: string;
    status: string;
  }[] = [];

  try {
    sentResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or who have rejected the request
  sent.value = sentResults.filter((request) => {
    const fromUser = request.from == currentUsername.value;
    const isFriendAlready = friendResults.includes(request.to);
    const statusIsPending = request.status == "pending";
    return fromUser && !isFriendAlready && statusIsPending;
  });

  let receivedResults: {
    from: string;
    to: string;
    status: string;
  }[] = [];
  try {
    receivedResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or requests that have already been accepted
  received.value = receivedResults.filter((request) => {
    const fromUser = request.to == currentUsername.value;
    const isFriendAlready = friendResults.includes(request.from);
    const statusIsPending = request.status == "pending";
    return fromUser && !isFriendAlready && statusIsPending;
  });
}

onBeforeMount(async () => {
  await getFriendData();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <FriendComponent @refreshFriends="getFriendData" :status="'none'" />
    <div class="row">
      <h2>Friends</h2>
    </div>
    <section class="list" v-if="loaded && friends.length !== 0">
      <div v-for="friend in friends" :key="friend">
        <FriendComponent @refreshFriends="getFriendData" :user="friend" :status="'friend'" />
      </div>
    </section>
    <article v-else-if="loaded"><p>No friends found!</p></article>
    <article v-else><p>Loading...</p></article>
    <div class="row">
      <h2>Received requests</h2>
    </div>
    <section class="list" v-if="loaded && received.length !== 0">
      <div v-for="request in received" :key="request._id">
        <FriendComponent @refreshFriends="getFriendData" :user="request.from" :status="'received'" />
      </div>
    </section>
    <article v-else-if="loaded"><p>No received friend requests found!</p></article>
    <article v-else><p>Loading...</p></article>
    <div class="row">
      <h2>Sent requests</h2>
    </div>
    <section class="list" v-if="loaded && sent.length !== 0">
      <div v-for="request in sent" :key="request._id">
        <FriendComponent @refreshFriends="getFriendData" :user="request.from" :status="'sent'" />
      </div>
    </section>
    <article v-else-if="loaded"><p>No sent friend requests found!</p></article>
    <article v-else><p>Loading...</p></article>
  </section>
</template>

<style scoped></style>
