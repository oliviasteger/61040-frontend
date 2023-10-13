<script setup lang="ts">
import CreateScheduledMessageForm from "@/components/ScheduledMessage/CreateScheduledMessageForm.vue";
import EditScheduledMessageForm from "@/components/ScheduledMessage/EditScheduledMessageForm.vue";
import ScheduledMessageComponent from "@/components/ScheduledMessage/ScheduledMessageComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let received = ref<Array<Record<string, string>>>([]);
let sent = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getScheduledMessages() {
  let receivedResults;
  try {
    receivedResults = await fetchy("/scheduledmessages/received", "GET");
  } catch (_) {
    return;
  }
  received.value = receivedResults;

  let sentResults;
  try {
    sentResults = await fetchy("/scheduledmessages/sent", "GET");
  } catch (_) {
    return;
  }
  sent.value = sentResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getScheduledMessages();
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Create a scheduled message:</h2>
    <CreateScheduledMessageForm @refreshMsgs="getScheduledMessages" />
    <div class="row">
      <h2>Received Messages:</h2>
    </div>
    <section class="received" v-if="loaded && received.length !== 0">
      <article v-for="msg in received" :key="msg._id">
        <ScheduledMessageComponent :msg="msg" @refreshMsgs="getScheduledMessages" @editMsg="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No messages received</p>
    <p v-else>Loading...</p>

    <div class="row">
      <h2>Sent Messages:</h2>
    </div>
    <section class="sent" v-if="loaded && sent.length !== 0">
      <article v-for="msg in sent" :key="msg._id">
        <ScheduledMessageComponent v-if="editing !== msg._id" :msg="msg" @refreshMsgs="getScheduledMessages" @editMsg="updateEditing" />
        <EditScheduledMessageForm v-else :msg="msg" @refreshMsgs="getScheduledMessages" @editMsg="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No messages sent</p>
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
