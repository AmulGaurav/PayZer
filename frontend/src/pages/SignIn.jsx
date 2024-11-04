import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { useLayoutEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function HandleSignIn() {
    const response = await axios.post(BACKEND_URL + "/api/v1/user/signin", {
      password,
      username,
    });

    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  }

  useLayoutEffect(() => {
    axios
      .get(BACKEND_URL + "/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        navigate("/dashboard");
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-96 text-center py-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />

          <InputBox
            label={"Email"}
            placeholder={"johndoe@gmail.com"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <InputBox
            label={"Password"}
            placeholder={"123456"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="pt-4">
            <Button label={"Sign in"} onClick={HandleSignIn} />
          </div>
          <BottomWarning
            label={"Don't have an account"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}
