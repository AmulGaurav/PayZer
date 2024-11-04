import { createBrowserRouter, Link, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";

function App() {
  return <RouterProvider router={appRouter}></RouterProvider>;
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    errorElement: <Error />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <Error />,
  },
  {
    path: "/send",
    element: <SendMoney />,
    errorElement: <Error />,
  },
  {
    path: "*",
    element: (
      <div className="flex flex-col justify-center items-center mt-40">
        <div className="text-2xl font-bold">This route does not exist!</div>

        <div>
          Go to:{" "}
          <Link className="font-bold underline" to={"/dashboard"}>
            Home Page
          </Link>
        </div>
      </div>
    ),
  },
]);

export default App;
