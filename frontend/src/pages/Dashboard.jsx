import { useLayoutEffect, useState } from "react";
import Appbar from "../components/Appbar";
import Balance from "../components/Balance";
import Users from "../components/Users";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  const navigate = useNavigate();

  useLayoutEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setLoading(false);
        setFirstName(response.data.name);
      })
      .catch(() => {
        navigate("/signup");
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Appbar name={firstName} />
      <div className="m-8">
        <Balance value={"10,000"} />
        <Users />
      </div>
    </div>
  );
};

export default Dashboard;
