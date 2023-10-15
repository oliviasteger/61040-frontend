import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";

export interface AnnouncementDoc extends BaseDoc {
  user: ObjectId;
  body: string;
}

export default class AnnouncementConcept {
  public readonly announcements = new DocCollection<AnnouncementDoc>("announcements");
  private readonly activities = {
    Winter: ["Invite a friend to go to a museum!", "Host a movie night and invite your friends!"],
    Spring: ["Set up a picnic with some friends!", "Invite a friend to go on a walk and see some spring blooms!"],
    Summer: ["Try to catch up with friends over ice cream!", "Attend an outdoor concert with some friends!"],
    Fall: [
      "Plan a trip to a local pumpkin patch with friends!",
      "Taste test donut varities with your friends!",
      "Happy fall! Invite a friend to get a fall-themed drink this week.",
      "Try arranging a group activity, like apple picking or taste testing pumpkin pies!",
    ],
  };

  async getAnnouncement(user: ObjectId, month: number) {
    let activity;
    if (month in [11, 0, 1]) {
      activity = this.activities.Winter[Math.floor(Math.random() * this.activities.Winter.length)];
    } else if (month in [2, 3, 4]) {
      activity = this.activities.Spring[Math.floor(Math.random() * this.activities.Spring.length)];
    } else if (month in [5, 6, 7]) {
      activity = this.activities.Summer[Math.floor(Math.random() * this.activities.Summer.length)];
    } else {
      activity = this.activities.Fall[Math.floor(Math.random() * this.activities.Fall.length)];
    }

    const id = await this.announcements.createOne({ user: user, body: activity });
    return this.announcements.readOne({ _id: id });
  }
}
