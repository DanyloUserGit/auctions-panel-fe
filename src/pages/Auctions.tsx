import { api } from "../http";

export default function Auctions() {
  const me = async() => {
    const res = await api.get("/auth/me");
    console.log(res.data)
  }
  return <div><button onClick={me}>Me</button></div>;
}
