import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
