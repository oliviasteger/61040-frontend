<script setup lang="ts">
import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import ProfileComponent from "@/components/Profile/ProfileComponent.vue";
import SearchProfileForm from "@/components/Profile/SearchProfileForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let profile = ref<Record<string, string>>();
let editing = ref("");
let searchUser = ref("");

async function getProfile(user?: string) {
  let query: Record<string, string> = user !== undefined ? { owner: user } : {};
  let profileResult;
  try {
    profileResult = await fetchy("api/profiles", "GET", { query });
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
  await getProfile();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <div class="row">
      <h2 v-if="!searchUser">Profile for {{ currentUsername }}:</h2>
      <h2 v-else>Profile for {{ searchUser }}:</h2>
      <SearchProfileForm @getProfileByUser="getProfile" />
    </div>
    <section class="profiles" v-if="loaded">
      <article>
        <ProfileComponent v-if="editing !== profile._id" :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
        <EditProfileForm v-else :profile="profile" @refreshProfile="getProfile" @editProfile="updateProfile" />
      </article>
    </section>
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

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
