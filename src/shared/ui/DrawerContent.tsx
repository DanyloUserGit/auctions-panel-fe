import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Logout,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useAuth } from '../../features/auth/model/useAuth';
import { useNavigate } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  isOpen: boolean;
  isMobile: boolean;
  toggleDrawer: () => void;
  handleNavigation: (path: string) => void;
  menuItems: {
    group: string;
    items: {
      text: string;
      icon: React.ReactNode;
      path: string;
    }[];
  }[];
}
export default function DrawerContent({
  isOpen,
  isMobile,
  toggleDrawer,
  handleNavigation,
  menuItems,
}: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
      }}
    >
      {/* Header: Профіль */}
      <Box
        onClick={() => navigate('/me')}
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: isOpen || isMobile ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isOpen || isMobile ? 80 : 120,
          gap: isOpen || isMobile ? 2 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'var(--color-primary)',
            width: isOpen || isMobile ? 40 : 32,
            height: isOpen || isMobile ? 40 : 32,
          }}
        >
          <AccountCircle />
        </Avatar>

        {(isOpen || isMobile) && (
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" noWrap color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        )}

        {!isMobile && (
          <IconButton
            size="small"
            onClick={toggleDrawer}
            sx={{ ml: isOpen ? 'auto' : 0 }}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Меню */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {menuItems.map((group) => (
          <Fragment key={group.group}>
            <Box sx={{ mb: 2 }}>
              {(isOpen || isMobile) && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    fontWeight: 'bold',
                    color: 'text.disabled',
                    textTransform: 'uppercase',
                  }}
                >
                  {group.group}
                </Typography>
              )}
              <List sx={{ px: 1 }}>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem
                      key={item.text}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          minHeight: 48,
                          justifyContent:
                            isOpen || isMobile ? 'initial' : 'center',
                          backgroundColor: isActive
                            ? 'rgba(25, 118, 210, 0.08)'
                            : 'transparent',
                          color: isActive ? 'primary.main' : 'inherit',
                          borderRadius: 1.5,
                          px: 2.5,
                          mb: 0.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: isOpen || isMobile ? 2 : 'auto',
                            justifyContent: 'center',
                            color: isActive ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            opacity: isOpen || isMobile ? 1 : 0,
                            display: isOpen || isMobile ? 'block' : 'none',
                          }}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: isActive ? 700 : 500,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Fragment>
        ))}

        <Box sx={{ mt: 'auto', px: 1, pb: 2 }}>
          <Divider sx={{ mb: 1, mx: 1 }} />
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={logout}
              sx={{
                minHeight: 48,
                justifyContent: isOpen || isMobile ? 'initial' : 'center',
                borderRadius: 1.5,
                px: 2.5,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen || isMobile ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'error.main',
                }}
              >
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Вийти з акаунта"
                sx={{
                  opacity: isOpen || isMobile ? 1 : 0,
                  display: isOpen || isMobile ? 'block' : 'none',
                }}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Box>
  );
}
