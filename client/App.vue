<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

const hover = ref("");
</script>

<template>
  <div class="wrapper">
    <header>
      <nav>
        <div class="title">
          <img src="@/assets/images/logo.png" />
          <RouterLink :to="{ name: 'Home' }">
            <h1>InCircle</h1>
          </RouterLink>
        </div>
        <ul>
          <li>
            <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home', onHover: hover == 'Home' }" @mouseover="hover = 'Home'" @mouseleave="hover = ''"> Home </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Messages' }" :class="{ underline: currentRouteName == 'Messages', onHover: hover == 'Messages' }" @mouseover="hover = 'Messages'" @mouseleave="hover = ''">
              Messages
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink
              :to="{ name: 'Profile', params: { username: currentUsername } }"
              :class="{ underline: currentRouteName == 'Profile', onHover: hover == 'Profile' }"
              @mouseover="hover = 'Profile'"
              @mouseleave="hover = ''"
            >
              Profile
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Friends' }" :class="{ underline: currentRouteName == 'Friends', onHover: hover == 'Friends' }" @mouseover="hover = 'Friends'" @mouseleave="hover = ''">
              Friends
            </RouterLink>
          </li>
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings', onHover: hover == 'Settings' }" @mouseover="hover = 'Settings'" @mouseleave="hover = ''">
              {{ "Settings for " + currentUsername }}
            </RouterLink>
          </li>
          <li v-else>
            <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login', onHover: hover == 'Login' }" @mouseover="hover = 'Login'" @mouseleave="hover = ''">
              Login
            </RouterLink>
          </li>
        </ul>
      </nav>
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: var(--dark-brown);
  color: var(--text-color);
  display: flex;
  align-items: center;
  width: 100%;
}

header {
  display: flex;
  width: 100%;
  position: fixed;
}

.wrapper {
  display: flex;
  flex-direction: column;
}

main {
  padding-top: 6em;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  color: var(--text-color);
  text-decoration: none;
  transition: 0.3s;
}

.onHover {
  color: var(--yellow);
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  color: var(--yellow);
}
</style>
