<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <br />
    <article>
      <menu>
        <button class="pure-button pure-button-primary" @click="logout">Logout</button>
        <button class="button-error pure-button" @click="delete_">Delete User</button>
      </menu>
    </article>
    <UpdateUserForm />
  </main>
</template>
