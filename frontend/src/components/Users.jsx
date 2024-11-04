import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant";

const Users = () => {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);

  const ref = useRef();

  async function getUsers() {
    const response = await axios.get(
      BACKEND_URL + "/api/v1/user/bulk?filter=" + filter,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    setUsers(response.data.users);
  }

  useEffect(() => {
    clearTimeout(ref.current);

    ref.current = setTimeout(getUsers, 200);
  }, [filter]);

  return (
    <div>
      <div className="font-bold mt-6 text-lg">Users</div>

      <div className="my-2">
        <input
          className="w-full px-2 py-1 border rounded border-slate-200"
          type="text"
          placeholder="Search users..."
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      </div>

      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

const User = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>

        <div className="flex flex-col justify-center h-full">
          {user.firstName} {user.lastName}
        </div>
      </div>

      <div className="flex flex-col justify-center h-full">
        <Button
          label={"Send Money"}
          onClick={() => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
        />
      </div>
    </div>
  );
};

export default Users;
