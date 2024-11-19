import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../utils/constant";

const Balance = () => {
  const [balance, setBalance] = useState(0);

  async function getBalance() {
    const response = await axios.get(BACKEND_URL + "/api/v1/account", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    setBalance(response.data.balance);
  }

  useEffect(() => {
    getBalance();
  }, [balance]);
  
  return <div className="text-lg font-bold">Your Balance - Rs {balance}</div>;
};

export default Balance;
