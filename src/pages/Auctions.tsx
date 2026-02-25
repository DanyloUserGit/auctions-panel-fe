import { useAuth } from "../hooks/useAuth";
import { api } from "../http";

export default function Auctions() {
  const {logout} = useAuth()
  const me = async() => {
    const res = await api.get("/auth/me");
    console.log(res.data)
  }
  const logoutfn = async() => {
    await logout()
  }
  return <div><button onClick={me}>Me</button>
  <button onClick={logoutfn}>Logout</button>
  </div>;
}