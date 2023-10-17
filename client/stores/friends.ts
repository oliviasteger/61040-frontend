import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserStore } from "./user";

import { fetchy } from "@/utils/fetchy";

export const useFriendsStore = defineStore(
  "friends",
  () => {
    const friends = ref<Array<string>>([]);
    const sentRequests = ref<Array<Record<string, string>>>([]);
    const receivedRequests = ref<Array<Record<string, string>>>([]);
    const user = useUserStore();

    const resetStore = () => {
      friends.value = [];
      sentRequests.value = [];
      receivedRequests.value = [];
    };

    const fetchFriendData = async () => {
      friends.value = await fetchy("/api/friends", "GET");

      const sentResults: {
        from: string;
        to: string;
        status: string;
      }[] = await fetchy("/api/friend/requests", "GET");

      // Filter out users who are already friends or who have rejected the request
      sentRequests.value = sentResults.filter((request) => {
        const fromUser = request.from == user.currentUsername;
        const isFriendAlready = friends.value.includes(request.to);
        const statusIsPending = request.status == "pending";
        return fromUser && !isFriendAlready && statusIsPending;
      });

      const receivedResults: {
        from: string;
        to: string;
        status: string;
      }[] = await fetchy("/api/friend/requests", "GET");

      // Filter out users who are already friends or requests that have already been accepted
      receivedRequests.value = receivedResults.filter((request) => {
        const fromUser = request.to == user.currentUsername;
        const isFriendAlready = friends.value.includes(request.from);
        const statusIsPending = request.status == "pending";
        return fromUser && !isFriendAlready && statusIsPending;
      });
    };

    const sendRequest = async (user: string, phone: string) => {
      await fetchy(`/api/friend/requests/${user}`, "POST", { body: { phone: phone } });
      await fetchFriendData();
    };

    const acceptRequest = async (user: string) => {
      await fetchy(`/api/friend/accept/${user}`, "PUT");
      await fetchFriendData();
    };

    const rejectRequest = async (user: string) => {
      await fetchy(`/api/friend/reject/${user}`, "PUT");
      await fetchFriendData();
    };

    const deleteRequest = async (user: string) => {
      await fetchy(`/api/friend/requests/${user}`, "DELETE");
      await fetchFriendData();
    };

    const deleteFriend = async (user: string) => {
      await fetchy(`/api/friends/${user}`, "DELETE");
      await fetchFriendData();
    };

    return {
      friends,
      sentRequests,
      receivedRequests,
      fetchFriendData,
      sendRequest,
      acceptRequest,
      rejectRequest,
      deleteRequest,
      deleteFriend,
      resetStore,
    };
  },
  { persist: true },
);
