import {
  AccountBalanceWallet,
  Autorenew,
  Favorite,
  Gavel,
  Group,
  History,
  Info,
  Inventory,
  Menu as MenuIcon,
  Notifications,
  ReceiptLong,
  School,
  Settings,
  ShoppingCart,
} from '@mui/icons-material';
import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMobile } from '../hooks/useMobile';
import DrawerContent from './DrawerContent';

const drawerWidth = 280;
const closedDrawerWidth = 72;

export default function Sidebar() {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false); // На ПК відкритий, на мобільних закритий
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleMouseEnter = () => {
    if (!isMobile) setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsOpen(false);
  };

  const menuItems = [
    {
      group: 'Торгівля',
      items: [
        { text: 'Аукціони', icon: <Gavel />, path: '/auctions' },
        { text: 'Обране', icon: <Favorite />, path: '/favorites' },
        { text: 'Замовлення', icon: <ShoppingCart />, path: '/orders' },
        { text: 'Покупки', icon: <ReceiptLong />, path: '/purchases' },
        { text: 'В наявності', icon: <Inventory />, path: '/inventory' },
      ],
    },
    {
      group: 'Фінанси',
      items: [
        {
          text: 'Розрахунок',
          icon: <AccountBalanceWallet />,
          path: '/accounting',
        },
        { text: 'Процеси', icon: <Autorenew />, path: '/processes' },
        {
          text: 'Баланси',
          icon: <AccountBalanceWallet className="text-primary" />,
          path: '/balances',
        },
      ],
    },
    {
      group: 'Система',
      items: [
        {
          text: 'Сповіщення',
          icon: <Notifications />,
          path: '/notifications/list',
        },
        { text: 'Інформація', icon: <Info />, path: '/info' },
        { text: 'Навчання', icon: <School />, path: '/learning' },
      ],
    },
    {
      group: 'Адміністрування',
      items: [
        { text: 'Налаштування', icon: <Settings />, path: '/settings' },
        { text: 'Працівники', icon: <Group />, path: '/workers' },
        { text: 'Всі дії', icon: <History />, path: '/logs' },
      ],
    },
  ];

  return (
    <>
      {/* Мобільна шапка */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: 'white',
            color: 'black',
            boxShadow: 'none',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {menuItems
                .flatMap((g) => g.items)
                .find((i) => i.path === location.pathname)?.text || 'Панель'}
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Сайдбар */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: isMobile ? 0 : closedDrawerWidth, // Важливо: в потоці документа займає лише 72px
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen || isMobile ? drawerWidth : closedDrawerWidth,
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            boxSizing: 'border-box',
            borderRight: '1px solid #e2e8f0',
            boxShadow:
              isOpen && !isMobile ? '10px 0 25px rgba(0,0,0,0.05)' : 'none',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          },
        }}
      >
        <DrawerContent
          isOpen={isOpen}
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
          handleNavigation={handleNavigation}
          menuItems={menuItems}
        />
      </Drawer>

      {/* Відступ зверху для мобільних */}
      {isMobile && <Toolbar />}
    </>
  );
}
