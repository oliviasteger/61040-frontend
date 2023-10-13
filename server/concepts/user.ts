import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface UserDoc extends BaseDoc {
  username: string;
  password: string;
  phone: string;
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");
  private readonly phoneLength = 10;
  private readonly lineNumberLength = 4;

  async create(username: string, password: string, phone: string) {
    await this.canCreate(username, password, phone);
    const _id = await this.users.createOne({ username, password, phone });
    return { msg: "User created successfully!", user: await this.users.readOne({ _id }) };
  }

  private sanitizeUser(user: UserDoc) {
    // eslint-disable-next-line
    const { password, phone, ...rest } = user; // remove password and phone number
    return rest;
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async getUserByUsername(username: string) {
    const user = await this.users.readOne({ username });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async idsToUsernames(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });

    // Store strings in Map because ObjectId comparison by reference is wrong
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.username ?? "DELETED_USER");
  }

  async getUsers(username?: string) {
    // If username is undefined, return all users by applying empty filter
    const filter = username ? { username } : {};
    const users = (await this.users.readMany(filter)).map(this.sanitizeUser);
    return users;
  }

  async authenticate(username: string, password: string) {
    const user = await this.users.readOne({ username, password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async isValidLineNumber(_id: ObjectId, phone: string) {
    const user = await this.users.readOne({ _id });

    if (!user) {
      throw new NotAllowedError(`User not found!`);
    }

    this.isValidPhone(phone, this.lineNumberLength);

    if (user.phone.substring(user.phone.length - 4) !== phone) {
      throw new NotAllowedError(`Phone number does not match records.`);
    }
  }

  async update(_id: ObjectId, update: Partial<UserDoc>) {
    if (update.username !== undefined) {
      await this.isUsernameUnique(update.username);
    }

    if (update.phone !== undefined) {
      this.isValidPhone(update.phone, this.phoneLength);
    }

    await this.users.updateOne({ _id }, update);
    return { msg: "User updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async userExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  private async canCreate(username: string, password: string, phone: string) {
    if (!username || !password) {
      throw new BadValuesError("Username and password must be non-empty!");
    }
    this.isValidPhone(phone, this.phoneLength);
    await this.isUsernameUnique(username);
  }

  private isValidPhone(phone: string, length: number) {
    if (phone.length !== length || !/^[0-9]*$/.test(phone)) {
      throw new BadValuesError(`Phone must be a ${length}-digit number!`);
    }
  }

  private async isUsernameUnique(username: string) {
    if (await this.users.readOne({ username })) {
      throw new NotAllowedError(`User with username ${username} already exists!`);
    }
  }
}
