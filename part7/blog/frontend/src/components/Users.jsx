import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <div>
        <h2>Users</h2>
        <div>
            {users.map((user) => (
              <div key={user.id}>
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
              </div>
            ))}
        </div>
    </div>
  );
};

export default Users;