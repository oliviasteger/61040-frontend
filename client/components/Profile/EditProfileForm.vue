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
    await fetchy(`/api/profiles`, "PATCH", { body: { update: { name: name, details: details } } });
  } catch (e) {
    return;
  }
  emit("editProfile");
  emit("refreshProfile");
};
</script>

<template>
  <form @submit.prevent="editProfile(name, details)">
    <p class="author">{{ props.profile.user }}</p>
    <input id="name" type="text" v-model="name" placeholder="Add a display name!" />
    <textarea id="details" v-model="details" placeholder="Add some details about yourself!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="pure-button" @click="emit('editProfile')">Cancel</button></li>
      </menu>
      <p v-if="props.profile.dateCreated !== props.profile.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.profile.dateCreated) }}</p>
    </div>
  </form>
</template>
