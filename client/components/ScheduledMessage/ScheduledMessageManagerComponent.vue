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
    receivedResults = await fetchy("/api/scheduledmessages/received", "GET");
  } catch (_) {
    return;
  }
  received.value = receivedResults;

  let sentResults;
  try {
    sentResults = await fetchy("/api/scheduledmessages/sent", "GET");
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
    <br />
    <CreateScheduledMessageForm @refreshMessages="getScheduledMessages" />
    <div class="row">
      <h2>Received messages</h2>
    </div>
    <section class="received" v-if="loaded && received.length !== 0">
      <article v-for="msg in received" :key="msg._id">
        <ScheduledMessageComponent :message="msg" status="locked" @refreshMessages="getScheduledMessages" @editMessage="updateEditing" />
      </article>
    </section>
    <article v-else-if="loaded">No received messages found!</article>
    <article v-else>Loading...</article>

    <div class="row">
      <h2>Sent messages</h2>
    </div>
    <section class="sent" v-if="loaded && sent.length !== 0">
      <div v-for="msg in sent" :key="msg._id">
        <article v-if="editing !== msg._id">
          <ScheduledMessageComponent
            v-if="editing !== msg._id"
            :message="msg"
            :status="new Date(msg.scheduledTime).getTime() > Date.now() ? 'editable' : 'locked'"
            @refreshMessages="getScheduledMessages"
            @editMessage="updateEditing"
          />
        </article>
        <EditScheduledMessageForm v-else :message="msg" @refreshMessages="getScheduledMessages" @editMessage="updateEditing" />
      </div>
    </section>
    <article v-else-if="loaded">No sent messages found!</article>
    <article v-else>Loading...</article>
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
