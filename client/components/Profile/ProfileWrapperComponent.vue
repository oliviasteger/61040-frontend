<script setup lang="ts">
import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import ProfileComponent from "@/components/Profile/ProfileComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import FriendComponentWrapper from "../Friend/FriendComponentWrapper.vue";
import PostAuthorListComponent from "../Post/PostAuthorListComponent.vue";
const props = defineProps(["username"]);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let profile = ref<Record<string, string>>();
let editing = ref("");
let searchUser = ref("");

async function getProfile(user?: string) {
  let query: Record<string, string> = user !== undefined ? { owner: user } : {};
  let profileResult;
  try {
    profileResult = await fetchy("/api/profiles", "GET", { query });
  } catch (_) {
    return;
  }
  searchUser.value = user ? user : "";
  profile.value = profileResult;
}

function updateProfile(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getProfile(props.username);
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
    <section v-if="loaded && profile">
      <article>
        <ProfileComponent v-if="editing !== profile._id" :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
        <EditProfileForm v-else :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
      </article>
      <FriendComponentWrapper v-if="currentUsername !== username" :user="username" />
      <PostAuthorListComponent :author="username" />
    </section>
    <p v-else>Loading...</p>
  </section>
</template>

<style scoped>
section,
p,
.row {
  margin: 0 auto;
  max-width: 50em;
}
</style>
