<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import FriendComponent from "./FriendComponent.vue";
const props = defineProps(["user"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let status = ref("none");

async function getFriendData() {
  let friendResults = [];

  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  if (friendResults.includes(props.user)) {
    status.value = "friend";
    return;
  }

  let sentResults = [];

  try {
    sentResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or who have rejected the request
  sentResults = sentResults
    .filter((request) => {
      const fromUser = request.from == currentUsername.value;
      const isFriendAlready = friendResults.includes(request.to);
      const statusIsPending = request.status == "pending";
      return fromUser && !isFriendAlready && statusIsPending;
    })
    .map((request) => request.to);

  if (sentResults.includes(props.user)) {
    status.value = "sent";
    return;
  }

  let receivedResults = [];

  try {
    receivedResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or requests that have already been accepted
  receivedResults = receivedResults
    .filter((request) => {
      const fromUser = request.to == currentUsername.value;
      const isFriendAlready = friendResults.includes(request.from);
      const statusIsPending = request.status == "pending";
      return fromUser && !isFriendAlready && statusIsPending;
    })
    .map((request) => request.from);

  if (receivedResults.includes(props.user)) {
    status.value = "received";
    return;
  }
}

onBeforeMount(async () => {
  await getFriendData();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <FriendComponent @refreshFriends="getFriendData" :user="user" :status="status" />
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
