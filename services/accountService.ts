import { getUsersById } from '../pages/api/user/userApiHandler';

export class AccountService {
  userId: string;
  user: any;

  constructor(userId: string) {
    this.userId = userId;
  }

  async init() {
    this.user = await getUsersById(this.userId);
    return this;
  }

  get Id() {
    return this.user.id;
  }

  get Email() {
    return this.user.email;
  }

  get Name() {
    return this.user.name;
  }

  get Handle() {
    return this.user.handle;
  }

}