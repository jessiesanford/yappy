import { getUsersById } from '../pages/api/handlers/userApiHandler';
import { User } from 'next-auth';

export class AccountService {
  user: any;

  get Id() {
    return this.user?.id;
  }

  get Email() {
    return this.user?.email;
  }

  get Name() {
    return this.user?.name;
  }

  get Handle() {
    return this.user?.handle;
  }

  constructor(user: User) {
    this.user = user;
  }

}