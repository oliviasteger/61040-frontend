<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
const props = defineProps(["post", "thread"]);
const reactions = ref<Array<Record<string, string>>>([]);
let tally: Record<string, number>;
let topReactions = ref<Array<string>>([]);
const content = ref("");

const { currentUsername } = storeToRefs(useUserStore());

async function getReactions() {
  tally = {};
  let fetchedReactions: { user: string; content: string; target: string }[];
  if (props.post) {
    try {
      fetchedReactions = await fetchy(`api/posts/${props.post._id}/reactions`, "GET");
    } catch {
      return;
    }
  } else {
    try {
      fetchedReactions = await fetchy(`api/threads/${props.thread._id}/reactions`, "GET");
    } catch {
      return;
    }
  }

  reactions.value = fetchedReactions;

  for (const reaction of fetchedReactions) {
    if (Object.keys(tally).includes(reaction.content)) tally[reaction.content] += 1;
    else tally[reaction.content] = 1;

    if (reaction.user == currentUsername.value) content.value = reaction.content;
  }

  topReactions.value = Object.keys(tally).sort((a, b) => tally[b] - tally[a]);
  if (topReactions.value.length > 5) topReactions.value.length = 5;
}

const deleteReaction = async () => {
  if (props.post) {
    try {
      await fetchy(`api/posts/${props.post._id}/reactions`, "DELETE");
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`api/threads/${props.thread._id}/reactions`, "DELETE");
    } catch {
      return;
    }
  }

  await getReactions();
};

const createReaction = async (content: string) => {
  if (props.post) {
    try {
      await fetchy(`api/posts/${props.post._id}/reactions`, "POST", { body: { content } });
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`api/threads/${props.thread._id}/reactions`, "POST", { body: { content } });
    } catch {
      return;
    }
  }

  await getReactions();
};

const editReaction = async (content: string) => {
  if (props.post) {
    try {
      await fetchy(`api/posts/${props.post._id}/reactions`, "PATCH", { body: { update: { content } } });
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`api/threads/${props.thread._id}/reactions`, "PATCH", { body: { update: { content } } });
    } catch {
      return;
    }
  }

  await getReactions();
};

onBeforeMount(async () => {
  await getReactions();
  loaded.value = true;
});
</script>

<template>
  <div class="reaction">
    <div class="reactions" v-if="loaded">
      <span v-if="topReactions.length !== 0">
        <span v-for="reaction in topReactions" :key="reaction">
          <span> {{ reaction }} </span> <span> {{ tally[reaction] }} </span> &nbsp;
        </span>
      </span>
      <span v-else> No reactions yet! </span>
    </div>
    <div class="base">
      <input type="text" maxlength="1" v-model="content" placeholder="Add emoji reaction!" />
      <menu v-if="reactions.filter((reaction) => reaction.user === currentUsername).length !== 0">
        <li><button class="btn-small pure-button" @click="editReaction(content)">Update Reaction</button></li>
        <li><button class="button-error btn-small pure-button" @click="deleteReaction">Delete</button></li>
      </menu>
      <menu v-if="reactions.filter((reaction) => reaction.user === currentUsername).length === 0">
        <li><button class="btn-small pure-button" @click="createReaction(content)">React</button></li>
      </menu>
    </div>
  </div>
</template>

<style scoped>
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

.base article:only-child {
  margin-left: auto;
}

.reaction {
  background-color: #fff;
  padding: 1em;
  border-radius: 1em;
  margin-bottom: 1em;
}

.reactions {
  text-align: center;
  padding: 1em;
  background-color: var(--base-bg);
  border-radius: 1em;
  margin-bottom: 1em;
}
</style>
