<script setup lang="ts">
import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import ProfileComponent from "@/components/Profile/ProfileComponent.vue";
import SearchProfileForm from "@/components/Profile/SearchProfileForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import { useFriendsStore } from "../../stores/friends";
import FriendComponent from "../Friend/FriendComponent.vue";
import PostAuthorListComponent from "../Post/PostAuthorListComponent.vue";
const props = defineProps(["username"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { friends } = storeToRefs(useFriendsStore());
const { fetchFriendData } = useFriendsStore();

const loaded = ref(false);
let profile = ref<Record<string, string>>();
let editing = ref("");

async function getProfile(user?: string) {
  let query: Record<string, string> = user !== undefined ? { owner: user } : {};
  let profileResult;
  try {
    profileResult = await fetchy("/api/profiles", "GET", { query });
    profile.value = profileResult;
  } catch (_) {
    profile.value = undefined;
    return;
  }
}

function updateProfile(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getProfile(props.username);
  await fetchFriendData();
  loaded.value = true;
});

watch(props, async (newProps) => {
  loaded.value = false;
  await getProfile(newProps.username);
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <br />
    <SearchProfileForm :username="username" />
    <section v-if="loaded && profile">
      <article>
        <ProfileComponent v-if="editing !== profile._id" :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
        <EditProfileForm v-else :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
      </article>
      <FriendComponent v-if="currentUsername !== username" :user="username" />
      <PostAuthorListComponent v-if="friends.includes(username) || currentUsername === username" :author="username" />
      <article v-else>Cannot view posts without being friends!</article>
    </section>
    <article v-else-if="profile">Loading...</article>
    <article v-else>{{ username }} does not exist!</article>
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
