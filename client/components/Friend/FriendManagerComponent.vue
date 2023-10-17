<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useFriendsStore } from "../../stores/friends";

import { onBeforeMount } from "vue";
import FriendComponent from "./FriendComponent.vue";

const { isLoggedIn } = storeToRefs(useUserStore());
const { friends, sentRequests, receivedRequests } = storeToRefs(useFriendsStore());
const { fetchFriendData } = useFriendsStore();

onBeforeMount(async () => {
  await fetchFriendData();
});
</script>

<template>
  <section v-if="isLoggedIn">
    <FriendComponent />
    <div class="row" style="margin: 0 auto">
      <h2>Friends</h2>
    </div>
    <section class="list" v-if="friends.length !== 0">
      <div v-for="friend in friends" :key="friend">
        <FriendComponent :user="friend" />
      </div>
    </section>
    <article v-else><p>No friends found!</p></article>
    <div class="row">
      <h2>Received requests</h2>
    </div>
    <section class="list" v-if="receivedRequests.length !== 0">
      <div v-for="request in receivedRequests" :key="request._id">
        <FriendComponent :user="request.from" />
      </div>
    </section>
    <article v-else><p>No received friend requests found!</p></article>
    <div class="row">
      <h2>Sent requests</h2>
    </div>
    <section class="list" v-if="sentRequests.length !== 0">
      <div v-for="request in sentRequests" :key="request._id">
        <FriendComponent :user="request.from" />
      </div>
    </section>
    <article v-else><p>No sent friend requests found!</p></article>
  </section>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  width: 50em;
}
</style>
