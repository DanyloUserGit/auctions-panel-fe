import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Gavel,
  Favorite,
  ShoppingCart,
  AccountBalanceWallet,
  ReceiptLong,
  Autorenew,
  Inventory,
  Settings,
  Group,
  History,
  ChevronLeft,
  AccountCircle,
  ChevronRight,
  Notifications,
  Info,
  School,
} from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

const drawerWidth = 280;
const closedDrawerWidth = 72; // Оптимально для іконок
const menuItems = [
  {
    group: "Торгівля",
    items: [
      { text: "Аукціони", icon: <Gavel />, path: "/auctions" },
      { text: "Обране", icon: <Favorite />, path: "/favorites" },
      { text: "Замовлення", icon: <ShoppingCart />, path: "/orders" },
      { text: "Покупки", icon: <ReceiptLong />, path: "/purchases" },
      { text: "В наявності", icon: <Inventory />, path: "/inventory" },
    ],
  },
  {
    group: "Фінанси",
    items: [
      {
        text: "Розрахунок",
        icon: <AccountBalanceWallet />,
        path: "/accounting",
      },
      { text: "Процеси", icon: <Autorenew />, path: "/processes" },
      // Тут можна використати клас Tailwind 'text-primary' замість color="primary"
      {
        text: "Баланси",
        icon: <AccountBalanceWallet className="text-primary" />,
        path: "/balances",
      },
    ],
  },
  {
    group: "Система", // Створимо нову групу або додамо в Адміністрування
    items: [
      { text: "Сповіщення", icon: <Notifications />, path: "/notifications" },
      { text: "Інформація", icon: <Info />, path: "/info" },
      { text: "Навчання", icon: <School />, path: "/learning" }, // ОСЬ ВІН
    ],
  },
  {
    group: "Адміністрування",
    items: [
      { text: "Налаштування", icon: <Settings />, path: "/settings" },
      { text: "Працівники", icon: <Group />, path: "/staff" },
      { text: "Всі дії", icon: <History />, path: "/logs" },
    ],
  },
];
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const toggleDrawer = () => setIsOpen(!isOpen);

  // Спільний стиль для Drawer та його паперу
  const drawerStyles = {
    width: isOpen ? drawerWidth : closedDrawerWidth,
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Плавна анімація
    overflowX: "hidden",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    borderRight: "1px solid #e2e8f0",
  };
  const location = useLocation();
  const navigation = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? drawerWidth : closedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        [`& .MuiDrawer-paper`]: drawerStyles,
      }}
    >
      {/* Header: Профіль + Кнопка */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: isOpen ? "row" : "column", // Змінюємо напрямок у закритому стані
          alignItems: "center",
          justifyContent: "center",
          minHeight: isOpen ? 80 : 120, // Збільшуємо висоту у закритому стані, щоб рознести елементи
          gap: isOpen ? 2 : 1, // Невеликий відступ між аватаром і стрілкою
          transition: "all 0.3s ease",
        }}
      >
        {/* Блок аватара та тексту */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: isOpen ? "auto" : "100%",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "var(--color-primary)",
              flexShrink: 0,
              width: isOpen ? 40 : 32, // Трохи зменшуємо аватар, коли закрито
              height: isOpen ? 40 : 32,
            }}
          >
            <AccountCircle />
          </Avatar>

          {isOpen && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                noWrap
                sx={{ fontWeight: "bold" }}
              >
                Імя Прізвище
              </Typography>
              <Typography variant="caption" noWrap color="text.secondary">
                Роль
              </Typography>
            </Box>
          )}
        </Box>

        {/* Кнопка стрілки */}
        <IconButton
          size="small"
          onClick={toggleDrawer}
          sx={{
            ml: isOpen ? "auto" : 0,
            mt: isOpen ? 0 : 1,
            backgroundColor: isOpen ? "transparent" : "rgba(0,0,0,0.04)", // Легкий фон для видимості
            "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
          }}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider />

      {/* Меню */}
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          py: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {menuItems.map((group) => (
          <Box key={group.group} sx={{ mb: 2 }}>
            {isOpen && (
              <Typography
                variant="caption"
                sx={{
                  px: 3,
                  fontWeight: "bold",
                  color: "text.disabled",
                  textTransform: "uppercase",
                }}
              >
                {group.group}
              </Typography>
            )}
            <List sx={{ px: 1 }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path; // Визначаємо активний пункт меню
                return (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      onClick={() => navigation(item.path)}
                      sx={{
                        minHeight: 48,
                        justifyContent: isOpen ? "initial" : "center",
                        backgroundColor: isActive
                          ? "var(--color-primary-light)"
                          : "transparent",
                        color: isActive ? "var(--color-primary)" : "inherit",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "var(--color-primary-light)"
                            : "var(--color-sidebar-hover)",
                        },
                        px: 2.5,
                        borderRadius: 1.5,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isOpen ? 2 : "auto",
                          justifyContent: "center",
                          color: "var(--color-primary)",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: isOpen ? 1 : 0,
                          transition: "opacity 0.2s",
                          display: isOpen ? "block" : "none",
                        }}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
}
