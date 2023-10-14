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
    <h2>Send Friend Request:</h2>
    <FriendComponent @refreshFriends="getFriendData" :status="'none'" />
    <h2>Friends:</h2>
    <section class="list" v-if="loaded && friends.length !== 0">
      <article v-for="friend in friends" :key="friend">
        <FriendComponent @refreshFriends="getFriendData" :user="friend" :status="'friend'" />
      </article>
    </section>
    <p v-else-if="loaded">No friends found</p>
    <p v-else>Loading...</p>
    <h2>Received requests:</h2>
    <section class="list" v-if="loaded && received.length !== 0">
      <article v-for="request in received" :key="request._id">
        <FriendComponent @refreshFriends="getFriendData" :user="request.from" :status="'received'" />
      </article>
    </section>
    <p v-else-if="loaded">No received requests found</p>
    <p v-else>Loading...</p>
    <h2>Sent requests:</h2>
    <section class="list" v-if="loaded && sent.length !== 0">
      <article v-for="request in sent" :key="request._id">
        <FriendComponent @refreshFriends="getFriendData" :user="request.from" :status="'sent'" />
      </article>
    </section>
    <p v-else-if="loaded">No sent requests found</p>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.list {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
