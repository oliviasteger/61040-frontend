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
  let friendResults: string[] = [];

  try {
    friendResults = await fetchy("/api/friends", "GET");
  } catch (_) {
    return;
  }

  if (friendResults.includes(props.user)) {
    status.value = "friend";
    return;
  }

  let sentResults: { to: string; from: string; status: string }[] = [];

  try {
    sentResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or who have rejected the request
  let sentTo = sentResults
    .filter((request) => {
      const fromUser = request.from == currentUsername.value;
      const isFriendAlready = friendResults.includes(request.to);
      const statusIsPending = request.status == "pending";
      return fromUser && !isFriendAlready && statusIsPending;
    })
    .map((request) => request.to);

  if (sentTo.includes(props.user)) {
    status.value = "sent";
    return;
  }

  let receivedResults: { to: string; from: string; status: string }[] = [];

  try {
    receivedResults = await fetchy("/api/friend/requests", "GET");
  } catch (_) {
    return;
  }

  // Filter out users who are already friends or requests that have already been accepted
  let receivedFrom = receivedResults
    .filter((request) => {
      const fromUser = request.to == currentUsername.value;
      const isFriendAlready = friendResults.includes(request.from);
      const statusIsPending = request.status == "pending";
      return fromUser && !isFriendAlready && statusIsPending;
    })
    .map((request) => request.from);

  if (receivedFrom.includes(props.user)) {
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
