import React from 'react';
import PageHeader from 'components/common/PageHeader';
import UserTableContainer from './UserTableContainer';

const UserContainer = () => {
  return (
    <section>
      <PageHeader title="Users" />
      <UserTableContainer />
    </section>
  );
};

export default UserContainer;
