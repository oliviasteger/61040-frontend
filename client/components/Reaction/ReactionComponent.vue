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
      fetchedReactions = await fetchy(`/api/posts/${props.post._id}/reactions`, "GET");
    } catch {
      return;
    }
  } else {
    try {
      fetchedReactions = await fetchy(`/api/threads/${props.thread._id}/reactions`, "GET");
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
      await fetchy(`/api/posts/${props.post._id}/reactions`, "DELETE");
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`/api/threads/${props.thread._id}/reactions`, "DELETE");
    } catch {
      return;
    }
  }

  await getReactions();
};

const createReaction = async (content: string) => {
  if (props.post) {
    try {
      await fetchy(`/api/posts/${props.post._id}/reactions`, "POST", { body: { content } });
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`/api/threads/${props.thread._id}/reactions`, "POST", { body: { content } });
    } catch {
      return;
    }
  }

  await getReactions();
};

const editReaction = async (content: string) => {
  if (props.post) {
    try {
      await fetchy(`/api/posts/${props.post._id}/reactions`, "PATCH", { body: { update: { content } } });
    } catch {
      return;
    }
  } else if (props.thread) {
    try {
      await fetchy(`/api/threads/${props.thread._id}/reactions`, "PATCH", { body: { update: { content } } });
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
  <article>
    <div class="base">
      <div class="reactions" v-if="loaded">
        <span v-if="topReactions.length !== 0">
          <span v-for="(reaction, i) in topReactions" :key="reaction">
            <span> {{ reaction }} </span> <span> {{ tally[reaction] }} </span>
            <span v-if="i != topReactions.length - 1"> &nbsp; </span>
          </span>
        </span>
        <span v-else> No reactions found! </span>
      </div>
      <menu v-if="reactions.filter((reaction) => reaction.user === currentUsername).length !== 0">
        <input class="emoji-input" type="text" v-model="content" placeholder="Add an emoji!" />
        <li><button class="pure-button" @click="editReaction(content)">Update</button></li>
        <li><button class="button-error pure-button" @click="deleteReaction">Delete</button></li>
      </menu>
      <menu v-if="reactions.filter((reaction) => reaction.user === currentUsername).length === 0">
        <input class="emoji-input" type="text" v-model="content" placeholder="Add an emoji!" />
        <li><button class="pure-button" @click="createReaction(content)">React</button></li>
      </menu>
    </div>
  </article>
</template>
