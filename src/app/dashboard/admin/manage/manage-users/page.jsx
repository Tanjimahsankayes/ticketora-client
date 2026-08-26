import ManageUsersPage from '@/components/ManageUsers';
import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';

const ManageUsers = () => {

  const user = getUserSession()
  // if (!user === 'admin') {
  //   redirect = "/";
  // }

  return (
    <div>
      <ManageUsersPage></ManageUsersPage>
    </div>
  );
};

export default ManageUsers;