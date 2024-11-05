import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import { useCallback, useLayoutEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import PasswordInputBox from "../components/PasswordInputBox";

export default function SignIn() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
  }, [username]);

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
        <div className="rounded-lg bg-white w-80 sm:w-96 text-center py-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />

          <InputBox
            label={"Email"}
            placeholder={"johndoe@gmail.com"}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          {username.length > 0 && !validateEmail() && (
            <p className="text-red-500 text-sm mt-0.5 ml-2 text-left">
              Please enter a valid email address.
            </p>
          )}

          <PasswordInputBox
            label={"Password"}
            placeholder={"123456"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {password.length > 0 && password.length < 6 && (
            <p className="text-red-500 text-sm mt-0.5 ml-2 text-left">
              Password must be of min. 6 and max. 20 characters
            </p>
          )}

          <div className="pt-4">
            <Button
              disabled={
                !validateEmail() || password.length < 6 || password.length > 20
              }
              label={"Sign in"}
              onClick={HandleSignIn}
            />
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
