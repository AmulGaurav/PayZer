import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BACKEND_URL } from "../../utils/constant";
import Loader from "../components/Loader";

const SendMoney = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const navigate = useNavigate();

  async function handleTransfer() {
    await axios.post(
      BACKEND_URL + "/api/v1//account/transfer",
      {
        to: id,
        amount,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    alert("Success ✅");
    setAmount("");
  }

  useLayoutEffect(() => {
    axios
      .get(BACKEND_URL + "/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        navigate("/signup");
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min w-96 p-4 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>

          <div className="p-6 space-y-2">
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="amount"
                >
                  Amount (in Rs)
                </label>
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </div>

              <button
                className="w-full py-2 rounded-md text-sm text-white font-medium transition-colors h-10 px-4 bg-green-500"
                onClick={handleTransfer}
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
