import { User } from "./app";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestDoc, FriendRequestNotFoundError } from "./concepts/friend";
import { PostAuthorNotMatchError, PostDoc } from "./concepts/post";
import { ProfileDoc } from "./concepts/profile";
import { ReactionDoc } from "./concepts/reaction";
import { RecapDoc } from "./concepts/recap";
import { ScheduledMessageDoc } from "./concepts/scheduledmessage";
import { ThreadDoc } from "./concepts/thread";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert PostDoc into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: PostDoc | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    const tagged = await User.idsToUsernames(post.tagged);

    return { ...post, author: author.username, tagged: tagged };
  }

  /**
   * Same as {@link post} but for an array of PostDoc for improved performance.
   */
  static async posts(posts: PostDoc[]) {
    const authors = await User.idsToUsernames(posts.map((post) => post.author));
    const tagged: string[][] = [];

    for (const post of posts) {
      tagged.push(await User.idsToUsernames(post.tagged));
    }

    return posts.map((post, i) => ({ ...post, author: authors[i], tagged: tagged[i] }));
  }

  static async messages(messages: ScheduledMessageDoc[]) {
    const users = await User.idsToUsernames(messages.map((message) => message.user));
    const recipients: string[][] = [];

    for (const message of messages) {
      recipients.push(await User.idsToUsernames(message.recipients));
    }

    return messages.map((message, i) => ({ ...message, user: users[i], recipients: recipients[i] }));
  }

  /**
   * Convert FriendRequestDoc into more readable format for the frontend
   * by converting the ids into usernames.
   */
  static async friendRequests(requests: FriendRequestDoc[]) {
    const from = requests.map((request) => request.from);
    const to = requests.map((request) => request.to);
    const usernames = await User.idsToUsernames(from.concat(to));
    return requests.map((request, i) => ({ ...request, from: usernames[i], to: usernames[i + requests.length] }));
  }

  static async profile(profile: ProfileDoc | null) {
    if (!profile) {
      return profile;
    }

    const user = await User.getUserById(profile.user);

    return { ...profile, user: user.username };
  }

  static async reactions(reactions: ReactionDoc[]) {
    const usernames = await User.idsToUsernames(reactions.map((reaction) => reaction.user));
    return reactions.map((reaction, i) => ({ ...reaction, user: usernames[i] }));
  }

  static async threads(threads: ThreadDoc[]) {
    const usernames = await User.idsToUsernames(threads.map((thread) => thread.user));
    return threads.map((thread, i) => ({ ...thread, user: usernames[i] }));
  }

  static async recap(recap: RecapDoc) {
    const user = await User.getUserById(recap.user);
    const leastInteractedWith = await User.idsToUsernames(recap.leastInteractedWith);
    const mostInteractedWith = await User.idsToUsernames(recap.mostInteractedWith);

    return { ...recap, user: user, leastInteractedWith: leastInteractedWith, mostInteractedWith: mostInteractedWith };
  }
}

Router.registerError(PostAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
