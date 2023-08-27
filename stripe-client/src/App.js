import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Register from "./scenes/Register";
import { auth } from "./auth";
import { useEffect } from "react";
import Plans from "./scenes/Plans";
import { useAuthState } from "react-firebase-hooks/auth";
import Checkout from "./scenes/Checkout";
import Home from "./scenes/Home";
import Logout from "./scenes/Logout";
export default function App() {
  // logout();
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <>Loading..</>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} /> {/*also for login*/}
        <Route path="/plans" element={<Plans user={user} />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}
