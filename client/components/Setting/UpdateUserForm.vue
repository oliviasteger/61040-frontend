<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");
let phone = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}

async function updatePhone() {
  await updateUser({ phone: phone.value });
  await updateSession();
  phone.value = "";
}
</script>

<template>
  <article>
    <h3>Update user information</h3>
    <form @submit.prevent="updateUsername" class="pure-form">
      <menu>
        <input type="text" placeholder="New username" v-model="username" required />
        <button type="submit" class="pure-button pure-button-primary">Update username</button>
      </menu>
    </form>

    <form @submit.prevent="updatePassword" class="pure-form">
      <menu>
        <input type="password" placeholder="New password" v-model="password" required />
        <button type="submit" class="pure-button pure-button-primary">Update password</button>
      </menu>
    </form>

    <form @submit.prevent="updatePhone" class="pure-form">
      <menu>
        <input type="tel" placeholder="New phone number" v-model="phone" required />
        <button type="submit" class="pure-button pure-button-primary">Update phone number</button>
      </menu>
    </form>
  </article>
</template>
