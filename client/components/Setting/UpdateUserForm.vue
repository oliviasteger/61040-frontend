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
  await UpdateUser({ phone: phone.value });
  await updateSession();
  phone.value = "";
}
</script>

<template>
  <h2>Update user details</h2>
  <form @submit.prevent="updateUsername" class="pure-form">
    <fieldset>
      <legend>Change your username</legend>
      <input type="text" placeholder="New username" v-model="username" required />
      <button type="submit" class="pure-button pure-button-primary">Update username</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePassword" class="pure-form">
    <fieldset>
      <legend>Change your password</legend>
      <input type="password" placeholder="New password" v-model="password" required />
      <button type="submit" class="pure-button pure-button-primary">Update password</button>
    </fieldset>
  </form>

  <form @submit.prevent="updatePhone" class="pure-form">
    <fieldset>
      <legend>Change your phone number</legend>
      <input type="tel" placeholder="New phone number" v-model="phone" required />
      <button type="submit" class="pure-button pure-button-primary">Update phone number</button>
    </fieldset>
  </form>
</template>
