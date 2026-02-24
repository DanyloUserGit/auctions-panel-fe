import { Box } from "@mui/material";
import Sidebar from "../components/ui/Sidebar";
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
