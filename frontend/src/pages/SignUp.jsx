import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import axios from "axios";
import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant";
import Loader from "../components/Loader";
import PasswordInputBox from "../components/PasswordInputBox";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const validateEmail = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(username);
  }, [username]);

  async function handleSignUp() {
    const response = await axios.post(BACKEND_URL + "/api/v1/user/signup", {
      firstName,
      lastName,
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
        <div className="rounded-lg bg-white w-80 sm:w-96 text-center py-2 h-max px-4 shadow-lg">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <InputBox
            label={"First Name"}
            placeholder={"John"}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />

          <InputBox
            label={"Last Name"}
            placeholder={"Doe"}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />

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
              label={"Sign up"}
              onClick={handleSignUp}
              disabled={
                !firstName ||
                !lastName ||
                !validateEmail() ||
                password.length < 6 ||
                password.length > 20
              }
            />
          </div>
          <BottomWarning
            label={"Already have an account"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
}
