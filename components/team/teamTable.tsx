import { useEffect, useState } from 'react';
import { User } from '.prisma/client';
import { findUsersByEmail } from '../../pages/api/handlers/userApiHandler';
import { Dispatch, SetStateAction } from "react";

export const TeamTable = () => {
  const [searchText, setSearchText] = useState(null);

  return (
    <div className={'team-table'}>
      <UserSearch setSearchText={setSearchText}/>
      {searchText ? <UserSearchResults searchText={searchText} /> : null}
    </div>
  );
};

const UserSearch = ({ setSearchText }: { setSearchText: Dispatch<SetStateAction<null>> }) => {
  return (
    <div>
      <input type={'text'}
             onChange={(e) => {
               setSearchText(e.target.value);
             }}
             style={{ width: '100%' }}
             placeholder={'search for user...'}/>
    </div>
  );
};

const UserSearchResults = ({ searchText }: { searchText: string }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const res = findUsersByEmail(searchText).then((users) => {
      setUsers(users);
    });
  }, [searchText]);

  return (
    <div className={'user-results'}>
      {users.map((u: User, i: number) => <UserRow key={i} user={u} />)}
    </div>
  )
}

const UserRow = ({ user }: { user: User }) => {
  return (
    <div key={user.id} className={'user-row'}>
      <div className={'user-cell'}>{user.handle}</div>
      <div className={'user-cell'}>{user.email}</div>
    </div>
  );
}