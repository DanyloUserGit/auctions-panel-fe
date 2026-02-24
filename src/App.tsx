import { Route, Routes, Navigate } from "react-router";
import LoginFrom from "./components/LoginFrom";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import Orders from "./pages/Orders";
import Purchases from "./pages/Purchases";
import Inventory from "./pages/Inventory";
import Favorite from "./pages/Favorite";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginFrom />} />

      <Route path="/" element={<Home />}>
        <Route index element={<Navigate to="/auctions" replace />} />
        <Route path="auctions" element={<Auctions />} />
        <Route path="favorites" element={<Favorite />} />
        <Route path="orders" element={<Orders />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}

export default App;
