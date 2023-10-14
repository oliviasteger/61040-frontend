<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["profile"]);
const name = ref(props.profile.name);
const details = ref(props.profile.details);
const emit = defineEmits(["editProfile", "refreshProfile"]);

const editProfile = async (name: string, details: string) => {
  try {
    await fetchy(`api/profiles`, "PATCH", { body: { update: { name: name, details: details } } });
  } catch (e) {
    return;
  }
  emit("editProfile");
  emit("refreshProfile");
};
</script>

<template>
  <form @submit.prevent="editProfile(name, details)">
    <p class="username">{{ props.profile.user }}</p>
    <input id="name" type="text" v-model="name" placeholder="Add a display name!" />
    <textarea id="details" v-model="details" placeholder="Add some details about yourself!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editProfile')">Cancel</button></li>
      </menu>
      <p v-if="props.profile.dateCreated !== props.profile.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.profile.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
