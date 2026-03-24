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
import type { UserRole } from '../../features/auth/model/user-schema';
import { useMobile } from '../hooks/useMobile';
import DrawerContent from './DrawerContent';

const drawerWidth = 280;
const closedDrawerWidth = 72;
export interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: UserRole[]; // Тут TS буде суворим
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}
export default function Sidebar() {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
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

  const menuItems: MenuGroup[] = [
    {
      group: 'Торгівля',
      items: [
        {
          text: 'Аукціони',
          icon: <Gavel />,
          path: '/auctions',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Обране',
          icon: <Favorite />,
          path: '/favorites',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Замовлення',
          icon: <ShoppingCart />,
          path: '/orders',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Покупки',
          icon: <ReceiptLong />,
          path: '/purchases',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'В наявності',
          icon: <Inventory />,
          path: '/inventory',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
      ],
    },
    {
      group: 'Фінанси',
      items: [
        {
          text: 'Розрахунок',
          icon: <AccountBalanceWallet />,
          path: '/accounting',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Процеси',
          icon: <Autorenew />,
          path: '/processes',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Баланси',
          icon: <AccountBalanceWallet className="text-primary" />,
          path: '/balances',
          roles: ['Admin', 'SuperAdmin', 'User'],
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
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Інформація',
          icon: <Info />,
          path: '/info',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Навчання',
          icon: <School />,
          path: '/learning',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
      ],
    },
    {
      group: 'Адміністрування',
      items: [
        {
          text: 'Налаштування',
          icon: <Settings />,
          path: '/settings',
          roles: ['Admin', 'SuperAdmin', 'User'],
        },
        {
          text: 'Працівники',
          icon: <Group />,
          path: '/workers',
          roles: ['Admin', 'SuperAdmin'],
        },
        {
          text: 'Всі дії',
          icon: <History />,
          path: '/logs',
          roles: ['Admin', 'SuperAdmin'],
        },
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
